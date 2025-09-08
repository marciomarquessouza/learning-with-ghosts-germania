import { createSelectableArea } from "./helper/createSelectableArea";
import { DayActions } from "@/game/actions/default.actions";

class SelectableAreas {
  create(scene: Phaser.Scene, dayActions: DayActions) {
    const deskPosition = { x: 1206, y: 519 };
    const deskSize = { width: 411, height: 530 };
    const handleDeskClick = () => dayActions.onDeskClick();
    createSelectableArea(
      scene,
      deskPosition,
      deskSize,
      "selectable",
      handleDeskClick
    );

    const bedPosition = { x: 320, y: 575 };
    const bedSize = { width: 585, height: 500 };
    const handleBedClick = () => dayActions.onBedClick();
    createSelectableArea(
      scene,
      bedPosition,
      bedSize,
      "selectable",
      handleBedClick
    );

    const foodPosition = { x: 430, y: 59 };
    const foodSize = { width: 395, height: 404 };
    const handleFoodClick = () => dayActions.onFoodClick();
    createSelectableArea(
      scene,
      foodPosition,
      foodSize,
      "selectable",
      handleFoodClick
    );

    const sisyphusPosition = { x: 928, y: 615 };
    const sisyphusSize = { width: 249, height: 254 };
    const handleSisyphusClick = () => dayActions.onRatClick();
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
