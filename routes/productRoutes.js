const express=require('express');
const router=express.Router();
const productController=require('../controllers/productController');

router.post('/add-product/:firmId',productController.addProduct);
router.get('/:firmId/products',productController.getAllProducts);
router.get('/getProduct/:id',productController.getProduct);
router.get('/uploads/:imageName', (req, res) => {
    try {
        const imageName = req.params.imageName;

        const imagePath = path.join(__dirname, '..', 'uploads', imageName);

        res.setHeader('Content-Type', 'image/jpeg'); // or png
        res.sendFile(imagePath);
    } catch (error) {
        res.status(500).json({ message: 'Image not found' });
    }
});

router.delete('/delete/:productId',productController.deleteProduct);

module.exports=router;