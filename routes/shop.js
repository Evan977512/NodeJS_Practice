var router = require("express").Router();

// router 폴더와 파일을 만들어 api 관리하는 방법
router.get("/shirts", (req, res) => {
  res.send("shirts on sale!!");
});

router.get("/pants", (req, res) => {
  res.send("pants on sale!!");
});

module.exports = router;
