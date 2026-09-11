import { z } from "zod";

import { stripControlChars } from "./sanitize.js";

/** Русские сообщения для отсутствующих/неверно типизированных полей. */
const required = (message: string) => ({
  required_error: message,
  invalid_type_error: message,
});

const noControl = (message = "Недопустимые символы в поле") =>
  z
    .string()
    .transform(stripControlChars)
    .refine((value) => value.length > 0, message);

/** Схема заявки — единая точка валидации входящих данных. */
export const leadSchema = z.object({
  name: noControl("Укажите имя")
    .pipe(z.string(required("Укажите имя")).trim().min(1, "Укажите имя").max(120)),
  email: noControl("Укажите email").pipe(
    z
      .string(required("Укажите email"))
      .trim()
      .email("Некорректный email")
      .max(200),
  ),
  phone: noControl("Укажите телефон").pipe(
    z
      .string(required("Укажите телефон"))
      .trim()
      .min(1, "Укажите телефон")
      .max(30)
      .refine((value) => {
        if (!/^\+?[\d\s()-]+$/.test(value)) return false;
        const digits = value.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 15;
      }, "Некорректный номер телефона"),
  ),
  message: noControl("Расскажите о задаче").pipe(
    z
      .string(required("Расскажите о задаче"))
      .trim()
      .min(1, "Сообщение не может быть пустым")
      .max(5000),
  ),
  /** Honeypot-поле: люди его не видят, боты заполняют */
  company: z.string().max(200).optional().transform((value) =>
    value === undefined ? value : stripControlChars(value),
  ),
  utm_source: z.string().max(200).optional().transform((value) =>
    value === undefined ? value : stripControlChars(value),
  ),
  utm_medium: z.string().max(200).optional().transform((value) =>
    value === undefined ? value : stripControlChars(value),
  ),
  utm_campaign: z.string().max(200).optional().transform((value) =>
    value === undefined ? value : stripControlChars(value),
  ),
  utm_content: z.string().max(200).optional().transform((value) =>
    value === undefined ? value : stripControlChars(value),
  ),
  utm_term: z.string().max(200).optional().transform((value) =>
    value === undefined ? value : stripControlChars(value),
  ),
  /**
   * Время открытия формы (Date.now() на клиенте).
   * Отсекает мгновенные бот-посты и просроченные повторы.
   */
  startedAt: z.number().int().positive().optional(),
});

export type LeadPayload = z.infer<typeof leadSchema>;

const MIN_FILL_MS = 1_800;
const MAX_FILL_MS = 8 * 60 * 60 * 1000;

/** true — заявка похожа на автозаполнение ботом. */
export function isSuspiciousTiming(startedAt: number | undefined): boolean {
  if (!startedAt) return true;
  const elapsed = Date.now() - startedAt;
  return elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS;
}
