import { Component, Input } from "@angular/core";
import { MetaInterface } from "@interfaces/meta.interface";

@Component({
  selector: "app-link-preview",
  templateUrl: "link-preview.component.html",
  styleUrls: [ "link-preview.component.scss" ],
})
export class LinkPreviewComponent {
  @Input() meta: MetaInterface = null;

  public open() {
    chrome.tabs.create({
      url: this.meta.link,
    });
  }
}
