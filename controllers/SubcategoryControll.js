const express = require('express');
const CategoryModel = require('../models/Category');  // Додайте цей рядок
const SubcategoryModel = require('../models/Subcategory');
const categoryValidator = require('../validations/category');
const handleValidErors = require('../utils/handleValidErors');

const router = express.Router();


router.get('/category/:categoryID', async (req, res) => {
    try {
        const categoryId = req.params.categoryID;
        const subcategories = await SubcategoryModel.find({ category: categoryId });

        res.json(subcategories);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не вдалось отримати підкатегорії',
        });
    }
});

router.get('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await SubcategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: 'Підкатегорія не знайдена',
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
        const existingCategory = await CategoryModel.findById(req.body.category);
        if (!existingCategory) {
            return res.status(400).json({
                message: 'Категорія не знайдена',
            });
        }

        const subcategory = new SubcategoryModel({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            visibility: true,
            category: req.body.category,
        });

        const savedSubcategory = await subcategory.save();

        res.json(savedSubcategory);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Помилка додавання підкатегорії',
        });
    }
});


router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const deletedCategory = await SubcategoryModel.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({
                message: 'Підкатегорія не знайдена',
            });
        }
        res.json({
            message: 'Підкатегорія успішно видалена',
        });
    } catch (error) {
        console.error('Error deleting category by id:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.put('/:id/visibility', async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await SubcategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: 'Підкатегорія не знайдена',
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
        const updatedCategory = await SubcategoryModel.findByIdAndUpdate(categoryId, updatedCategoryData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({
                message: 'Підкатегорія не знайдена',
            });
        }
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category by id:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
