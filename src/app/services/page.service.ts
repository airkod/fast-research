import { MetaInterface } from "@interfaces/meta.interface";
import { JohnLennon } from "@mock/john-lennon";
import { metaJohnLennon } from "@mock/meta";
import { ArtDeVivre } from "@mock/art-de-vivre";
import { metaArtDeVivre } from "@mock/meta-art-de-vivre";

export class PageService {
  public static content(success: boolean = true): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (chrome.tabs) {
        chrome.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            return chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: getPageContent,
            });
          })
          .then((results) => resolve(results[0].result))
          .catch((e) => reject(e));

        return;
      }
      success
        ? resolve(ArtDeVivre)
        : resolve(JohnLennon);
    });
  }

  public static meta(success: boolean = true): Promise<MetaInterface> {
    return new Promise<MetaInterface>((resolve, reject) => {
      if (chrome.tabs) {
        chrome.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            return chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: getMeta,
            });
          })
          .then((results) => resolve(results[0].result))
          .catch((e) => reject(e));

        return;
      }
      success
        ? resolve(metaJohnLennon)
        : resolve(metaArtDeVivre);
    });
  }
}

const getMeta = () => {
  const query = (selector) => {
    return document.querySelector(selector);
  };

  const meta: MetaInterface = {};

  try {
    meta.title = query("title").innerHTML;
  } catch {}

  let description = "";

  try {
    description = query(`meta[name="description"]`).getAttribute("content").trim();
  } catch {}

  try {
    if (!description.length) {
      description = query(`meta[property="og:description"]`).getAttribute("content").trim();
    }
  } catch {}

  try {
    if (!description.length) {
      description = query(`meta[name="twitter:description"]`).getAttribute("content").trim();
    }
  } catch {}

  if (description.length) {
    meta.description = description;
  }

  try {
    meta.link = query(`meta[property="og:url"]`).getAttribute("content").trim();
  } catch {}

  try {
    if (!meta.link?.length) {
      meta.link = location.href;
    }
  } catch {}

  try {
    meta.image = query(`meta[property="og:image"]`)?.getAttribute("content")?.trim();
    if (!meta.image?.length) {
      let iconHref = query(`link[rel="icon"]`)?.getAttribute("href")?.trim();
      if (iconHref?.length && !iconHref.startsWith("http")) {
        meta.image = location.origin + "/" + iconHref;
      }
    }
  } catch {}

  try {
    meta.icon = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + location.origin;
  } catch {}

  return meta;
};

const getPageContent = () => {
  const query = (selector) => {
    return document.querySelector(selector);
  };
  const clean = (node) => {
    try {
      let content = node.innerHTML;

      const slashNCharMock = `[slashN - ${Math.random()}]`;
      const slashTCharMock = `[slashT - ${Math.random()}]`;

      const placeholders = [];

      // Saving all <pre>
      content = content.replace(/<pre>[\s\S]*?<\/pre>/g, (match) => {
        placeholders.push(match);
        return `###PLACEHOLDER${placeholders.length - 1}###`;
      });

      content = content
        .replaceAll("&nbsp;", " ")
        .replaceAll("&amp;", "&")

        // Removing inline scripts and styles
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")

        // Removing all HTML-tags
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/<(?:[^>'"]*|(['"]).*?\1)*>/g, "")

        // Removing double spaces
        .split(" ").filter(w => w.trim()).join(" ")

        // Removing all unnecessary chars
        .replace(/[^a-zA-Zа-яА-Я0-9&#.,;!?()\-\[\]{}:"'«»…\s]/g, "")

        // Removing double \t and \n
        .replaceAll("\n", slashNCharMock).split(slashNCharMock).filter(s => s.trim()).join("\n")
        .replaceAll("\t", slashTCharMock).split(slashTCharMock).filter(s => s.trim()).join("\t");

      // Restoring all <pre>
      for (let i = 0; i < placeholders.length; i++) {
        content = content.replace(`###PLACEHOLDER${i}###`, placeholders[i]);
      }
      return content;
    } catch (e) {
    }
  };

  const content = [];
  try {
    content.push(clean(query("title")));
  } catch (e) {
  }

  try {
    content.push(clean(query(`meta[name="description"]`).getAttribute("content")));
  } catch (e) {
  }

  let body = query("article");
  if (!body) {
    body = query("main");
    if (!body) {
      body = query("body");
    }
  }

  content.push(clean(body));
  return content.join("\n");
};
