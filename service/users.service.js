import { prisma } from '../lib/prisma';

const createUser =  (name, email, password) => {
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  const existingUser = data.users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: "User already exists" });
  // hashing password using bcrypt can be added here for security
  
  const result = prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password
    }
  });
  res.json({ message: "User registered successfully", user: result });
};

export { createUser };
