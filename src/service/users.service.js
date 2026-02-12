// import { prisma } from '../../lib/prisma.js';
// import bcrypt from 'bcrypt';

// // const createUser = async (name, email, password) => {
// //   if (!name || !email || !password) {
// //     throw new Error("Name, email, and password are required");
// //   }
  
// //   const existingUser = await prisma.user.findUnique({
// //     where: { email }
// //   });
  
// //   if (existingUser) {
// //     throw new Error("User already exists");
// //   }
  
// //   // Hash password using bcrypt for security
// //   const saltRounds = 10;
// //   const hashedPassword = await bcrypt.hash(password, saltRounds);
  
// //   const result = await prisma.user.create({
// //     data: {
// //       name: name,
// //       email: email,
// //       password: hashedPassword
// //     }
// //   });
  
// //   return { message: "User registered successfully", user: result };
// // };
// const login = async (req ,res)=>
  
// export { createUser };
