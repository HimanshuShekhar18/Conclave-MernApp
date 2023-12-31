require('dotenv').config();
const express = require('express');
const app = express(); // express ko call karna hain, "const app" express ka main object
const bodyParser = require('body-parser');
const DbConnect = require('./database');
const router = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
const corsOption = {
  credentials: true,
  origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));
/*
we want storage folder acts as a static file i.e. if someone wants to get image on the server 
*/
app.use('/storage', express.static('storage'));    // http://localhost:5500/storage/1703878915788-76464958.png

const PORT = process.env.PORT || 5500;
DbConnect();

// json ka middleware Add this middleware to parse JSON data
// extending the limit of the size of req above 100KB
app.use(express.json({ limit: '20mb' }));
app.use(bodyParser.json());

app.use(router);

app.get('/', (req, res) => {
  res.send('Hello from express Js');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));