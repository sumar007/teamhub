const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const {User} =require('./models/usermodel')
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const apiRouter = require('./controllers/usercontroller');
app.use('/', apiRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
