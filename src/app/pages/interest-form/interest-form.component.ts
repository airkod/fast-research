import { Component, EventEmitter, Output } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipEditedEvent, MatChipInputEvent } from "@angular/material/chips";
import { LoaderService } from "@services/loader.service";
import { InterestService } from "@services/interest.service";

@Component({
  selector: "app-interest-form",
  templateUrl: "interest-form.component.html",
})
export class InterestFormComponent {
  @Output() onSave: EventEmitter<void> = new EventEmitter<void>();

  keywords: string[] = [];
  title: string = null;

  addOnBlur = true;
  readonly separatorKeysCodes = [ ENTER, COMMA ] as const;

  placeholderEmpty: string = "Ex: Beatles, Activism, Biography...";
  placeholder: string = "Keyword";

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    if (value && !this.keywords.includes(value)) {
      this.keywords.push(value);
    }
    event.chipInput!.clear();
  }

  remove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  edit(keyword: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(keyword);
      return;
    }
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords[index] = value;
    }
  }

  isValid(): boolean {
    return !!(this.keywords.length && this.title?.length);
  }

  save(): void {
    if (!this.isValid()) {
      return;
    }

    LoaderService.show();
    InterestService.add(this.title, this.keywords)
      .then(() => this.onSave.emit())
      .finally(() => LoaderService.hide());
  }
}
