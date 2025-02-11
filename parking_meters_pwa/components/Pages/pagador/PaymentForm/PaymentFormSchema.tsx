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
    }).refine(val => (val.startsWith("0") || val.startsWith("3")), {
      message: "Digite la cédula sin guiones ni espacios, pero con todos los ceros, ejemplos: Persona Física: 0107770777 (Recordar también agregar cero al inicio) Persona Jurídica: 3811181111 (No es necesario el cero al inicio)",
    })
    ,
  name: z.string().min(1, { message: "El nombre es requerido" }),
  lastName: z.string().optional(),
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
  if (data.id.startsWith('0') && (!data.lastName || data.lastName.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Los apellidos son requeridos",
      path: ['lastName'],
    });
    
  }
});
