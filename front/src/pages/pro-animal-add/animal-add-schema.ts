import * as z from 'zod';

export const addAnimalSchema = z.object({
  name: z.string().min(1, { message: 'Le nom est requis' }),
  slug: z.string().optional(),
  speciesId: z
    .number({ message: "L'espèce est requise" })
    .positive({ message: "L'espèce est requise" }),
  subSpeciesId: z.number().positive().optional(),
  gender: z.enum(['MALE', 'FEMALE'], { message: 'Le genre est requis' }),
  conservationStatus: z.string().min(1, { message: 'Le statut de conservation est requis' }),
  age: z.number().positive().optional(),
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  description: z.string().min(1, { message: 'La description est requise' }),
  story: z.string().optional(),
  naturalHabitat: z.string().optional(),
  diet: z.string().optional(),
  weight: z.number().positive().optional(),
  size: z.number().positive().optional(),
  physicalSpecificity: z.string().optional(),
  lifeExpectancyYears: z.number().positive().optional(),
  traits: z.array(z.string()).optional(),
  sponsorshipImpact: z.string().optional(),
  zooId: z.number().optional(),
});

export type AddAnimalFormValues = z.infer<typeof addAnimalSchema>;
