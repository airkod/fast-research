import { Component, EventEmitter, Input, Output } from "@angular/core";
import { InterestInterface } from "@interfaces/interest.interface";
import { OpenaiService } from "@services/openai.service";
import { LoaderService } from "@services/loader.service";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { PageService } from "@services/page.service";
import { OpenaiInterface } from "@interfaces/openai.interface";
import { HistoryService } from "@services/history.service";
import { MetaInterface } from "@interfaces/meta.interface";
import { InterestService } from "@services/interest.service";

@Component({
  selector: "app-interest",
  templateUrl: "interest.component.html",
})
export class InterestComponent {
  @Output() onUpdate: EventEmitter<void> = new EventEmitter<void>();

  @Input() interest: InterestInterface;

  answer: OpenaiInterface = null;
  state: "closed" | "opened" = "closed";

  constructor(private matDialog: MatDialog) {}

  refresh(): void {
    LoaderService.show();

    PageService
      .content()
      .then(content => {
        OpenaiService
          .accord(content, this.interest.keywords)
          .then((openaiAnswer: OpenaiInterface) => {
            this.answer = openaiAnswer;
            LoaderService.hide();
            PageService
              .meta()
              .then((meta: MetaInterface) => {
                HistoryService.add({ meta, interest: this.interest, openai: this.answer });
              });
          })
          .catch(() => {
            LoaderService.hide();
            this.matDialog.open(OpenAiErrorComponent);
          });
      })
      .catch(() => LoaderService.hide());
  }

  delete(): void {
    const dialogRef = this.matDialog.open(DeleteInterestComponent);
    dialogRef.componentInstance.interest = this.interest;
    dialogRef.componentInstance.onYes = () => {
      InterestService.delete(this.interest).then(() => {
        this.onUpdate.emit();
      });
    };
  }
}

@Component({
  template:
    `<h1 mat-dialog-title>Delete interest?</h1>
    <div mat-dialog-content>
      Would you like to delete <b>{{interest?.title}}</b>?
    </div>
    <div mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close>No</button>
      <button mat-raised-button color="primary" mat-dialog-close (click)="yes()">Ok</button>
    </div>`,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
})
class DeleteInterestComponent {
  public onYes: Function = null;
  public interest: InterestInterface = null;

  public yes(): void {
    this.onYes && this.onYes();
  }
}

@Component({
  template:
    `<h1 mat-dialog-title>Analyzing error</h1>
    <div mat-dialog-content>
      Oops.. The page content is too big for analyzing.
    </div>
    <div mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>Ok</button>
    </div>`,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
})
class OpenAiErrorComponent {}
