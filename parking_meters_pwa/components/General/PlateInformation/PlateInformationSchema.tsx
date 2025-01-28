import { z } from 'zod';

export const PlateInformationSchema = z.object({
    vehiclePlate: z.string().trim().min(1, { message: "El número de placa es requerido" }),
    plateType: z.object({
        Description: z.string(),
    }).nullable().refine(value => value !== null, {
        message: 'El tipo de placa es requerido',
    })
});
