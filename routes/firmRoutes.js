const express = require('express');
const router = express.Router();
const path = require('path');

const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

/* ================= ADD FIRM ================= */
router.post(
  '/add-firm',
  verifyToken,
  firmController.addFirm
);

/* ================= SERVE FIRM IMAGE ================= */
router.get('/uploads/:imageName', (req, res) => {
  const imagePath = path.join(__dirname, '..', 'uploads', req.params.imageName);
  res.sendFile(imagePath, err => {
    if (err) {
      res.status(404).json({ message: 'Image not found' });
    }
  });
});

/* ================= GET ALL FIRMS ================= */
router.get('/get-allFirms', verifyToken, firmController.getAllFirms);

/* ================= DELETE FIRM ================= */
router.delete('/delete/:firmId', verifyToken, firmController.deleteFirm);

module.exports = router;
