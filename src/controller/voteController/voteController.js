export const voteCandidate = async (req, res) => {
  const userId = req.user.id;
  const { candidateId } = req.params;

  // 1️⃣ Find candidate + event
  const candidate = await prisma.candidate.findUnique({
    where: { id: Number(candidateId) },
    include: { event: true }
  });

  if (!candidate) return res.status(404).json({ message: "Candidate not found" });

  // 2️⃣ Check event phase
  if (candidate.event.phase !== "VOTING") {
    return res.status(400).json({ message: "Voting not active" });
  }

  // 3️⃣ Check approval
  if (candidate.status !== "APPROVED") {
    return res.status(400).json({ message: "Candidate not approved" });
  }

  // 4️⃣ Prevent double voting
  const existingVote = await prisma.vote.findFirst({
    where: { userId, eventId: candidate.eventId }
  });

  if (existingVote) {
    return res.status(400).json({ message: "Already voted" });
  }

  // 5️⃣ Save vote
  await prisma.vote.create({
    data: {
      userId,
      candidateId,
      eventId: candidate.eventId
    }
  });

  res.json({ message: "Vote recorded successfully" });
};
