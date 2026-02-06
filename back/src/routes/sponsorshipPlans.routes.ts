import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all plans
router.get('/', async (_req: Request, res: Response) => {
  try {
    const plans = await prisma.sponsorshipPlan.findMany({
      where: { deletedAt: null },
      include: { zoo: true, sponsorships: true },
    });
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET plan by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const plan = await prisma.sponsorshipPlan.findFirst({
      where: { id, deletedAt: null },
      include: { zoo: true, sponsorships: true },
    });
    if (!plan) return res.status(404).json({ error: 'Sponsorship plan not found' });
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE plan
router.post('/', async (req: Request, res: Response) => {
  const { name, description, basePrice, taxReducedPrice, benefits, durationMonths, zooId } = req.body;

  if (!name || !description || basePrice == null || !benefits || !durationMonths || !zooId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const plan = await prisma.sponsorshipPlan.create({
      data: {
        name,
        description,
        basePrice,
        taxReducedPrice,
        benefits,
        durationMonths,
        zoo: { connect: { id: zooId } },
      },
      include: { zoo: true, sponsorships: true },
    });
    res.status(201).json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE plan
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const {
    name,
    description,
    basePrice,
    taxReducedPrice,
    benefits,
    durationMonths,
  } = req.body;

  try {
    const updatedPlan = await prisma.sponsorshipPlan.update({
      where: { id },
      data: {
        name,
        description,
        basePrice,
        taxReducedPrice,
        benefits,
        durationMonths,
      },
      include: { zoo: true, sponsorships: true },
    });
    res.json(updatedPlan);
  } catch (err: any) {
    console.error(err);
    if (err.code === 'P2025') return res.status(404).json({ error: 'Sponsorship plan not found' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE plan
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.sponsorshipPlan.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    if (err.code === 'P2025') return res.status(404).json({ error: 'Sponsorship plan not found' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
