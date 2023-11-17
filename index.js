const mongo = require("mongoose")
const express = require('express')
const app = express()
const port = 8787;


app.set('view engine', 'ejs')
app.set('views', './templates')
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongo.connect('mongodb+srv://rysbekdossayev:Laravel5@cluster0.guazwsy.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Соединение с базой данных установлено"))
    .catch(err => console.error("Ошибка подключения к базе данных:", err));

const bookSchema = new mongo.Schema({
    name: String,
    description:String,
    ganre:String,
    author: {},

});
const AuthorSchema = new mongo.Schema({
    name: String,
    surname: String,
    country: String,
});

const Book = mongo.model('Book',bookSchema );
const Author = mongo.model('Author',AuthorSchema )

app.get('/', async (req, res) => {
    try {
        const books = await Book.find({}).exec();
        res.render('index', { test: 12455, book_list: books });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка загрузки books');
    }
})


app.get('/create/book', async (req, res) => {

    const authors = await Author.find({}).exec();
    res.render('book_create', {authors:authors})
})
app.get('/create/author', (req, res) => {
    res.render('author_create')
})
app.post('/save/book', async (req, res) => {
    const name = req.body.name;
    const ganre = req.body.ganre;
    const description = req.body.description


    const author = await Author.find({_id :req.body.author}).exec();
    try {
        const testData = {name, ganre, description,author}
        const newUser = new Book(testData);
        await newUser.save();
        console.log('Book успешно добавлен');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сохранения Book');
    }

});
app.post('/save/author', async (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const country = req.body.country
    const testData = {name, surname, country}

    try {
        const newUser = new Author(testData);
        await newUser.save();
        console.log('author успешно добавлен');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сохранения author');
    }

});

app.get('/update-book/:id', async (req, res) => {

    try {
        let bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send('Book не найден');
        }
        res.render('book_edit',{ book: book })


    } catch (err) {
        console.error(err);
        res.status(500).send('not found  book');
    }
});

app.post('/update-book/:id', async (req, res) => {
    const bookId = req.params.id;
    const updatedData = req.body;
    try {
        // Используем метод findByIdAndUpdate для обновления данных студента
        const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, { new: true });

        if (!updatedBook) {
            return res.status(404).send('book не найден');
        }
        res.redirect('/update-book/'+bookId);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении студента');
    }
});


app.listen(port, () => {

})