const express = require('express');
const userRouter = express.Router();
const fs = require('fs');
const path = require('path');
const { prisma } = require('../lib/prisma');
const { createUser } = require('../service/users');

const dataPath = path.join(__dirname, '../data.json');
const data = require(dataPath);

// GET all users
userRouter.get('/', (req, res) => {
  res.json(data.users);
});

// POST new user (registration)
userRouter.post('/', (req, res) => {
  const { name, email, password } = req.body;
  return createUser(name, email, password);
});

export default userRouter;
