import { useState } from "react";
import { LessonActions } from "./LessonActions";
import { useCharacterDetails } from "@/hooks/useCharacterDetails";
import { CHARACTERS } from "@/constants/game";
import { LessonHeader } from "../LessonHeader";

// TODO: DreamLessonChallenges refactor
export function DreamLessonChallenges() {
  return null;
  // const [showActions, setShowActions] = useState(false);
  // const characterDetails = useCharacterDetails(CHARACTERS.ELISA);

  // const handleOnDescriptionComplete = () => {};

  // const handleNextStep = () => {};

  // const handlePreviousStep = () => {};

  // return (
  //   <>
  //     <LessonHeader
  //       show={visible}
  //       lessonDetails={lessonDetails}
  //       lessonStep={lessonStep}
  //       stepFlags={stepFlags}
  //       characterDetails={characterDetails}
  //       onCompleteDescription={handleOnDescriptionComplete}
  //     />
  //     <LessonActions
  //       isFirst={true}
  //       isLast={false}
  //       show={showActions}
  //       characterDetails={characterDetails}
  //       lessonEntry={lessonEntry}
  //       lessonStep={lessonStep}
  //       nextStep={handleNextStep}
  //       previousStep={handlePreviousStep}
  //     />
  //   </>
  // );
}
