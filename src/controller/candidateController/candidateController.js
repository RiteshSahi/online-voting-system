// import { prisma } from "../../config/db.js";

// // Apply as candidate (JSON only)
// export const applyAsCandidate = async (req, res) => {
//   try {
//     console.log("BODY:", req.body); // Should now contain vision,statement
//     console.log("USER JWT:", req.user);

//     const userId = req.user.id;
//     const { eventId } = req.params;

//     // Manifesto data from JSON body
//     const { vision,statement } = req.body;

//     // Basic validation
//     if (!vision || !statement) {
//       return res.status(400).json({ message: "Vision and statement are required" });
//     }

//     // 1️⃣ Check if event exists
//     const event = await prisma.event.findUnique({
//       where: { id: Number(eventId) }
//     });
//     if (!event) return res.status(404).json({ message: "Event not found" });

//     // 2️⃣ Check event phase
//     if (event.phase !== "APPLICATION") {
//       return res.status(400).json({ message: "Event is not in application phase" });
//     }

//     // 3️⃣ Check eligibility using JWT data
//     const userDept = req.user.department?.trim().toUpperCase();
//     const userBatch = req.user.batch?.toString().padStart(3, "0").trim();

//     const eventDept = event.allowedDept?.trim().toUpperCase();
//     const eventBatch = event.allowedBatch?.toString().padStart(3, "0").trim();


//     if (userDept !== eventDept || userBatch !== eventBatch) {
//       return res.status(403).json({ message: "You are not eligible for this event" });
//     }

//     // 4️⃣ Check if user already applied
//     const existingCandidate = await prisma.candidate.findUnique({
//       where: { userId_eventId: { userId, eventId: Number(eventId) } }
//     });
//     if (existingCandidate) {
//       return res.status(400).json({ message: "Already applied for this event" });
//     }

//     // 5️⃣ Create candidate application
//     const candidate = await prisma.candidate.create({
//       data: {
//         userId,
//         eventId: Number(eventId),
//         vision,
//         statement,
//         status: "PENDING"
//       }
//     });

//     res.json({
//       message: "Candidate application submitted successfully",
//       candidate
//     });

//   } catch (error) {
//     console.error("Apply candidate error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // List all candidates for an event
// export const listCandidates = async (req, res) => {
//   try {
//     const { eventId } = req.params;

//     // Check event exists
//     const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
//     if (!event) return res.status(404).json({ message: "Event not found" });

//     // Fetch candidates
//     const candidates = await prisma.candidate.findMany({
//       where: { eventId: Number(eventId) },
//       include: { user: { select: { name: true, email: true, batch: true ,department:true} } }
//     });

//     res.json({ event: event.title, candidates });

//   } catch (error) {
//     console.error("List candidates error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// //// Update candidate status (ADMIN only)
// export const updateCandidateStatus = async (req, res) => {
//   try {
//     const { candidateId } = req.params;
//     const { status } = req.body; // APPROVED or REJECTED

//     // Basic validation
//     if (!["APPROVED", "REJECTED"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const updatedCandidate = await prisma.candidate.update({
//       where: { id: Number(candidateId) },
//       data: { status }
//     });

//     res.json({ message: "Candidate status updated successfully", candidate: updatedCandidate });
//   } catch (error) {
//     console.error("Update candidate status error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// // Get logged-in user's candidate application status
// export const getMyCandidateStatus = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const applications = await prisma.candidate.findMany({
//       where: { userId },
//       include: {
//         event: {
//           select: {
//             id: true,
//             title: true,
//             phase: true
//           }
//         }
//       }
//     });

//     res.json({
//       total: applications.length,
//       applications
//     });

//   } catch (error) {
//     console.error("Get my candidate status error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


