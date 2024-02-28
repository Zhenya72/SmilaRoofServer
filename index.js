const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const multer = require('multer');

const CategoriesControll = require('./controllers/CategoriesControll');
const SubcategoryControll = require('./controllers/SubcategoryControll');
const AdminControll = require('./controllers/AdminControll');

const app = express();


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

app.use(express.json())
app.use(cors());
app.use('/uploads', express.static('uploads'));
const PORT = config.get('serverPort');

// Підключення до MongoDB
mongoose
    .connect('mongodb+srv://Yevheniy:mfBgVwuNkIXOpecY@roof.5chdwzj.mongodb.net/smilaroof?retryWrites=true&w=majority')
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB  error', err));


// Категорії
app.use('/categories', CategoriesControll);
app.use('/subcategories', SubcategoryControll);
app.use('/admin', AdminControll);

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server started on port ${PORT}`);
});
