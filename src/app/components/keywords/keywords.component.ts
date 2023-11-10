import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-keywords',
  templateUrl: 'keywords.component.html',
})
export class KeywordsComponent {
  @Input() keywords: Array<string> = [];
}
