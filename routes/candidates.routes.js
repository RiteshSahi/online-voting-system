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

// GET all candidates
router.get('/', (req, res) => {
  res.json(data.candidates);
});

// POST candidate application
router.post('/', (req, res) => {
  const { userId, eventId } = req.body;
  if (!userId || !eventId) return res.status(400).json({ message: "userId and eventId required" });

  const user = data.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const event = data.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const alreadyApplied = data.candidates.find(c => c.userId === userId && c.eventId === eventId);
  if (alreadyApplied) return res.status(400).json({ message: "User already applied for this event" });

  const id = data.candidates.length + 1;
  const newCandidate = { id, userId, eventId, approved: false, votes: 0 };
  data.candidates.push(newCandidate);

  // Save to data.json
  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

  res.json({ message: "Candidate applied successfully", candidate: newCandidate });
});
router.patch('/:id/approve', (req, res) => {
  const candidateId = parseInt(req.params.id);

  const candidate = data.candidates.find(c => c.id === candidateId);
  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found" });
  }

  candidate.approved = true;

  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

  res.json({
    message: "Candidate approved successfully",
    candidate
  });
});
router.patch('/:id/reject', (req, res) => {
  const candidateId = parseInt(req.params.id);

  const candidateIndex = data.candidates.findIndex(c => c.id === candidateId);
  if (candidateIndex === -1) {
    return res.status(404).json({ message: "Candidate not found" });
  }

  const removedCandidate = data.candidates.splice(candidateIndex, 1)[0];

  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

  res.json({
    message: "Candidate rejected and removed",
    candidate: removedCandidate
  });
});


export default router;
