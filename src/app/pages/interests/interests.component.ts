import { Component, EventEmitter, Output } from "@angular/core";
import { InterestInterface } from "@interfaces/interest.interface";
import { InterestService } from "@services/interest.service";
import { LoaderService } from "@services/loader.service";

@Component({
  selector: "app-interests",
  templateUrl: "interests.component.html",
})
export class InterestsComponent {
  @Output() onAdd: EventEmitter<void> = new EventEmitter<void>();

  interests: InterestInterface[] = [];
  search: string = null;
  total: number = 0;

  constructor() {
    this.load();
  }

  load(): void {
    LoaderService.show();
    InterestService.all(this.search).then((interests: InterestInterface[]) => {
      this.interests = interests;
      InterestService.total().then((total: number) => this.total = total);
    }).finally(() => LoaderService.hide());
  }

  add() {
    this.onAdd.emit();
  }
}
