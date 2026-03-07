import { HUD_ACTIONS_IMG, HUD_WEIGHT_IMG_WIDTH } from "@/constants/images";
import { actionIcons, ACTIONS_ICONS } from "./helpers/actionIcons";
import { events } from "@/events/events";
import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";

const HUD_ACTIONS_BACKGROUND = "hudActionsBackground";

class HUdActions {
  preload(scene: Phaser.Scene) {
    scene.load.image(HUD_ACTIONS_BACKGROUND, HUD_ACTIONS_IMG);
    actionIcons.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    dayActions: DayActions,
  ): Phaser.GameObjects.Container {
    const positionX = HUD_WEIGHT_IMG_WIDTH / 2;
    const positionY = scene.cameras.main.centerY + 200;
    const container = scene.add.container(positionX, positionY);
    const background = scene.add.image(0, 0, HUD_ACTIONS_BACKGROUND);
    container.add(background);

    const iconsList = actionIcons.create(scene, [
      { name: ACTIONS_ICONS.BARS, action: () => dayActions.onBarsClick() },
      { name: ACTIONS_ICONS.SOLITARY, action: () => console.log("#SOLITARY") },
      {
        name: ACTIONS_ICONS.CHALLENGE,
        action: () => dayActions.onDailyChallengeClick(),
      },
      { name: ACTIONS_ICONS.EXIT, action: () => console.log("#EXIT") },
    ]);

    events.game.async.on("hud-actions-badge", ({ icon, count }, done) => {
      actionIcons.setBadgeCount(icon, count);
      done();
    });

    events.game.async.on(
      "hud-actions-timer",
      ({ icon, timeInSeconds, onFinish }, done) => {
        actionIcons.attachTimer(scene, icon, timeInSeconds, onFinish);
        done();
      },
    );

    container.add(iconsList);

    return container;
  }
}

export const hudActions = new HUdActions();
