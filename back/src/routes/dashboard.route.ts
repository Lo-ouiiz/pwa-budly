import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { auth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/metrics",
  auth,
  requireRole("ZOO_ADMIN", "ZOO_USER"),
  async (req: Request, res: Response) => {
    const zooId = Number(req.query.zooId);
    if (!zooId) return res.status(400).json({ error: "Missing zooId" });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    }).reverse();

    try {
      const [
        totalAnimals,
        sponsoredAnimals,
        newSponsorsThisMonth,
        autoRenewCount,
        totalActive,
        allSponsorships,
      ] = await Promise.all([
        prisma.animal.count({ where: { zooId, deletedAt: null } }),
        prisma.animal.count({
          where: {
            zooId,
            deletedAt: null,
            sponsorships: { some: { status: "ACTIF" } },
          },
        }),
        prisma.sponsorship.count({
          where: {
            animal: { zooId },
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.sponsorship.count({
          where: {
            animal: { zooId },
            status: "ACTIF",
            autoRenew: true,
          },
        }),
        prisma.sponsorship.count({
          where: {
            animal: { zooId },
            status: "ACTIF",
          },
        }),
        prisma.sponsorship.findMany({
          where: {
            animal: { zooId },
            startDate: {
              gte: new Date(last6Months[0].year, last6Months[0].month, 1),
            },
          },
          select: { amount: true, startDate: true },
        }),
      ]);

      const revenueByMonth = last6Months.map(({ year, month }) => {
        const label = new Date(year, month, 1).toLocaleString("fr-FR", {
          month: "short",
          year: "2-digit",
        });
        const total = allSponsorships
          .filter((s) => {
            const d = new Date(s.startDate);
            return d.getFullYear() === year && d.getMonth() === month;
          })
          .reduce((sum, s) => sum + s.amount, 0);
        return { label, total };
      });

      const renewalRate =
        totalActive > 0 ? Math.round((autoRenewCount / totalActive) * 100) : 0;
      const revenueThisMonth = revenueByMonth[revenueByMonth.length - 1].total;

      res.json({
        totalAnimals,
        sponsoredAnimals,
        newSponsorsThisMonth,
        revenueThisMonth,
        revenueByMonth,
        renewalRate,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
