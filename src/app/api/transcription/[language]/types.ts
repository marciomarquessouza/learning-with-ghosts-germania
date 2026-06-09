export interface DeepgramTranscriptionResponse {
  metadata: {
    transaction_key: string;
    request_id: string;
    sha256: string;
    created: string;
    duration: number;
    channels: number;
    models: string[];
    model_info: Record<
      string,
      {
        name: string;
        version: string;
        arch: string;
      }
    >;
  };
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
        confidence: number;
        words: Array<{
          word: string;
          start: number;
          end: number;
          confidence: number;
          punctuated_word: string;
        }>;
        paragraphs: {
          transcript: string;
          paragraphs: Array<{
            sentences: Array<{
              text: string;
              start: number;
              end: number;
            }>;
            num_words: number;
            start: number;
            end: number;
          }>;
        };
      }>;
    }>;
  };
}
