export class LoaderService {
  private static buildLoaderNode(): HTMLDivElement {
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.append(spinner);

    return loader;
  }

  static show(): void {
    if (!document.querySelector("body > .loader")) {
      document.body.append(this.buildLoaderNode());
    }
  }

  static hide(): void {
    try {
      document.querySelector("body > .loader").remove();
    } catch {}
  }
}
