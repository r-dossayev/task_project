const mongo = require("mongoose")
const express = require('express')
const app = express()
const port = 8787;


app.set('view engine', 'ejs')
app.set('views', './templates')
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongo.connect('mongodb+srv://rysbekdossayev:Istemit_Pidr;@cluster0.guazwsy.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Соединение с базой данных установлено"))
    .catch(err => console.error("Ошибка подключения к базе данных:", err));
const studentSchema = new mongo.Schema({
    name: String,
    surname: String,
    gpa: Number,
});

// Создание модели данных на основе схемы
const Student = mongo.model('Student', studentSchema);


(async () => {
    try {
        const students = await Student.find({}).exec();

        // students содержит массив всех записей из коллекции
        console.log(students);
    } catch (err) {
        console.error(err);
    }
})();
console.log("efd")
const userSchema = new mongo.Schema({
    username: String,
    password: String,
});

const User = mongo.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('index', {test: 12455})
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})
// app.post('/register', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//         console.log(username)
//         console.log(password)
//
// });

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const testData = {
        username,
        password
    };

    try {
        // Создайте новую запись в базе данных
        const newUser = new User(testData);

        // Сохраните нового пользователя в базе данных и дождитесь выполнения операции
        await newUser.save();

        console.log('Тестовый пользователь успешно добавлен');
        res.redirect('/'); // Перенаправьте пользователя после успешного добавления
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сохранения пользователя');
    }
});

app.listen(port, () => {

})