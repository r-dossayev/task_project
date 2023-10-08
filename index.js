const mongo = require("mongoose")
const express = require('express')
const app = express()
const port = 8787;


app.set('view engine', 'ejs')
app.set('views', './templates')
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongo.connect('mongodb+srv://rysbekdossayev:~Istemit_Mal_Pidr_Urlama~@cluster0.guazwsy.mongodb.net/?retryWrites=true&w=majority', {
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


const Student = mongo.model('Student', studentSchema);



app.get('/', async (req, res) => {
    try {
        const students = await Student.find({}).exec();
        res.render('index', { test: 12455, student_list: students });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка загрузки студентов');
    }
})


app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/add/student', (req, res) => {
    res.render('add_st')
})
app.post('/add/student', async (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const gpa = req.body.gpa
    const testData = {name, surname, gpa}

    try {
        const newUser = new Student(testData);
        await newUser.save();
        console.log('Student успешно добавлен');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сохранения student');
    }

});


app.post('/update-student/:id', async (req, res) => {
    const studentId = req.params.id;
    const updatedData = req.body;
    try {
        // Используем метод findByIdAndUpdate для обновления данных студента
        const updatedStudent = await Student.findByIdAndUpdate(studentId, updatedData, { new: true });

        if (!updatedStudent) {
            return res.status(404).send('Студент не найден');
        }

        // Возвращаем обновленные данные студента в ответе
        res.json(updatedStudent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении студента');
    }
});


app.listen(port, () => {

})