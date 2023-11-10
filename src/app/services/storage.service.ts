/// <reference types="chrome"/>

export class StorageService {
  public static set(key: string, value: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // if (chrome.storage) {
      //   const obj = {};
      //   obj[key] = value;
      //
      //   chrome.storage.sync
      //     .set(obj)
      //     .then(() => resolve())
      //     .catch((e) => reject(e));
      //
      //   return;
      // }

      localStorage.setItem(key, JSON.stringify(value));
      resolve();
    });
  }

  public static add(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.get(key)
        .then((values: any) => {
          values = values || [];
          values.push(value);
          this.set(key, values)
            .then(() => resolve())
            .catch((e) => reject(e));
        })
        .catch(e => reject(e));
    });
  }

  public static get<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // if (chrome.storage) {
      //   chrome.storage.sync
      //     .get([ key ])
      //     .then((value: T) => resolve(value[key]))
      //     .catch(e => reject(e));
      //
      //   return;
      // }
      resolve(JSON.parse(localStorage.getItem(key)));
    });
  }
}
