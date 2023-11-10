import { Component, ViewChild } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { InterestsComponent } from "@pages/interests/interests.component";
import { HistoryComponent } from "@pages/history/history.component";
import { MatDialog } from "@angular/material/dialog";
import { AboutComponent } from "@pages/about/about.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  @ViewChild("interests") interests: InterestsComponent;
  @ViewChild("history") history: HistoryComponent;

  constructor(private matDialog: MatDialog) {}

  onSave() {
    this.tabGroup.selectedIndex = 0;
    this.interests.load();
  }

  about() {
    this.matDialog.open(AboutComponent);
  }
}
