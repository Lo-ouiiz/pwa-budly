import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';

const router = Router();
const SALT_ROUNDS = 10;

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  birthDate: true,
  street: true,
  postalCode: true,
  city: true,
  country: true,
  phoneNumber: true,
  traits: true,
  sponsorships: true,
  invoices: true,
  createdAt: true,
};

// GET all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: userSelect,
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET user by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE user
router.post('/', async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    birthDate,
    street,
    postalCode,
    city,
    country,
    phoneNumber,
    traits,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !birthDate ||
    !street ||
    !postalCode ||
    !city ||
    !country
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        birthDate: new Date(birthDate),
        street,
        postalCode,
        city,
        country,
        phoneNumber,
        traits,
      },
      select: userSelect,
    });

    res.status(201).json(user);
  } catch (err: any) {
    console.error(err);
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE user
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const {
    firstName,
    lastName,
    email,
    password,
    birthDate,
    street,
    postalCode,
    city,
    country,
    phoneNumber,
    traits,
  } = req.body;

  try {
    const data: any = {
      firstName,
      lastName,
      email,
      street,
      postalCode,
      city,
      country,
      phoneNumber,
      traits,
    };

    if (birthDate) {
      data.birthDate = new Date(birthDate);
    }

    if (password) {
      data.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });

    res.json(updatedUser);
  } catch (err: any) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE user
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

// LOGIN user
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { passwordHash, ...safeUser } = user;

    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
