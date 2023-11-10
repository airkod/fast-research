import { StorageService } from "@services/storage.service";
import { HistoryInterface } from "@interfaces/history.interface";
import { InterestInterface } from "@interfaces/interest.interface";

export class HistoryService {
  public static add(history: HistoryInterface): Promise<void> {
    return StorageService.add("history", {
      ...history,
      time: Math.ceil(Date.now() / 1000),
    });
  }

  public static today(filter: { interest?: InterestInterface, search?: string } = null): Promise<Array<HistoryInterface>> {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const from = Math.ceil(now.getTime() / 1000);

    return this.filter(
      filter,
      from,
      Date.now()
    );
  }

  public static yesterday(filter: { interest?: InterestInterface, search?: string } = null): Promise<Array<HistoryInterface>> {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const to = Math.ceil(now.getTime() / 1000);
    const from = to - 24 * 60 * 60;

    return this.filter(filter, from, to);
  }

  public static all(filter: { interest?: InterestInterface, search?: string } = null): Promise<Array<HistoryInterface>> {
    const beforeYesterday = new Date();
    beforeYesterday.setHours(0, 0, 0, 0);

    const to = (Math.ceil(beforeYesterday.getTime() / 1000)) - 24 * 60 * 60 * 2;

    return this.filter(filter, 0, to);
  }

  public static total(): Promise<number> {
    return new Promise(resolve => {
      StorageService.get<Array<HistoryInterface>>("history").then((history) => {
        resolve(history.length);
      });
    });
  }

  private static filter(
    filter: {
      interest?: InterestInterface,
      search?: string
    } = null,
    from: number = 0,
    to: number = 0,
  ): Promise<Array<HistoryInterface>> {
    return new Promise((resolve, reject) => {
      StorageService.get<Array<HistoryInterface>>("history")
        .then(history => {
          history = (history || []).filter((h: HistoryInterface) => h.time >= from && h.time < to);

          if (filter.search) {
            const search = filter.search.toLowerCase();
            history = history.filter(h => {
              if (h.interest.title.toLowerCase().includes(search)) {
                return true;
              }

              let includes = false;
              h.interest.keywords.forEach(keyword => {
                if (keyword.toLowerCase().includes(search)) {
                  includes = true;
                }
              });

              return includes
                || h.meta?.title?.toLowerCase().includes(search)
                || h.meta?.description?.toLowerCase().includes(search)
                || h.meta?.link?.toLowerCase().includes(search);
            });
          }

          if (filter.interest) {
            history = history.filter((h: HistoryInterface) => {
              return h.interest.id === filter.interest.id;
            });
          }

          resolve(history.reverse());
        })
        .catch(e => reject(e));
    });
  }
}
