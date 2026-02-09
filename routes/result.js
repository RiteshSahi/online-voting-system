const express = require('express');
const router = express.Router();
const data = require('../data.json');

// GET results for an event
router.get('/:eventId', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const eventCandidates = data.candidates.filter(c => c.eventId === eventId && c.approved);
  res.json(eventCandidates);
});

module.exports = router;
