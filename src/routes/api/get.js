// src/routes/api/get.js
const express = require('express');
const router = express.Router();

// Get all fragments
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    fragments: []
  });
});

module.exports = router;