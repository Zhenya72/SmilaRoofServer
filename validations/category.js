const { body } = require('express-validator');

module.exports = [
    body('name', 'вкажіть назву категорії').isLength({ min: 3 }).isString(),
    body('imageUrl', 'неправильна силка на зображення').optional().isString(),
];