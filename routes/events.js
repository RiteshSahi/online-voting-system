const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
const data = require(dataPath);

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
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

  res.json({ message: "Voting event created successfully", event: newEvent });
});

module.exports = router;
