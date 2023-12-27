require('dotenv').config();
const express = require('express');
const app = express(); // express ko call karna hain, "const app" express ka main object
const bodyParser = require('body-parser');
const DbConnect = require('./database');
const router = require('./routes');
const cors = require('cors');

const corsOption = {
  origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));

const PORT = process.env.PORT || 5500;
DbConnect();

// json ka middleware
// Add this middleware to parse JSON data
app.use(express.json());
app.use(bodyParser.json());


app.use(router);

app.get('/', (req, res) => {
  res.send('Hello from express Js');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));