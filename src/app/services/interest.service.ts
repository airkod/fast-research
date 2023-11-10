import { InterestInterface } from "@interfaces/interest.interface";
import { StorageService } from "@services/storage.service";

export class InterestService {
  public static add(title: string, keywords: Array<string>): Promise<void> {
    return StorageService.add("interests", {
      id: Date.now(),
      title,
      keywords,
    });
  }

  public static all(search: string = null): Promise<Array<InterestInterface>> {
    return new Promise((resolve, reject) => {
      StorageService.get<Array<InterestInterface>>("interests")
        .then(interests => {
          interests = interests || [];

          if (search) {
            search = search.toLowerCase();

            interests = interests.filter(interest => {
              if (interest.title.toLowerCase().includes(search)) {
                return true;
              }
              let includes = false;
              interest.keywords.forEach(keyword => {
                if (keyword.toLowerCase().includes(search)) {
                  includes = true;
                }
              });

              return includes;
            });
          }

          resolve(interests.reverse());
        })
        .catch(e => reject(e));
    });
  }

  public static delete(interest: InterestInterface): Promise<void> {
    return new Promise((resolve, reject) => {
      StorageService.get("interests")
        .then((interests: InterestInterface[]) => {
          interests = interests || [];
          interests = interests.filter(_interest => _interest.id !== interest.id);

          StorageService.set("interests", interests)
            .then(() => resolve())
            .catch(e => reject(e));
        })
        .catch(e => reject(e));
    });
  }

  public static total(): Promise<number> {
    return new Promise((resolve) => {
      StorageService
        .get("interests")
        .then((interests: InterestInterface[]) => {
          resolve(interests.length);
        });
    });
  }
}
