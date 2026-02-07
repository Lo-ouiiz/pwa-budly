import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth, AuthRequest } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// GET all sponsorships
// router.get('/', async (_req: Request, res: Response) => {
//   try {
//     const sponsorships = await prisma.sponsorship.findMany();
//     res.json(sponsorships);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// GET sponsorship by id
router.get(
  '/:id',
  auth,
  requireRole('USER'),
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    try {
      const sponsorship = await prisma.sponsorship.findUnique({
        where: { id },
      });
      if (!sponsorship) return res.status(404).json({ error: 'Sponsorship not found' });

      if (sponsorship.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      res.json(sponsorship);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET sponsorships by user
router.get('/user/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const sponsorships = await prisma.sponsorship.findMany({
      where: { userId },
    });
    res.json(sponsorships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE sponsorship
router.post(
  '/',
  auth,
  requireRole('USER'),
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { animalId, planId, startDate, endDate, monthlyAmount, autoRenew, status } = req.body;

    if (!animalId || !planId || !startDate || monthlyAmount == null || !status) {
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
      });
      res.status(201).json(sponsorship);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// UPDATE sponsorship
router.put(
  '/:id',
  auth,
  requireRole('USER'),
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const { startDate, endDate, monthlyAmount, autoRenew, status } = req.body;

    try {
      const sponsorship = await prisma.sponsorship.findUnique({ where: { id } });
      if (!sponsorship) return res.status(404).json({ error: 'Sponsorship not found' });

      if (sponsorship.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updatedSponsorship = await prisma.sponsorship.update({
        where: { id },
        data: {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          monthlyAmount,
          autoRenew,
          status,
        },
      });
      res.json(updatedSponsorship);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE sponsorship
router.delete(
  '/:id',
  auth,
  requireRole('USER'),
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    try {
      const sponsorship = await prisma.sponsorship.findUnique({ where: { id } });
      if (!sponsorship) return res.status(404).json({ error: 'Sponsorship not found' });

      if (sponsorship.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await prisma.sponsorship.delete({ where: { id } });
      res.status(204).send();
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
