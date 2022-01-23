require("dotenv").config();

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME ,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "loggin": false
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME ,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "loggin": false

  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME ,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "loggin": false

  }
}