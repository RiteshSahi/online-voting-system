import express from 'express';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const dataPath = join(__dirname, '../data.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

// GET all events
router.get('/', (req, res) => {
  res.json(data.events);
});

// POST new event
router.post('/', (req, res) => {
  const { title, type, eligibility, applicationDeadline, startTime, endTime } = req.body;
  if (!title || !type || !eligibility || !applicationDeadline || !startTime || !endTime) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const id = data.events.length + 1;
  const newEvent = {
    id,
    title,
    type,
    eligibility,
    applicationDeadline,
    startTime,
    endTime,
    status: "upcoming"
  };

  data.events.push(newEvent);

  // Save to data.json
  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

  res.json({ message: "Voting event created successfully", event: newEvent });
});

export default router;
