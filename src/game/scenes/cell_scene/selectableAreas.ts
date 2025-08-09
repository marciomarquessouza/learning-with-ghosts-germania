import { gameEvents } from "@/game/events";
import { createSelectableArea } from "./helper/createSelectableArea";
import { CHARACTERS } from "@/constants/game";

class SelectableAreas {
  create(scene: Phaser.Scene) {
    const deskPosition = { x: 1206, y: 519 };
    const deskSize = { width: 411, height: 530 };
    const handleDeskClick = () =>
      gameEvents.emit("show-dialogue", {
        lines: [
          {
            character: CHARACTERS.ELISA,
            text: ` The Brain—is wider than the Sky— 
                For—put them side by side—
                The one the other will contain 
                With ease—and you—beside—`,
          },
          {
            character: CHARACTERS.MARLENE,
            text: ` The Brain is deeper than the sea—
                    For—hold them—Blue to Blue—
                    The one the other will absorb—
                    As sponges—Buckets—do—`,
          },
        ],
      });
    createSelectableArea(
      scene,
      deskPosition,
      deskSize,
      "selectable",
      handleDeskClick
    );

    const bedPosition = { x: 320, y: 575 };
    const bedSize = { width: 585, height: 500 };
    const handleBedClick = () =>
      gameEvents.emit("show-dialogue", {
        lines: [
          {
            character: CHARACTERS.MARLENE,
            text: "I hate you",
          },
        ],
      });
    createSelectableArea(
      scene,
      bedPosition,
      bedSize,
      "selectable",
      handleBedClick
    );

    const foodPosition = { x: 430, y: 59 };
    const foodSize = { width: 395, height: 404 };
    const handleFoodClick = () =>
      gameEvents.emit("show-message", {
        title: "Message",
        text: "You clicked on the food",
      });
    createSelectableArea(
      scene,
      foodPosition,
      foodSize,
      "selectable",
      handleFoodClick
    );

    const sisyphusPosition = { x: 928, y: 615 };
    const sisyphusSize = { width: 249, height: 254 };
    const handleSisyphusClick = () =>
      gameEvents.emit("show-message", {
        title: "Message",
        text: "You clicked on the Sisyphus Lair",
      });
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
