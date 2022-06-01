const res = require("express/lib/response");
const { func } = require("joi");

const router = require("express").Router();
const registerValidation = require("../vaildation").registerValidation;
const loginValidation = require("../vaildation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

//有動作即console.log訊息
router.use((req, res, next) => {
  console.log("A request is comming in to auth.js");
  next();
});

//postman測試伺服器是否連接
//GET localhost:8080/api/user/testAPI
router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working",
  };
  return res.json(msgObj);
});

//postman POST Body raw
router.post("/register", async (req, res) => {
  //check the validation of data
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //check the email  exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("This email is registed");
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "success",
      saveObject: savedUser,
    });
  } catch (err) {
    res.status(400).send("User is not been saved.");
  }
});

router.post("/login", (req, res) => {
  //check the validation of data
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    }
    if (!user) {
      res.status(401).send("This user is not found.");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) {
          return res.status(400).send(err);
        }
        if (isMatch) {
          const tokenObject = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ success: "true", token: "JWT " + token, user });
        } else {
          res.status(401).send("Wrong Password");
        }
      });
    }
  });
});

module.exports = router;

//123456@gmail.com
//"JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mjk3ODlkNGE3NmJmZjljMDIzYmFkNzYiLCJlbWFpbCI6IjEyMzQ1NkBnbWFpbC5jb20iLCJpYXQiOjE2NTQwOTg0MDZ9.uzt6wD_u49OaPBSsup8YqZ7fBsxol7V-MYDUUqbR41M"
