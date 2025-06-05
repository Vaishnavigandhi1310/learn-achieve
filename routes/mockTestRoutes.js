const express = require('express');
const router = express.Router();
const {
    createMockTest,
    getAllMockTests
} = require('../controllers/mockTestController');

router.post('/create',createMockTest);
router.get('/',getAllMockTests);

module.exports = router;