import { z } from "zod";

/** Русские сообщения для отсутствующих/неверно типизированных полей. */
const required = (message: string) => ({
  required_error: message,
  invalid_type_error: message,
});

/** Схема заявки — единая точка валидации входящих данных. */
export const leadSchema = z.object({
  name: z.string(required("Укажите имя")).trim().min(1, "Укажите имя").max(120),
  email: z
    .string(required("Укажите email"))
    .trim()
    .email("Некорректный email")
    .max(200),
  phone: z
    .string(required("Укажите телефон"))
    .trim()
    .min(1, "Укажите телефон")
    .max(30)
    .refine((value) => {
      if (!/^\+?[\d\s()-]+$/.test(value)) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Некорректный номер телефона"),
  message: z
    .string(required("Расскажите о задаче"))
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
