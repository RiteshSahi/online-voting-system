import express from 'express';
import { readFileSync } from 'fs';

const dataPath = './data.json';
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

const router = express.Router();

// GET results for an event
router.get('/:eventId', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const eventCandidates = data.candidates.filter(c => c.eventId === eventId && c.approved);
  res.json(eventCandidates);
});

export default router;
