import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// GET all zoos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const zoos = await prisma.zoo.findMany({
      where: { deletedAt: null },
    });
    res.json(zoos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET zoo by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const zoo = await prisma.zoo.findFirst({
      where: { id, deletedAt: null },
    });
    if (!zoo) return res.status(404).json({ error: 'Zoo not found' });
    res.json(zoo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE zoo
router.post(
  '/',
  auth,
  requireRole('ZOO_ADMIN'),
  async (req: Request, res: Response) => {
    const {
      name,
      slug,
      street,
      postalCode,
      city,
      country,
      logo,
      labels,
      photos,
      description,
    } = req.body;

    if (
      !name ||
      !slug ||
      !street ||
      !postalCode ||
      !city ||
      !country ||
      !description
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const zoo = await prisma.zoo.create({
        data: {
          name,
          slug,
          street,
          postalCode,
          city,
          country,
          logo,
          labels: labels ?? [],
          photos: photos ?? [],
          description,
        },
        include: { animals: true, plans: true },
      });
      res.status(201).json(zoo);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'P2002') {
        return res.status(400).json({ error: 'Slug already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// UPDATE zoo
router.put(
  '/:id',
  auth,
  requireRole('ZOO_ADMIN'),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const updatedZoo = await prisma.zoo.update({
        where: { id },
        data: req.body,
      });
      res.json(updatedZoo);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Zoo not found' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE zoo
router.delete(
  '/:id',
  auth,
  requireRole('ZOO_ADMIN'),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      await prisma.zoo.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      res.status(204).send();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Zoo not found' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
