import i18next from "i18next";

i18next
  .init({
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language
    debug: false, // Enable debug logs for testing during development
    resources: {
      en: {
        translation: {
          title: "Emoji Garden",
          instructions: {
            save: "Save Instructions",
            "save-files": "Press [1], [2], or [3] to navigate save files.",
            "save-slot": "Press [S] to save your game into that slot.",
            "load-slot": "Press [L] to load your game from that slot.",
            "undo-redo": "Press [U] to Undo and [R] to Redo.",
            game: "Game Instructions",
            movement:
              "Use Arrow Keys to move player on grid. Every player step passes time.",
            reap: "Press [SPACEBAR] to sow or reap plants in each cell.",
            plants: "Plants need neighbors to grow.",
          },
          buttons: {
            SaveONE: "Save One",
            SaveTWO: "Save Two",
            SaveTHREE: "Save Three",
            Save: "Save",
            Load: "Load",
            Reset: "Reset",
            Undo: "Undo",
            Redo: "Redo",
            "⬅️": "⬅️",
            "➡️": "➡️",
            "⬆️": "⬆️",
            "⬇️": "⬇️",
            SoworReap: "Sow or Reap",
          },
          end: {
            "you-won": "You Won!",
            "total-time": "Total time:",
            steps: "steps",
            "play-again": "Play Again",
          },
        },
      },
      zh: {
        translation: {
          title: "表情符号花园",
          instructions: {
            save: "保存说明",
            "save-files": "按 [1]、[2] 或 [3] 导航存档文件。",
            "save-slot": "按 [S] 将您的游戏保存到该存档槽。",
            "load-slot": "按 [L] 从该存档槽加载游戏。",
            "undo-redo": "按 [U] 撤销，按 [R] 重做。",
            game: "游戏说明",
            movement:
              "使用方向键在网格上移动玩家。玩家每走一步，时间都会推进。",
            reap: "按 [空格键] 在每个单元格中播种或收割植物。",
            plants: "植物需要邻居才能生长。",
          },
          buttons: {
            SaveONE: "保存一",
            SaveTWO: "保存二",
            SaveTHREE: "保存三",
            Save: "保存",
            Load: "加载",
            Reset: "重置",
            Undo: "撤销",
            Redo: "重做",
            "⬅️": "⬅️",
            "➡️": "➡️",
            "⬆️": "⬆️",
            "⬇️": "⬇️",
            SoworReap: "播种或收割",
          },
          end: {
            "you-won": "你赢了！",
            "total-time": "总时间：",
            steps: "步",
            "play-again": "再次游戏",
          },
        },
      },
      ar: {
        translation: {
          title: "حديقة الرموز التعبيرية",
          instructions: {
            save: "تعليمات الحفظ",
            "save-files": "اضغط على [1] أو [2] أو [3] للتنقل بين ملفات الحفظ.",
            "save-slot": "اضغط على [S] لحفظ لعبتك في هذا المكان.",
            "load-slot": "اضغط على [L] لتحميل لعبتك من هذا المكان.",
            "undo-redo": "اضغط على [U] للتراجع و [R] للإعادة.",
            game: "تعليمات اللعبة",
            movement:
              "استخدم مفاتيح الأسهم لتحريك اللاعب على الشبكة. كل خطوة للاعب تُمرر الوقت.",
            reap: "اضغط على [المسافة] لزرع أو حصاد النباتات في كل خلية.",
            plants: "تحتاج النباتات إلى جيران لتنمو.",
          },
          buttons: {
            SaveONE: "حفظ ١",
            SaveTWO: "حفظ ٢",
            SaveTHREE: "حفظ ٣",
            Save: "حفظ",
            Load: "تحميل",
            Reset: "إعادة ضبط",
            Undo: "تراجع",
            Redo: "إعادة",
            "⬅️": "⬅️",
            "➡️": "➡️",
            "⬆️": "⬆️",
            "⬇️": "⬇️",
            SoworReap: "زرع أو حصاد",
          },
          end: {
            "you-won": "لقد فزت!",
            "total-time": "الوقت الإجمالي:",
            steps: "خطوات",
            "play-again": "العب مرة أخرى",
          },
        },
      },
    },
  })
  .then(() => {
    // `updateTranslations` will only run once i18next has fully initialized
    updateTranslations();
    addLanguageSwitcher();
  })
  .catch((err) => {
    console.error("Error during i18next initialization", err);
  });

// Updates HTML tags by replacing their inner text with corresponding translations
export function updateTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n") || ""; // Get the i18n key
    const translatedText = i18next.t(key); // Fetch translation using i18next
    element.innerHTML = translatedText; // Inject translation into HTML
  });
}

// Language switcher buttons example
export function addLanguageSwitcher() {
  const langButtons = document.createElement("div");
  langButtons.id = "translation-buttons";
  langButtons.innerHTML = `
    <button id="en">English</button>
    <button id="zh">中文</button>
    <button id="ar">العربية</button>
  `;
  document.body.insertBefore(langButtons, document.body.firstChild);

  document.getElementById("en")?.addEventListener("click", () => {
    i18next.changeLanguage("en", updateTranslations); // Change to English
  });

  document.getElementById("zh")?.addEventListener("click", () => {
    i18next.changeLanguage("zh", updateTranslations); // Change to Chinese
  });

  document.getElementById("ar")?.addEventListener("click", () => {
    i18next.changeLanguage("ar", updateTranslations); // Change to Arabic
  });
}

export default i18next;
