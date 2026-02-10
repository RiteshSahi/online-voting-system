import { Router } from 'express';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = Router();
const dataPath = join(__dirname, '../data.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

// POST vote
router.post('/', (req, res) => {
  const { userId, candidateId } = req.body;
  if (!userId || !candidateId) return res.status(400).json({ message: "userId and candidateId required" });

  const candidate = data.candidates.find(c => c.id === candidateId);
  if (!candidate) return res.status(404).json({ message: "Candidate not found" });

  // Only approved candidates
  if (!candidate.approved) return res.status(400).json({ message: "Candidate not approved yet" });

  // Check if user already voted for this event
  const alreadyVoted = data.votes.find(v => v.userId === userId && v.eventId === candidate.eventId);
  if (alreadyVoted) return res.status(400).json({ message: "User already voted in this event" });

  // Save vote
  const vote = { userId, candidateId, eventId: candidate.eventId };
  data.votes.push(vote);
  candidate.votes += 1;

  // Save to data.json
  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

  res.json({ message: "Vote submitted successfully" });
});

export default router;
