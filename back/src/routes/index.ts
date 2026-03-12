import { Router } from "express";
import usersRoutes from "./users.routes.js";
import authRoutes from "./auth.routes.js";
import animalsRoutes from "./animals.routes.js";
import zoosRoutes from "./zoos.routes.js";
import sponsorshipPlansRoutes from "./sponsorshipPlans.routes.js";
import sponsorshipsRoutes from "./sponsorships.routes.js";
import invoicesRoutes from "./invoices.routes.js";
import speciesRoutes from "./species.routes.js";
import stripeRoutes from "./stripe.routes.js";
import dashboardRoutes from "./dashboard.route.js";

const router = Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/animals", animalsRoutes);
router.use("/zoos", zoosRoutes);
router.use("/plans", sponsorshipPlansRoutes);
router.use("/sponsorships", sponsorshipsRoutes);
router.use("/invoices", invoicesRoutes);
router.use("/species", speciesRoutes);
router.use("/stripe", stripeRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
