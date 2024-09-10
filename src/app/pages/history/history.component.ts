import { Component, EventEmitter, Output } from "@angular/core";
import { HistoryInterface } from "@interfaces/history.interface";
import { HistoryService } from "@services/history.service";
import { LoaderService } from "@services/loader.service";
import { InterestService } from "@services/interest.service";
import { InterestInterface } from "@interfaces/interest.interface";

@Component({
  selector: "app-history",
  templateUrl: "history.component.html",
  styleUrls: [ "history.component.scss" ],
})
export class HistoryComponent {
  @Output() onAdd: EventEmitter<void> = new EventEmitter<void>();

  today: HistoryInterface[] = [];
  yesterday: HistoryInterface[] = [];
  all: HistoryInterface[] = [];

  interests: InterestInterface[] = [];

  filter: {
    interest?: InterestInterface,
    search?: string
  } = {
    interest: null,
    search: null,
  };

  total: number = 0;

  constructor() {
    Promise.all([
      HistoryService.total(),
      InterestService.all(),
    ]).then(([
      total,
      interests,
    ]) => {
      this.total = total;
      this.interests = interests;
    });

    this.load();
  }

  public load(quiet: boolean = false) {
    !quiet && LoaderService.show();

    Promise.all([
      HistoryService.today(this.filter),
      HistoryService.yesterday(this.filter),
      HistoryService.all(this.filter),

    ]).then(([
      today,
      yesterday,
      all,

    ]) => {
      this.today = today;
      this.yesterday = yesterday;
      this.all = all;

      !quiet && LoaderService.hide();
    });
  }

  public add(): void {
    this.onAdd.emit();
  }

  public interestSelected(): void {
    setTimeout(() => {
      this.load();
    }, 10);
  }
}
