import { z } from 'zod';

export const paymentFormSchema = z.object({
  id: z.string()
    .min(1, { message: "La cédula es requerida" })
    .refine(val => /^[a-zA-Z0-9]+$/.test(val), {
      message: "La cédula no debe contener caracteres especiales",
    })
    .refine(val => val.trim() === val, {
      message: "La cédula no debe contener espacios vacíos al inicio o al final",
    })
    .refine(val => !val.includes(' '), {
      message: "La cédula no debe contener espacios en blanco",
    }),
  name: z.string().min(1, { message: "El nombre es requerido" }),
  lastName: z.string().min(1, { message: "Los apellidos son requeridos" }),
  email: z.string().email({ message: "El correo electrónico no es válido" })
  .refine(val => !val.includes(' '), {
    message: "El correo electrónico no debe contener espacios en blanco",
  }),
  phone: z.string()
    .min(8, { message: "El teléfono debe tener al menos 8 dígitos" })
    .refine(val => /^[0-9]+$/.test(val), {
      message: "El teléfono debe contener solo números",
    })
    .refine(val => val.trim() === val, {
      message: "El teléfono no debe contener espacios vacíos al inicio o al final",
    })
    .refine(val => !val.includes(' '), {
      message: "El teléfono no debe contener espacios en blanco",
    }),
  isTermsAccepted: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).superRefine((data, ctx) => {
  if (!data.id.startsWith('0')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La cédula debe comenzar con 0",
      path: ['id'],
    });
  }
});
