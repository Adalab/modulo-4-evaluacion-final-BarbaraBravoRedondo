const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const swaggerUi=require("swagger-ui-express")
const swaggerDocument=require("./swagger.json")

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = process.env.PORT || 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// conexion con la BD
async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASS,
    database: process.env.DATABASE,
  });
  try {
    await connection.connect();
    console.log(
      `Connection established with the database:(identificador=${connection.threadId})`
    );
  } catch (error) {
    console.error('Error to connect with database:', error);
  }

  return connection;
}
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//ALL DREAMS
server.get('/dreams', async (req, res) => {
  const connection = await getConnection();
  const query = 'SELECT * FROM Dreams';
  const [results] = await connection.query(query);
  const numOfElements = results.length;
  connection.end();
  res.json({ info: { count: numOfElements }, results: results });
});

//NEW ENTRY
server.post('/newDream', async (req, res) => {
  try {
    const { user_id, description, emotional_color, categories } = req.body;

    const connection = await getConnection();
    const query =
      'INSERT INTO Dreams (user_id, description, emotional_color, categories) VALUES (?, ?, ?, ?)';

    const [results] = await connection.query(query, [
      user_id,
      description,
      emotional_color,
      categories,
    ]);
    connection.end();
    res.json({
      success: true,
      id: results.insertId,
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Check all fields are filled and try it again.',
    });
  }
});
//UPDATE
server.put('/updateDream/:id', async (req, res) => {
  try {
    const connection = await getConnection();
    const dreamsId = req.params.id;
    const { user_id, description, emotional_color, categories } = req.body;

    if (!user_id || !description || !emotional_color || !categories) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    const query =
      'UPDATE Dreams SET user_id = ?, description = ?, emotional_color = ?, categories = ? WHERE id = ?';

    const [results] = await connection.query(query, [
      user_id,
      description,
      emotional_color,
      categories,
      dreamsId,
    ]);
    const updatedDreamId = dreamsId;
    connection.end();
    res.json({
      success: true,
      id: updatedDreamId,
    });
  } catch (error) {
    console.error('Error to try update the dream:', error);
  }
});
//DELETE DREAM
server.delete('/deleteDream/:id', async (req, res) => {
  try {
    const connection = await getConnection();
    const dreamsId = req.params.id;

    const query = 'DELETE FROM Dreams WHERE id = ?';
    const [results] = await connection.query(query, [dreamsId]);
    connection.end();
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Couldn't delete dream`,
    });
  }
});




//REGISTER
// REGISTER
server.post('/sign-up', async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // Check if the username is provided and not empty
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required.',
      });
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO Users (username, email, password) values (?,?,?) ';
    const connection = await getConnection();
    const [results] = await connection.query(sql, [username, email, passwordHashed]);

    console.log(results);
    connection.end();
    res.json({ success: true, id: results.insertId });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.json({
      success: false,
      message: 'Check all fields are filled and try again.',
    });
  }
});

//TOKEN
const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};


//LOGIN
server.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const sql = 'SELECT * FROM Users WHERE email = ?';
    const connection = await getConnection();
    const [users] = await connection.query(sql, [email]);
    connection.end();

    const user = users[0];

    if (!user) {
      return res.status(401).json({
        error: 'Invalid Credentials',
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({
        error: 'Invalid Credentials',
      });
    }

    const userForToken = {
      email: user.email,
      id: user.id,
    };

    const token = generateToken(userForToken);
    res.status(200).json({ token, username: user.username, email: user.email });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//MIDDLEWARE
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Token not provided' });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid Token' });
    }
    req.user = user;
    next();
  });
}
server.get('/ruta-protegida', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Access permitted' });
});
