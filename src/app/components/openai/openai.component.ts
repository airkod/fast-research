import { Component, Input } from "@angular/core";
import { OpenaiInterface } from "@interfaces/openai.interface";

@Component({
  selector: "app-openai",
  templateUrl: "openai.component.html",
  styleUrls: [ "openai.component.scss" ],
})
export class OpenaiComponent {
  @Input() openai: OpenaiInterface = null;
}
