import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createProject, getUserProjects, getProjectById, updateProject, deleteProject,
  createScript, getProjectScripts, getScriptById,
  createStoryboard, getProjectStoryboards,
  createCharacter, getProjectCharacters,
  createScene, getProjectScenes,
  createVideo, getProjectVideos, updateVideoStatus,
  createAudio, getProjectAudios,
  createPoster, getProjectPosters,
  createSupportTicket, getUserTickets, getAllTickets, updateTicketStatus,
  createCreditTransaction, getUserTransactions,
  getProjectTemplates, getProjectTemplateBySlug, createProjectFromTemplate
} from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Project Management
  projects: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await createProject({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          status: "draft",
        });
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserProjects(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getProjectById(input.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "in_progress", "completed"]).optional(),
        coverImage: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await updateProject(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteProject(input.id);
        return { success: true };
      }),

    templates: publicProcedure.query(async () => {
      return await getProjectTemplates();
    }),

    createFromTemplate: protectedProcedure
      .input(z.object({
        templateSlug: z.string(),
        projectTitle: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const template = await getProjectTemplateBySlug(input.templateSlug);
        if (!template) {
          throw new Error("Template not found");
        }
        await createProjectFromTemplate(ctx.user.id, template.id, input.projectTitle);
        return { success: true };
      }),
  }),

  // Script Module (AI Scriptwriter)
  scripts: router({
    generate: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        keywords: z.string(),
        genre: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const prompt = `作为一个专业的电影编剧，请根据以下关键词创作一个电影剧本大纲：

关键词：${input.keywords}
${input.genre ? `类型：${input.genre}` : ''}

请生成：
1. 故事核心概念
2. 主要角色介绍（包括性格特点）
3. 三幕结构大纲
4. 关键场景描述

使用标准的剧本格式输出。`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "你是一位经验丰富的电影编剧，擅长创作各种类型的电影剧本。" },
            { role: "user", content: prompt },
          ],
        });

        const contentData = response.choices[0]?.message?.content;
        const content = typeof contentData === 'string' ? contentData : JSON.stringify(contentData || '');

        // Extract characters using AI
        const characterPrompt = `从以下剧本中提取所有角色信息，以JSON格式返回：
${content}

返回格式：
{
  "characters": [
    {"name": "角色名", "description": "角色描述", "traits": ["特征1", "特征2"]}
  ]
}`;

        const characterResponse = await invokeLLM({
          messages: [
            { role: "system", content: "你是一个剧本分析助手。" },
            { role: "user", content: characterPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "character_extraction",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  characters: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        traits: { type: "array", items: { type: "string" } },
                      },
                      required: ["name", "description", "traits"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["characters"],
                additionalProperties: false,
              },
            },
          },
        });

        const charactersData = characterResponse.choices[0]?.message?.content;
        const charactersString = typeof charactersData === 'string' ? charactersData : JSON.stringify(charactersData || {});

        await createScript({
          projectId: input.projectId,
          content: content,
          formattedContent: content,
          characters: charactersString,
          version: 1,
        });

        return { success: true, content, characters: charactersData };
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getProjectScripts(input.projectId);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getScriptById(input.id);
      }),
  }),

  // Storyboard Module (AI Storyboarder)
  storyboards: router({
    generate: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        scriptId: z.number(),
        sceneDescription: z.string(),
        cameraAngle: z.string().optional(),
        sortOrder: z.number(),
      }))
      .mutation(async ({ input }) => {
        const prompt = `${input.sceneDescription}${input.cameraAngle ? `, ${input.cameraAngle} shot` : ''}, cinematic, film storyboard style, professional`;

        const imageResult = await generateImage({ prompt });
        
        if (!imageResult.url) {
          throw new Error("Failed to generate storyboard image");
        }

        await createStoryboard({
          projectId: input.projectId,
          scriptId: input.scriptId,
          sceneNumber: input.sortOrder,
          imageUrl: imageResult.url,
          cameraAngle: input.cameraAngle,
          description: input.sceneDescription,
          sortOrder: input.sortOrder,
        });

        return { success: true, imageUrl: imageResult.url };
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getProjectStoryboards(input.projectId);
      }),
  }),

  // Character Module (AI Casting Director)
  characters: router({
    generate: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        name: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        const prompt = `Professional character portrait: ${input.description}, ${input.name}, highly detailed, cinematic lighting, 8k, photorealistic`;

        const imageResult = await generateImage({ prompt });

        await createCharacter({
          projectId: input.projectId,
          name: input.name,
          description: input.description,
          imageUrl: imageResult.url,
          traits: JSON.stringify({ description: input.description }),
        });

        return { success: true, imageUrl: imageResult.url };
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getProjectCharacters(input.projectId);
      }),
  }),

  // Scene Module (AI Set Designer)
  scenes: router({
    generate: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        name: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        const prompt = `Concept art: ${input.description}, environment design, cinematic, highly detailed, professional matte painting`;

        const imageResult = await generateImage({ prompt });
        
        if (!imageResult.url) {
          throw new Error("Failed to generate scene image");
        }

        await createScene({
          projectId: input.projectId,
          name: input.name,
          description: input.description,
          conceptArtUrl: imageResult.url,
        });

        return { success: true, imageUrl: imageResult.url };
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getProjectScenes(input.projectId);
      }),
  }),

  // Video Module (AI片场 - placeholder for external API integration)
  videos: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        storyboardId: z.number().optional(),
        generationType: z.enum(["i2v", "t2v"]),
      }))
      .mutation(async ({ input }) => {
        // Placeholder: In production, integrate with Runway, Kling, Luma, etc.
        await createVideo({
          projectId: input.projectId,
          storyboardId: input.storyboardId,
          videoUrl: "https://placeholder-video.url",
          generationType: input.generationType,
          status: "processing",
        });

        return { success: true, message: "Video generation started" };
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getProjectVideos(input.projectId);
      }),
  }),

  // Audio Module (AI Sound Studio - placeholder)
  audios: router({
    generate: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        audioType: z.enum(["voiceover", "bgm", "sfx"]),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Placeholder: In production, integrate with ElevenLabs, Suno, AudioLDM
        await createAudio({
          projectId: input.projectId,
          audioUrl: "https://placeholder-audio.url",
          audioType: input.audioType,
          description: input.description,
        });

        return { success: true, message: "Audio generation started" };
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getProjectAudios(input.projectId);
      }),
  }),

  // Poster Module (AI Marketing)
  posters: router({
    generate: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        layout: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        const prompt = `Movie poster: ${input.description}, ${input.layout} layout, professional typography, cinematic, 8k, highly detailed`;

        const imageResult = await generateImage({ prompt });
        
        if (!imageResult.url) {
          throw new Error("Failed to generate poster image");
        }

        await createPoster({
          projectId: input.projectId,
          imageUrl: imageResult.url,
          layout: input.layout,
        });

        return { success: true, imageUrl: imageResult.url };
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getProjectPosters(input.projectId);
      }),
  }),

  // Support Module
  support: router({
    createTicket: protectedProcedure
      .input(z.object({
        subject: z.string(),
        message: z.string(),
        priority: z.enum(["low", "medium", "high"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await createSupportTicket({
          userId: ctx.user.id,
          subject: input.subject,
          message: input.message,
          priority: input.priority || "medium",
          status: "open",
        });

        return { success: true };
      }),

    myTickets: protectedProcedure.query(async ({ ctx }) => {
      return await getUserTickets(ctx.user.id);
    }),

    allTickets: protectedProcedure.query(async ({ ctx }) => {
      // Only admins can view all tickets
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getAllTickets();
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        ticketId: z.number(),
        status: z.enum(["open", "in_progress", "resolved", "closed"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        await updateTicketStatus(input.ticketId, input.status);
        return { success: true };
      }),
  }),

  // Credits & Subscription
  credits: router({
    myTransactions: protectedProcedure.query(async ({ ctx }) => {
      return await getUserTransactions(ctx.user.id);
    }),

    purchase: protectedProcedure
      .input(z.object({
        amount: z.number(),
        description: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Placeholder: In production, integrate with Stripe
        await createCreditTransaction({
          userId: ctx.user.id,
          amount: input.amount,
          transactionType: "purchase",
          description: input.description,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
