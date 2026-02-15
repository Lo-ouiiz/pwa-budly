import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { auth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

// GET all animals
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 20, 1);
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search ? String(req.query.search) : undefined;

    const speciesNames = req.query.species
      ? Array.isArray(req.query.species)
        ? req.query.species.map(String)
        : [String(req.query.species)]
      : undefined;

    const genders = req.query.gender
      ? Array.isArray(req.query.gender)
        ? req.query.gender.map(String)
        : [String(req.query.gender)]
      : undefined;

    const conservationStatuses = req.query.conservationStatus
      ? Array.isArray(req.query.conservationStatus)
        ? req.query.conservationStatus.map(String)
        : [String(req.query.conservationStatus)]
      : undefined;

    const zooIds = req.query.zooId
      ? Array.isArray(req.query.zooId)
        ? req.query.zooId.map(Number)
        : [Number(req.query.zooId)]
      : undefined;

    const traits = req.query.traits
      ? Array.isArray(req.query.traits)
        ? req.query.traits.map(String)
        : [String(req.query.traits)]
      : undefined;

    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

    const where: any = { deletedAt: null };

    if (searchQuery) {
      where.OR = [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          species: {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    if (speciesNames && speciesNames.length > 0) {
      where.species = {
        ...where.species,
        name: { in: speciesNames },
      };
    }
    if (genders && genders.length > 0) {
      where.gender = { in: genders };
    }
    if (conservationStatuses && conservationStatuses.length > 0) {
      where.conservationStatus = { in: conservationStatuses };
    }
    if (zooIds && zooIds.length > 0) {
      where.zooId = { in: zooIds };
    }
    if (traits && traits.length > 0) {
      where.traits = { hasSome: traits };
    }

    const [total, animals] = await Promise.all([
      prisma.animal.count({ where }),
      prisma.animal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: sortOrder },
        include: { species: true, subSpecies: true, zoo: true },
      }),
    ]);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: animals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET animal by id
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const animal = await prisma.animal.findFirst({
      where: { id, deletedAt: null },
    });
    if (!animal) return res.status(404).json({ error: "Animal not found" });
    res.json(animal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE animal
router.post(
  "/",
  auth,
  requireRole("ZOO_ADMIN"),
  async (req: Request, res: Response) => {
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
      return res.status(400).json({ error: "Missing required fields" });
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
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// UPDATE animal
router.put(
  "/:id",
  auth,
  requireRole("ZOO_ADMIN"),
  async (req: Request, res: Response) => {
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
      });
      res.json(updatedAnimal);
    } catch (err: any) {
      console.error(err);
      if (err.code === "P2025") {
        return res.status(404).json({ error: "Animal not found" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// DELETE animal
router.delete(
  "/:id",
  auth,
  requireRole("ZOO_ADMIN"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      await prisma.animal.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      res.status(204).send();
    } catch (err: any) {
      console.error(err);
      if (err.code === "P2025") {
        return res.status(404).json({ error: "Animal not found" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
