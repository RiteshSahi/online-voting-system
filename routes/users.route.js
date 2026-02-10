import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
//import { prisma } from '../lib/prisma.ts';
//import { createUser } from '../service/users.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../data.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

const userRouter = express.Router();

// GET all users
userRouter.get('/', (req, res) => {
  res.json(data.users);
});

// POST new user (registration)
userRouter.post('/', (req, res) => {
  const { name, email, password } = req.body;
  //return createUser(name, email, password);
  res.json({ message: "User registration not yet implemented" });
});

export default userRouter;
