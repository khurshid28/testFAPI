// const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);

// mongoose
// 	.connect(process.env.MONGODB_URL, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 	})
// 	.then(() => console.log("MongoDB Connected"))
// 	.catch((err) => console.log("Database error: ", err.message));

// get the client

const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: process.env.HOST_TEST,
  user: process.env.ROOT_TEST,
  database:process.env.DATABASE_TEST,
  password:process.env.PASSWORD_TEST,

});




module.exports = connection




