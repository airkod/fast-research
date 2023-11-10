export const environment = {
  production: false,
  openAi: {
    url: "https://api.openai.com/v1/chat/completions",
    apiKey: "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",
    options: {
      model: "gpt-4-1106-preview",
      temperature: 0.7,
    },
    question:
      `Насколько все ниже приведенные данные соответствуют ключевым словам "{{keywords}}"?
      Ответь в формате JSON {
        "correspondence": {кол-во процентов соответствия},
        "description": {описание соответствия на 1-2 предложения на английском языке},
        "summary": {описание о чем содержимое страницы на 1-2 предложения на английском языке},
      }`,
  },
};
