import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET all species
router.get("/", async (_req: Request, res: Response) => {
  try {
    const species = await prisma.species.findMany({
      where: {
        animals: {
          some: {},
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    res.json(species);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/subspecies", async (req: Request, res: Response) => {
  try {
    const speciesId = parseInt(req.params.id as string);
    const subspecies = await prisma.subSpecies.findMany({
      where: { speciesId },
      orderBy: { name: "asc" },
    });
    res.json(subspecies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
