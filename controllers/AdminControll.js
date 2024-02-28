const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/Admin');
const handleValidErors = require('../utils/handleValidErors');
const router = express.Router();


router.post('/', handleValidErors, async (req, res) => {
    try {
        const admin = await AdminModel.findOne({ login: req.body.login });
        if (!admin) {
            return res.status(404).json({
            message: 'Логін або пароль не вірні',
        });
        }

        const isValidPass = await bcrypt.compare(req.body.password, admin._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
            message: 'Логін або пароль не вірні',
        });
        }

        const token = jwt.sign({ adminId: admin._id }, '54lBOrxEXO', { expiresIn: '2d' });

        res.json({
        success: true,
        token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Помилка авторизації',
        });
    }
});


module.exports = router;
