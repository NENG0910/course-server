const router = require("express").Router();
const registerValidation = require("../vaildation").registerValidation;
const loginValidation = require("../vaildation").loginValidation;

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
router.post("/register", (req, res) => {
  console.log("Register");
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
});

module.exports = router;
