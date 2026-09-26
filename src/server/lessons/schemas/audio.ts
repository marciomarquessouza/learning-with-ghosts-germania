import { z } from "zod";

export const AudioManifestEntrySchema = z.object({
  path: z.string().min(1),
  target: z.string().min(1),
});

export const AudioManifestSchema = z.record(
  z.string(),
  AudioManifestEntrySchema,
);

export type AudioManifestEntry = z.infer<typeof AudioManifestEntrySchema>;

export type AudioManifest = z.infer<typeof AudioManifestSchema>;
