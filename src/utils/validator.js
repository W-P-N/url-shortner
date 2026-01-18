import { z } from 'zod';

const LinkSchema = z.object({
    url: z.url({
        error: "Invalid URL format"
    }).max(2048)
});

export const validateLink = (data) => LinkSchema.safeParse(data);
