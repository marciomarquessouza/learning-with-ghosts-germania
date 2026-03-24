export interface IntroductionEvent {
  title: string;
  hideAfter?: number;
  afterClose?: () => void;
}
