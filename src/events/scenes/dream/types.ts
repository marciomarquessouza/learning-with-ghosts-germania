export interface DreamShowIntroductionEvent {
  lesson: string;
  hideAfter?: number;
  afterClose?: () => void;
}
