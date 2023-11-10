import { environment } from "@environments/environment";
import { OpenaiInterface } from "@interfaces/openai.interface";
import { openai } from "@mock/openai";
import { MD5 } from "@services/md5.service";
import { StorageService } from "@services/storage.service";
import releaseKeepAwake = chrome.power.releaseKeepAwake;

export class OpenaiService {
  static splitText(text: string): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const result = [];
    let temp = [];

    let charCount = 0;
    for (let sentence of sentences) {
      if (temp.length === 5 || charCount + sentence.length > 2000) {
        result.push(temp.join(" "));
        temp = [];
        charCount = 0;
      }

      temp.push(sentence.trim());
      charCount += sentence.length;
    }

    if (temp.length) {
      result.push(temp.join(" "));
    }

    return result;
  }

  static accord(content: string, keywords: string[], isMock: boolean = false, mockType: "low" | "high" = "high"): Promise<OpenaiInterface> {
    if (isMock) {
      return new Promise((resolve) => {
        resolve(openai[mockType]);
      });
    }

    const mainQuestion = environment.openAi.question.replaceAll(
      "{{keywords}}",
      "\"" + keywords.join("\", ") + "\"",
    );

    const messages = [
      {
        role: "user",
        content: mainQuestion,
      },
    ];

    this.splitText(content).forEach((sentence) => {
      sentence = sentence.trim();

      if (sentence.length) {
        messages.push({
          role: "user",
          content: sentence,
        });
      }
    });

    return new Promise<OpenaiInterface>((resolve, reject) => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + environment.openAi.apiKey,
        },
        body: JSON.stringify({
          model: environment.openAi.options.model,
          temperature: environment.openAi.options.temperature,
          messages: messages,
          response_format: { type: "json_object" },
        }),
      };

      const cacheKey = "cache_" + MD5(JSON.stringify(options));
      StorageService.get(cacheKey)
        .then((data) => {
          if (!data) {
            fetch(environment.openAi.url, options).then(r => r.json())
              .then(r => {
                if (r.error) {
                  reject(r.error);
                  return;
                }

                try {
                  data = JSON.parse(r.choices[0].message.content);
                  data = {
                    correspondence: parseInt((data as any).correspondence),
                    description: (data as any).description,
                    summary: (data as any).summary,
                  };
                  StorageService.set(cacheKey, data);
                  resolve(data);
                } catch (e) {
                  reject(e);
                }
              })
              .catch(e => reject(e));

            return;
          }

          resolve(data);
        });
    });
  }
}
