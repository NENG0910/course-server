const router = require("express").Router();

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

module.exports = router;
