require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan");

const app = express();

//Configs

require('./config/db.config');

//Middlewares

app.use(express.json());
app.use(morgan("dev"));


//Routes
const routes = require('./config/routes.config');

app.use('/' , routes);




//Error Handler

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });




