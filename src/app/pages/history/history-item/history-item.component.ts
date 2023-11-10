import { Component, Input } from "@angular/core";
import { HistoryInterface } from "@interfaces/history.interface";

@Component({
  selector: "app-history-item",
  templateUrl: "history-item.component.html",
  styleUrls: [ "history-item.component.scss" ],
})
export class HistoryItemComponent {
  @Input() history: HistoryInterface = null;
  state: "opened" | "closed" = "closed";

  public time(): string {
    const date = new Date(this.history.time * 1000);

    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    return  hours + ':' + minutes.substr(-2);
  }
}
