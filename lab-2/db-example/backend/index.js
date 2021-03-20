let express = require('express');
const mysql = require('mysql2/promise');
let cors = require('cors');
let app = express();
app.use(cors());
let bodyParser = require('body-parser');
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
let pool;


app.get('/', (request, response) => {
    console.log(`Request received from: ${request.headers.host} `);
    response.json('NodeJS REST API');
});

app.get('/users', async (request, response) => {
    let users = await getUsersFromDb();
    response.json(users);
});

app.get('/users/:id', async (request, response) => {
    let user = await getUserFromDbById(request.params.id);
    response.json(user);
});

app.put('/users', async (request, response) => {
    let res = await saveUserToDb(request.body);
    response.json({id: res.insertId});
});

app.post('/users', async (request, response) => {
    let res = await updateUser(request.body);
    response.json({ res } );
});

app.delete('/users/:id', async (request, response) => {
    let res = await deleteUserFromDbById(request.params.id);
    response.json(res);
});

async function getUserFromDbById(id) {
    return executeQuery(`SELECT * FROM Users WHERE id='${id}'`);
}

async function getUsersFromDb() {
    return executeQuery('SELECT * FROM Users');
}

async function saveUserToDb(user) {
    return executeQuery(`INSERT INTO Users (firstName, lastName, email, password) VALUES ('${user.firstName}', '${user.lastName}', '${user.email}', '${user.password}')`);
}

async function updateUser(user) {
    return executeQuery(`UPDATE Users SET firstName='${user.firstName}', lastName='${user.lastName}', email='${user.email}', password='${user.password}' WHERE id=${user.id}`);
}

async function deleteUserFromDbById(id) {
    return executeQuery(`DELETE FROM Users WHERE id=${id}`);
}

async function executeQuery(query){
    const result = await pool.query(query);
    return result[0];
}

function initDb() {
    pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password : "root",
        database: 'app_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

app.listen(3000, function () {
    initDb();
    console.log('Server running @ localhost:3000');
});
