import i18next from "i18next";

// Updates HTML tags by replacing their inner text with corresponding translations
export function updateTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n") || ""; // Get the i18n key
    console.log(key);
    const translatedText = i18next.t(key); // Fetch translation using i18next
    console.log(translatedText);
    element.innerHTML = translatedText; // Inject translation into HTML
  });
}

// Language switcher buttons example
export function addLanguageSwitcher() {
  const langButtons = document.createElement("div");
  langButtons.innerHTML = `
    <button id="en">English</button>
    <button id="zh">中文</button>
  `;
  document.body.insertBefore(langButtons, document.body.firstChild);

  document.getElementById("en")?.addEventListener("click", () => {
    i18next.changeLanguage("en", updateTranslations); // Change to English
  });

  document.getElementById("zh")?.addEventListener("click", () => {
    i18next.changeLanguage("zh", updateTranslations); // Change to Chinese
  });
}

export default i18next;
