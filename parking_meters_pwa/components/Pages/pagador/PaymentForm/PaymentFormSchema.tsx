import { z } from 'zod';

export const paymentFormSchema = z.object({
  id: z.string().min(1, { message: "La cédula es requerida" }),
  name: z.string().min(1, { message: "El nombre es requerido" }),
  lastName: z.string().min(1, { message: "Los apellidos son requeridos" }),
  email: z.string().email({ message: "El correo electrónico no es válido" }),
  phone: z.string().min(8, { message: "El teléfono debe tener al menos 8 dígitos" })
    .refine(val => /^[0-9]+$/.test(val), {
      message: "El teléfono debe contener solo números",
    }),
  isTermsAccepted: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  })
}).superRefine((data, ctx) => {

  if (!data.id.startsWith('0')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La cédula debe comenzar con 0",
      path: ['id'],
    });
  }
});
