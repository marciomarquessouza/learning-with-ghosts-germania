import { State, StateMachine } from "@/libs/game/StateMachine";
import { Eliza } from "../Eliza";
import { elisaAnimations } from "../helpers/ElisaAnimations";
import { onAnimationFrame } from "@/libs/animation/onAnimationFrame";

type Args = [Eliza];

type ElizaStates = {
  idle: State<ElizaStates, Args>;
  sowing: State<ElizaStates, Args>;
};

const states = {} as ElizaStates;

states.idle = {
  stateMachine: null as unknown as StateMachine<ElizaStates, Args>,
  enter: (eliza: Eliza) => {
    if (!eliza.sprite) return;
    eliza.sprite.play(elisaAnimations.animations.GAS_MASK_NUN_IDLE_ANIM);
  },
  execute: () => {},
};

states.sowing = {
  stateMachine: null as unknown as StateMachine<ElizaStates, Args>,
  enter: (eliza) => {
    if (!eliza.sprite) return;
    const animation = elisaAnimations.animations.GAS_MASK_NUN_SOWING_ANIM;
    eliza.sprite.play(animation);
    onAnimationFrame(eliza.sprite, animation, 21, () => {
      states.sowing.stateMachine?.transition("idle");
    });
  },
  execute: () => [],
};
