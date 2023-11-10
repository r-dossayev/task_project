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
    author:Number,

});
const AuthorSchema = new mongo.Schema({
    name: String,
    surname: String,
    country: Number,
});

const Book = mongo.model('Book',bookSchema );
const Author = mongo.model('Author',AuthorSchema )

app.get('/', async (req, res) => {
    try {
        const students = await Book.find({}).exec();
        res.render('index', { test: 12455, student_list: students });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка загрузки books');
    }
})


app.get('/create/book', (req, res) => {
    res.render('book_create')
})
app.get('/create/author', (req, res) => {
    res.render('author_create')
})
app.post('/save/book', async (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const gpa = req.body.gpa
    const testData = {name, surname, gpa}

    try {
        const newUser = new Student(testData);
        await newUser.save();
        console.log('Book успешно добавлен');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сохранения Book');
    }

});

app.get('/update-book/:id', async (req, res) => {

    try {
        let studentId = req.params.id;
        const student = await Book.findById(studentId);
        if (!student) {
            return res.status(404).send('Book не найден');
        }
        res.render('book_edit',{ student: student })


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