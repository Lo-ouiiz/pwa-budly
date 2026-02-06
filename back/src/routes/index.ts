import { Router } from 'express';
import usersRoutes from './users.routes.js';
import animalsRoutes from './animals.routes.js';
import zoosRoutes from './zoos.routes.js';
import sponsorshipPlansRoutes from './sponsorshipPlans.routes.js';
import sponsorshipsRoutes from './sponsorships.routes.js';
import invoicesRoutes from './invoices.routes.js';

const router = Router();

router.use('/users', usersRoutes);
router.use('/animals', animalsRoutes);
router.use('/zoos', zoosRoutes);
router.use('/plans', sponsorshipPlansRoutes);
router.use('/sponsorships', sponsorshipsRoutes);
router.use('/invoices', invoicesRoutes);

export default router;
