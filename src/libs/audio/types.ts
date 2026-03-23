export interface AudioManifest {
  [key: string]: {
    path: string;
    target: string;
  };
}

export interface AudioScoreSummary {
  status: "excellent" | "good" | "pass" | "fail";
  headline: string;
  label: string;
  textColor: string;
  barColor: string;
}
