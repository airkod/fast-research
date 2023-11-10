import { Component, ViewChild } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { InterestsComponent } from "@pages/interests/interests.component";
import { HistoryComponent } from "@pages/history/history.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  @ViewChild("interests") interests: InterestsComponent;
  @ViewChild("history") history: HistoryComponent;

  onSave() {
    this.tabGroup.selectedIndex = 0;
    this.interests.load();
  }

  onHistoryUpdate() {
    this.history.load();
  }
}
