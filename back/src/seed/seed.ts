import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

const speciesData = JSON.parse(
  fs.readFileSync(path.resolve("./src/seed/data/species.json"), "utf-8"),
);
const animalsData = JSON.parse(
  fs.readFileSync(path.resolve("./src/seed/data/animals.json"), "utf-8"),
);

async function main() {
  console.log("🌱 Seeding...");

  const passwordHash = await bcrypt.hash("mdp123/", 10);

  // =====================
  // USERS
  // =====================
  console.log("Seeding users...");

  const jeanne = await prisma.user.upsert({
    where: { email: "jeanne.dupont@zoo-grenoble.fr" },
    update: {},
    create: {
      role: "ZOO_ADMIN",
      firstName: "Jeanne",
      lastName: "Dupont",
      email: "jeanne.dupont@zoo-grenoble.fr",
      passwordHash,
      birthDate: new Date("1994-10-05"),
      street: "16 Avenue Benoît Frachon",
      postalCode: "38100",
      city: "Grenoble",
      country: "France",
      phoneNumber: "0612345678",
      traits: ["Protecteur", "Calme", "Sensible"],
    },
  });

  const marc = await prisma.user.upsert({
    where: { email: "marc.lemoine@zoo-lyon.fr" },
    update: {},
    create: {
      role: "ZOO_ADMIN",
      firstName: "Marc",
      lastName: "Lemoine",
      email: "marc.lemoine@zoo-lyon.fr",
      passwordHash,
      birthDate: new Date("1985-02-12"),
      street: "5 Rue de la République",
      postalCode: "69001",
      city: "Lyon",
      country: "France",
      phoneNumber: "0678123456",
      traits: ["Curieux", "Sociable"],
    },
  });

  const claire = await prisma.user.upsert({
    where: { email: "claire.moreau@mail.com" },
    update: {},
    create: {
      role: "USER",
      firstName: "Claire",
      lastName: "Moreau",
      email: "claire.moreau@mail.com",
      passwordHash,
      birthDate: new Date("1991-06-18"),
      street: "12 Rue des Écoles",
      postalCode: "75005",
      city: "Paris",
      country: "France",
      phoneNumber: "0600112233",
      traits: ["Joyeux", "Affectueux"],
    },
  });

  // =====================
  // ZOOS
  // =====================
  console.log("Seeding zoos...");

  const grenobleZoo = await prisma.zoo.upsert({
    where: { slug: "zoo-de-grenoble" },
    update: {},
    create: {
      name: "Zoo de Grenoble",
      slug: "zoo-de-grenoble",
      street: "16 Avenue Benoît Frachon",
      postalCode: "38100",
      city: "Grenoble",
      country: "France",
      logo: "https://www.pngmart.com/files/23/Zoo-PNG.png",
      labels: ["National", "Conservation"],
      photos: [],
      description:
        "Zoo alpin engagé dans la conservation des espèces menacées.",
    },
  });

  const lyonZoo = await prisma.zoo.upsert({
    where: { slug: "zoo-de-lyon" },
    update: {},
    create: {
      name: "Zoo de Lyon",
      slug: "zoo-de-lyon",
      street: "5 Rue de la République",
      postalCode: "69001",
      city: "Lyon",
      country: "France",
      logo: "https://www.pngmart.com/files/23/Zoo-PNG.png",
      labels: ["Régional"],
      photos: [],
      description: "Parc zoologique urbain à vocation pédagogique.",
    },
  });

  // =====================
  // SPECIES & SUBSPECIES
  // =====================
  console.log("🦁 Seeding species...");

  const speciesMap = new Map<string, number>();
  const subSpeciesMap = new Map<string, number>();

  for (const entry of speciesData) {
    const species = await prisma.species.upsert({
      where: { name: entry.species },
      update: {},
      create: { name: entry.species },
    });

    speciesMap.set(entry.species, species.id);

    for (const sub of entry.subspecies) {
      const subSpecies = await prisma.subSpecies.upsert({
        where: {
          name_speciesId: {
            name: sub,
            speciesId: species.id,
          },
        },
        update: {},
        create: {
          name: sub,
          speciesId: species.id,
        },
      });

      subSpeciesMap.set(`${entry.species}-${sub}`, subSpecies.id);
    }
  }

  // =====================
  // ANIMALS
  // =====================
  console.log("🐾 Seeding animals...");

  const createdAnimals: Record<string, any> = {};

  for (const animal of animalsData) {
    const speciesId = speciesMap.get(animal.species);
    if (!speciesId) {
      console.warn(`⚠️ Espèce non trouvée: ${animal.species}`);
      continue;
    }

    let subSpeciesId: number | undefined = undefined;
    if (animal.subSpecies) {
      subSpeciesId = subSpeciesMap.get(
        `${animal.species}-${animal.subSpecies}`,
      );
      if (!subSpeciesId) {
        console.warn(`⚠️ Sous-espèce non trouvée: ${animal.subSpecies}`);
      }
    }

    let zooId =
      animal.birthPlace && animal.birthPlace.includes("Grenoble")
        ? grenobleZoo.id
        : lyonZoo.id;

    const created = await prisma.animal.create({
      data: {
        name: animal.name,
        slug: `${animal.slug}-${zooId}`,
        photos: animal.photos,
        age: animal.age,
        gender: animal.gender,
        conservationStatus: animal.conservationStatus as any,
        birthDate: animal.birthDate ? new Date(animal.birthDate) : null,
        birthPlace: animal.birthPlace,
        story: animal.story,
        description: animal.description,
        naturalHabitat: animal.naturalHabitat,
        diet: animal.diet,
        weight: animal.weight,
        size: animal.size,
        physicalSpecificity: animal.physicalSpecificity,
        lifeExpectancyYears: animal.lifeExpectancyYears,
        sponsorshipImpact: animal.sponsorshipImpact,
        traits: animal.traits as any,
        species: { connect: { id: speciesId } },
        subSpecies: subSpeciesId
          ? { connect: { id: subSpeciesId } }
          : undefined,
        zoo: { connect: { id: zooId } },
      },
    });

    createdAnimals[animal.name] = created;
  }

  // =====================
  // PLANS
  // =====================
  console.log("Seeding sponsorship plans...");

  const planGrenobleCopain = await prisma.sponsorshipPlan.create({
    data: {
      name: "Copain",
      description: "",
      basePrice: 20,
      taxReducedPrice: 6.8,
      benefits: [
        "Newsletter",
        "Photo du filleul",
        "Certificat de parrainage",
        "Fiche de présentation",
        "Prénom sur le tableau des parrains",
        "Vidéo de remerciement",
        "Invitation à la journée des parrains",
      ],
      durationMonths: 12,
      zoo: { connect: { id: grenobleZoo.id } },
    },
  });

  await prisma.sponsorshipPlan.create({
    data: {
      name: "Ami",
      description: "",
      basePrice: 50,
      taxReducedPrice: 17,
      benefits: [
        "Newsletter",
        "Photo du filleul",
        "Certificat de parrainage",
        "Fiche de présentation",
        "Prénom sur le tableau des parrains",
        "Vidéo de remerciement",
        "Fond d'écran",
        "Invitation à la journée des parrains",
      ],
      durationMonths: 12,
      zoo: { connect: { id: grenobleZoo.id } },
    },
  });

  await prisma.sponsorshipPlan.create({
    data: {
      name: "Compagnon",
      description: "",
      basePrice: 100,
      taxReducedPrice: 34,
      benefits: [
        "Newsletter",
        "Photo du filleul",
        "Certificat de parrainage",
        "Fiche de présentation",
        "Prénom sur le tableau des parrains",
        "Vidéo de remerciement",
        "Fond d'écran",
        "Photo chaque semestre",
        "Dossier rétrospective",
        "Invitation à la journée des parrains",
      ],
      durationMonths: 12,
      zoo: { connect: { id: grenobleZoo.id } },
    },
  });

  await prisma.sponsorshipPlan.create({
    data: {
      name: "Passionné",
      description: "",
      basePrice: 500,
      taxReducedPrice: 170,
      benefits: [
        "Newsletter",
        "Photo du filleul",
        "Certificat de parrainage",
        "Fiche de présentation",
        "Prénom sur le tableau des parrains",
        "Vidéo de remerciement",
        "Fond d'écran",
        "Photo chaque semestre",
        "Dossier rétrospective",
        "Invitation à la journée des parrains",
        "Un Zoo Pass",
        "Visite guidée",
        "Vidéo de remerciement personnalisée",
      ],
      durationMonths: 12,
      zoo: { connect: { id: grenobleZoo.id } },
    },
  });

  await prisma.sponsorshipPlan.create({
    data: {
      name: "Ami",
      description: "",
      basePrice: 50,
      taxReducedPrice: 17,
      benefits: [
        "Newsletter",
        "Photo du filleul",
        "Certificat de parrainage",
        "Fiche de présentation",
        "Prénom sur le tableau des parrains",
        "Vidéo de remerciement",
        "Fond d'écran",
        "Invitation à la journée des parrains",
      ],
      durationMonths: 12,
      zoo: { connect: { id: lyonZoo.id } },
    },
  });

  await prisma.sponsorshipPlan.create({
    data: {
      name: "Admirateur",
      description: "",
      basePrice: 150,
      taxReducedPrice: 51,
      benefits: [
        "Newsletter",
        "Photo du filleul",
        "Certificat de parrainage",
        "Fiche de présentation",
        "Prénom sur le tableau des parrains",
        "Vidéo de remerciement",
        "Fond d'écran",
        "Photo chaque semestre",
        "Dossier rétrospective",
        "Un billet adulte",
        "Invitation à la journée des parrains",
      ],
      durationMonths: 12,
      zoo: { connect: { id: lyonZoo.id } },
    },
  });

  // =====================
  // SPONSORSHIP
  // =====================
  console.log("Seeding sponsorships...");

  const sponsorship = await prisma.sponsorship.create({
    data: {
      status: "ACTIF",
      startDate: new Date("2025-01-05"),
      endDate: new Date("2026-01-05"),
      amount: 20,
      autoRenew: true,
      transactionId: "pi_3T2X2VJ25t3tWopL0Uxp2beX",
      user: { connect: { id: claire.id } },
      animal: { connect: { id: createdAnimals["Simba"].id } },
      plan: { connect: { id: planGrenobleCopain.id } },
    },
  });

  // =====================
  // INVOICE
  // =====================
  console.log("Seeding invoices...");

  await prisma.invoice.create({
    data: {
      amount: 20,
      issuedAt: new Date("2025-01-05"),
      paid: true,
      pdfUrl: "https://example.com/invoices/invoice-0001.pdf",
      user: { connect: { id: claire.id } },
      sponsorship: { connect: { id: sponsorship.id } },
    },
  });

  console.log("✅ Seed terminé");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
