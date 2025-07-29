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
      "desk",
      handleDeskClick
    );

    const bedPosition = { x: 345, y: 589 };
    const bedSize = { width: 530, height: 491 };
    const handleBedClick = () => console.log("#BED");
    createSelectableArea(scene, bedPosition, bedSize, "bed", handleBedClick);
  }
}

export const selectableAreas = new SelectableAreas();
