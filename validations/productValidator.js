const { body } = require('express-validator');

module.exports = [
    body('name', 'вкажіть назву товару').isLength({ min: 3 }).isString(),
    body('description', 'вкажіть опис товару').isLength({ min: 3 }).isString(),
    body('imageUrl', 'неправильна силка на зображення').optional().isString(),
];