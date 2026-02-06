import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all sponsorships
router.get('/', async (_req: Request, res: Response) => {
  try {
    const sponsorships = await prisma.sponsorship.findMany({
      include: { user: true, animal: true, plan: true },
    });
    res.json(sponsorships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET sponsorship by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const sponsorship = await prisma.sponsorship.findUnique({
      where: { id },
      include: { user: true, animal: true, plan: true },
    });
    if (!sponsorship) return res.status(404).json({ error: 'Sponsorship not found' });
    res.json(sponsorship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE sponsorship
router.post('/', async (req: Request, res: Response) => {
  const { userId, animalId, planId, startDate, endDate, monthlyAmount, autoRenew, status } = req.body;

  if (!userId || !animalId || !planId || !startDate || monthlyAmount == null || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sponsorship = await prisma.sponsorship.create({
      data: {
        user: { connect: { id: userId } },
        animal: { connect: { id: animalId } },
        plan: { connect: { id: planId } },
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        monthlyAmount,
        autoRenew: autoRenew ?? false,
        status,
      },
      include: { user: true, animal: true, plan: true },
    });
    res.status(201).json(sponsorship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE sponsorship
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { startDate, endDate, monthlyAmount, autoRenew, status } = req.body;

  try {
    const updatedSponsorship = await prisma.sponsorship.update({
      where: { id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        monthlyAmount,
        autoRenew,
        status,
      },
      include: { user: true, animal: true, plan: true },
    });
    res.json(updatedSponsorship);
  } catch (err: any) {
    console.error(err);
    if (err.code === 'P2025') return res.status(404).json({ error: 'Sponsorship not found' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE sponsorship
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.sponsorship.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    if (err.code === 'P2025') return res.status(404).json({ error: 'Sponsorship not found' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
