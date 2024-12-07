import i18n from "../Internationalization";
type InputAction = () => void;

export class InputManager {
  private scene: Phaser.Scene;
  private bindings: { [key: string]: InputAction } = {};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // Register a key and its associated callback
  bindKey(key: string, action: InputAction, buttonName: string): void {
    this.scene.input.keyboard?.on(`keydown-${key}`, action);
    this.bindings[key] = action;
    console.log("keydown" + key);

    //making an associated button
    if (document.querySelector(`button[data-i18n='buttons.${buttonName}']`)) {
      return;
    }
    const btn = document.createElement("button");
    btn.setAttribute("data-i18n", `buttons.${buttonName}`);
    btn.innerHTML = i18n.t(`buttons.${buttonName}`);
    btn.onclick = action;
    //const buttonDiv = document.getElementById("buttons");
    const files = document.getElementById("saveFiles");
    const save = document.getElementById("saveInfo");
    const cntrl = document.getElementById("cntrl");
    const play = document.getElementById("gameplay");
    //buttonDiv?.appendChild(btn);

    if (
      key == "LEFT" ||
      key == "RIGHT" ||
      key == "UP" ||
      key == "DOWN" ||
      key == "SPACE"
    ) {
      play?.appendChild(btn);
    } else if (key == "U" || key == "R") {
      cntrl?.appendChild(btn);
    } else if (key == "ONE" || key == "TWO" || key == "THREE") {
      files?.appendChild(btn);
    } else {
      save?.appendChild(btn);
    }
  }
}
