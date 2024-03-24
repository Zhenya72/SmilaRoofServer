const express = require('express');
const ProductModel = require('../models/Product');
const CategoryModel = require('../models/Category');
const SubcategoryModel = require('../models/Subcategory');
const productValidator = require('../validations/productValidator');
const handleValidErors = require('../utils/handleValidErors');

const router = express.Router();


router.get('/all/:subcategoryID', async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryID;
        const products = await ProductModel.find({ subcategory: subcategoryId });

        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не вдалось отримати товари',
        });
    }
});
router.get('/visibility', async (req, res) => {
    try {
        const products = await ProductModel.find({ visibility: true }).populate({
                path: 'subcategory',
                match: { visibility: true }
        });
        const visibleProducts = products.filter(product => product.subcategory !== null);
        res.json(visibleProducts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не вдалось отримати товари',
        });
    }
});

router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: 'Товар не знайдено',
            });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching category by id:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/', productValidator, handleValidErors, async (req, res) => {
    try {
        const product = new ProductModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            visibility: true,
            availability: true,
            subcategory: req.body.subcategory,
        });

        const savedProduct = await product.save();

        res.json(savedProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Помилка додавання товару',
        });
    }
});


router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({
                message: 'Товар не знайдено',
            });
        }
        res.json({
            message: 'Товар успішно видалено',
        });
    } catch (error) {
        console.error('Error deleting category by id:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.put('/:id/visibility', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Товар не знайдено',
      });
    }

    // Toggle visibility
    product.visibility = !product.visibility;
    
    // Save the updated category
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error toggling visibility by id:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id/availability', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Товар не знайдено',
      });
    }

    // Toggle visibility
    product.availability = !product.availability;
    
    // Save the updated category
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error toggling visibility by id:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', productValidator, handleValidErors, async (req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body;
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updatedProductData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Товар не знайдено',
            });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating category by id:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
