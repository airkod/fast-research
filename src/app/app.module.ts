import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InterestsComponent } from "@pages/interests/interests.component";
import { InterestFormComponent } from "@pages/interest-form/interest-form.component";
import { HistoryComponent } from "@pages/history/history.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { InterestComponent } from "@pages/interests/interest/interest.component";
import { MatListModule } from "@angular/material/list";
import { InterestService } from "@services/interest.service";
import { MatSelectModule } from "@angular/material/select";
import { HistoryItemComponent } from "@pages/history/history-item/history-item.component";
import { LinkPreviewComponent } from "@components/link-preview/link-preview.component";
import { OpenaiComponent } from "@components/openai/openai.component";
import { KeywordsComponent } from "@components/keywords/keywords.component";

@NgModule({
  declarations: [
    AppComponent,
    InterestsComponent,
    InterestFormComponent,
    HistoryComponent,
    InterestComponent,
    HistoryItemComponent,
    LinkPreviewComponent,
    OpenaiComponent,
    KeywordsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatExpansionModule,
    MatListModule,
    MatSelectModule,
  ],
  providers: [
    InterestService,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
