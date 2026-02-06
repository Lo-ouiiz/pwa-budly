import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all animals
router.get('/', async (_req: Request, res: Response) => {
  try {
    const animals = await prisma.animal.findMany({
      where: { deletedAt: null },
      include: { zoo: true, sponsorships: true },
    });
    res.json(animals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET animal by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const animal = await prisma.animal.findFirst({
      where: { id, deletedAt: null },
      include: { zoo: true, sponsorships: true },
    });
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    res.json(animal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE animal
router.post('/', async (req: Request, res: Response) => {
  const {
    name,
    slug,
    photos,
    species,
    subSpecies,
    age,
    gender,
    conservationStatus,
    birthDate,
    birthPlace,
    traits,
    story,
    description,
    naturalHabitat,
    diet,
    weight,
    size,
    physicalSpecificity,
    lifeExpectancyYears,
    sponsorshipImpact,
    zooId,
  } = req.body;

  if (
    !name ||
    !slug ||
    !species ||
    !gender ||
    !conservationStatus ||
    !description ||
    !naturalHabitat ||
    !zooId
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const animal = await prisma.animal.create({
      data: {
        name,
        slug,
        photos,
        species,
        subSpecies,
        age,
        gender,
        conservationStatus,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        birthPlace,
        traits,
        story,
        description,
        naturalHabitat,
        diet,
        weight,
        size,
        physicalSpecificity,
        lifeExpectancyYears,
        sponsorshipImpact,
        zoo: { connect: { id: zooId } },
      },
      include: { zoo: true, sponsorships: true },
    });
    res.status(201).json(animal);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE animal
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const updatedAnimal = await prisma.animal.update({
      where: { id },
      data: {
        ...req.body,
        birthDate: req.body.birthDate
          ? new Date(req.body.birthDate)
          : undefined,
      },
      include: { zoo: true, sponsorships: true },
    });
    res.json(updatedAnimal);
  } catch (err: any) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE animal
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.animal.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
