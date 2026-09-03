import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import * as z from 'zod/v4';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Порядок на главной */
      order: z.number(),
      /** Аннотация на поле: год и характер работы */
      year: z.string(),
      kind: z.string(),
      /** Одна фраза для карточки на главной */
      tagline: z.string(),
      /** Подзаголовок страницы проекта */
      intro: z.string(),
      /** Что за задача и зачем я её решал */
      problem: z.string(),
      /** Цепочка стека: читается как схема слева направо */
      stack: z.array(z.string()),
      links: z
        .array(z.object({ label: z.string(), href: z.url() }))
        .default([]),
      /** Архитектура версткой: слои сверху вниз, между ними подписанные переходы */
      arch: z
        .array(
          z.object({
            title: z.string(),
            nodes: z.array(z.string()),
            link: z.string().optional(),
          })
        )
        .default([]),
      shots: z
        .array(z.object({ src: image(), alt: z.string() }))
        .default([]),
      /** Короткие silent-превью для личных проектов; пути из public/ */
      previewVideo: z
        .object({
          mp4: z.string().optional(),
          webm: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { projects };
