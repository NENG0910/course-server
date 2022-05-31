const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const authRoute = require("./routes").auth;

mongoose
  .connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true, //刪除新引擎不支援，但對於舊topology引擎的連結功能
    useNewUrlParser: true, //選用新格式 mongodb+srv://，棄用舊格式
  })
  .then(() => {
    console.log("Connect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //接受除了string或array以外的型別
app.use("/api/user", authRoute);

app.listen(8080, () => {
  console.log("listening on port 8080.");
});
