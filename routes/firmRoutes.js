const express = require('express');
const router = express.Router();
const path = require('path');

const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

router.post(
  '/add-firm',
  verifyToken,
  ...firmController.addFirm
);

router.get('/uploads/:imageName', (req, res) => {
  try {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);
    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({ message: 'Image not found' });
  }
});

router.get('/get-allFirms', verifyToken, firmController.getAllFirms);

router.delete('/delete/:firmId', verifyToken, firmController.deleteFirm);

module.exports = router;
