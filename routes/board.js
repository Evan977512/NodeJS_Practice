var router = require("express").Router();

// router 폴더와 파일을 만들어 api 관리하는 방법
router.get("/sports", (req, res) => {
  res.send("Sports gallary!");
});

router.get("/game", (req, res) => {
  res.send("Game gallary!!");
});

module.exports = router;
