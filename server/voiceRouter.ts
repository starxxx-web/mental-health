import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { transcribeAudio } from "./_core/voiceTranscription";

export const voiceRouter = router({
  transcribe: protectedProcedure
    .input(z.object({
      audioUrl: z.string(),
      language: z.string().optional().default("zh"),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: input.language,
        });

        if ('error' in result) {
          throw new Error(result.error);
        }

        return {
          success: true,
          text: result.text,
          language: result.language,
        };
      } catch (error) {
        console.error("Voice transcription error:", error);
        throw new Error("语音转文字失败,请重试");
      }
    }),
});
