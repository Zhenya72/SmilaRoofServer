const express = require('express');
const ProductModel = require('../models/Product');
const CategoryModel = require('../models/Category');
const SubcategoryModel = require('../models/Subcategory');
const categoryValidator = require('../validations/category');
const handleValidErors = require('../utils/handleValidErors');

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не вдалось отримати категорії',
        });
    }
});

router.get('/visibility', async (req, res) => {
    try {
        const categories = await CategoryModel.find({ visibility: true });
        res.json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не вдалось отримати категорії',
        });
    }
});

router.get('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: 'Категорія не знайдена',
            });
        }
        res.json(category);
    } catch (error) {
        console.error('Error fetching category by id:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', categoryValidator, handleValidErors, async (req, res) => {
    try {
        const doc = new CategoryModel({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            visibility: true,
        });

        const category = await doc.save();

        res.json(category);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Помилка додавання категорії',
        });
    }
});

router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const subcategories = await SubcategoryModel.find({ category: categoryId });
        // Збираємо ідентифікатори підкатегорій
        const subcategoryIds = subcategories.map(subcategory => subcategory._id);
        // Видаляємо товари, які належать до знайдених підкатегорій
        await ProductModel.deleteMany({ subcategory: { $in: subcategoryIds } });
        await SubcategoryModel.deleteMany({ category: categoryId });
        const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({
                message: 'Категорія не знайдена',
            });
        }
        res.json({
            message: 'Категорія успішно видалена',
        });
    } catch (error) {
        console.error('Error deleting category by id:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/:id/visibility', async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: 'Категорія не знайдена',
      });
    }

    // Toggle visibility
    category.visibility = !category.visibility;
    
    // Save the updated category
    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error toggling visibility by id:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', categoryValidator, handleValidErors, async (req, res) => {
    const categoryId = req.params.id;
    const updatedCategoryData = req.body;
    try {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, updatedCategoryData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({
                message: 'Категорія не знайдена',
            });
        }
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category by id:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
