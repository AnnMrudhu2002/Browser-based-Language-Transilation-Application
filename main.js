import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.useBrowserCache = true;

// Cache translators
const translators = {};

// Xenova ONNX models
const MODEL_MAP = {
  French: "Xenova/opus-mt-en-fr",
  German: "Xenova/opus-mt-en-de",
  Spanish: "Xenova/opus-mt-en-es",
  Italian: "Xenova/opus-mt-en-it",
  Portuguese: "Xenova/opus-mt-en-pt",
  Dutch: "Xenova/opus-mt-en-nl",
  Hindi: "Xenova/opus-mt-en-hi",
};

async function loadTranslator(language) {
  if (!translators[language]) {
    console.log(`Loading ${language} model...`);
    translators[language] = await pipeline(
      "translation",
      MODEL_MAP[language]
    );
    console.log(`${language} model loaded`);
  }
  return translators[language];
}

// DOM
const button = document.getElementById("translate");
const input = document.getElementById("input");
const output = document.getElementById("output");
const languageSelect = document.getElementById("language");
const title = document.getElementById("title");

languageSelect.addEventListener("change", () => {
  title.textContent = `English → ${languageSelect.value}`;
});
//when user clicks transilate
button.addEventListener("click", async () => {
  const text = input.value.trim();
  const language = languageSelect.value;

  if (!text) {
    output.textContent = "Please enter some text.";
    return;
  }

  output.textContent = "Translating...";

  try {
    const translator = await loadTranslator(language);
    const result = await translator(text);
    output.textContent = result[0].translation_text;
  } catch (err) {
    console.error(err);
    output.textContent = err.message;
  }
});
