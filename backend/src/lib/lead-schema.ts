import { z } from "zod";

/** Схема заявки — единая точка валидации входящих данных. */
export const leadSchema = z.object({
  name: z.string().trim().min(1, "Укажите имя").max(120),
  email: z.string().trim().email("Некорректный email").max(200),
  message: z
    .string()
    .trim()
    .min(1, "Сообщение не может быть пустым")
    .max(5000),
  /** Honeypot-поле: люди его не видят, боты заполняют */
  company: z.string().max(200).optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
});

export type LeadPayload = z.infer<typeof leadSchema>;
