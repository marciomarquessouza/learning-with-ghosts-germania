import { createSelectableArea } from "./helper/createSelectableArea";

class SelectableAreas {
  create(scene: Phaser.Scene) {
    const deskPosition = { x: 1206, y: 519 };
    const deskSize = { width: 411, height: 530 };
    const handleDeskClick = () => console.log("#DESK");
    createSelectableArea(
      scene,
      deskPosition,
      deskSize,
      "selectable",
      handleDeskClick
    );

    const bedPosition = { x: 320, y: 575 };
    const bedSize = { width: 585, height: 500 };
    const handleBedClick = () => console.log("#BED");
    createSelectableArea(
      scene,
      bedPosition,
      bedSize,
      "selectable",
      handleBedClick
    );

    const foodPosition = { x: 430, y: 59 };
    const foodSize = { width: 395, height: 404 };
    const handleFoodClick = () => console.log("#FOOD");
    createSelectableArea(
      scene,
      foodPosition,
      foodSize,
      "selectable",
      handleFoodClick
    );

    const sisyphusPosition = { x: 928, y: 615 };
    const sisyphusSize = { width: 249, height: 254 };
    const handleSisyphusClick = () => console.log("#Sisyphus");
    createSelectableArea(
      scene,
      sisyphusPosition,
      sisyphusSize,
      "selectable",
      handleSisyphusClick
    );
  }
}

export const selectableAreas = new SelectableAreas();
