export const voteCandidate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { candidateId } = req.params;

    // 1️⃣ Find candidate + event
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(candidateId) },
      include: { event: true }
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const now = new Date();
    const { votingStart, votingEnd } = candidate.event;

    // 2️⃣ Voting window check
    if (!votingStart || !votingEnd) {
      return res.status(400).json({ message: "Voting schedule not configured" });
    }

    if (now < votingStart) {
      return res.status(400).json({ message: "Voting has not started yet" });
    }

    if (now > votingEnd) {
      return res.status(400).json({ message: "Voting has ended" });
    }

    // 3️⃣ Candidate approval check
    if (candidate.status !== "APPROVED") {
      return res.status(400).json({ message: "Candidate not approved" });
    }

    // 4️⃣ Prevent double voting
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        eventId: candidate.eventId
      }
    });

    if (existingVote) {
      return res.status(400).json({ message: "Already voted in this event" });
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

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Voting failed" });
  }
};
