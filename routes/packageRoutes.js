const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const upload = require('../middleware/uploadMiddleware');

// Add package with image upload
router.post('/add', upload.single('image'), packageController.addPackage);

// Delete package by id
router.delete('/delete/:id', packageController.deletePackage);

//get all packages
router.get('/get',packageController.getAllPackages);

module.exports = router;
