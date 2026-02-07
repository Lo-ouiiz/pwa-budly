import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth, AuthRequest } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// GET all invoices
// router.get('/', auth, requireRole('ZOO_ADMIN'), async (_req: AuthRequest, res: Response) => {
//   try {
//     const invoices = await prisma.invoice.findMany();
//     res.json(invoices);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// GET invoice by id
router.get(
  '/:id',
  auth,
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
      });
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

      if (req.user!.role !== 'ZOO_ADMIN' && invoice.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      res.json(invoice);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET invoices by user
router.get('/user/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: { sponsorship: true },
    });
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE invoice
router.post(
  '/',
  auth,
  requireRole('ZOO_ADMIN'),
  async (req: AuthRequest, res: Response) => {
    const { userId, sponsorshipId, amount, issuedAt, paid, pdfUrl } = req.body;
    if (!userId || amount == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const invoice = await prisma.invoice.create({
        data: {
          user: { connect: { id: userId } },
          sponsorship: sponsorshipId ? { connect: { id: sponsorshipId } } : undefined,
          amount,
          issuedAt: issuedAt ? new Date(issuedAt) : new Date(),
          paid: paid ?? false,
          pdfUrl,
        },
        include: { user: true, sponsorship: true },
      });
      res.status(201).json(invoice);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// UPDATE invoice
router.put(
  '/:id',
  auth,
  requireRole('ZOO_ADMIN'),
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const { userId, sponsorshipId, amount, issuedAt, paid, pdfUrl } = req.body;

    try {
      const invoice = await prisma.invoice.findUnique({ where: { id } });
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: {
          user: userId ? { connect: { id: userId } } : undefined,
          sponsorship: sponsorshipId ? { connect: { id: sponsorshipId } } : undefined,
          amount,
          issuedAt: issuedAt ? new Date(issuedAt) : undefined,
          paid,
          pdfUrl,
        },
      });
      res.json(updatedInvoice);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE invoice
router.delete(
  '/:id',
  auth,
  requireRole('ZOO_ADMIN'),
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    try {
      const invoice = await prisma.invoice.findUnique({ where: { id } });
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

      await prisma.invoice.delete({ where: { id } });
      res.status(204).send();
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
