var router = require("express").Router();

// 로그인 했는지 확인하는 function
function didYouLoggedIn(req, res, next) {
  // req.user가 있으면... 없으면....
  if (req.user) {
    next();
  } else {
    res.send("You did not logged in");
  }
}

// 모든 router들에 middleware를 적용하고 싶다면...
router.use(didYouLoggedIn);
// /shirts에만 미들웨어 적용하고 싶다면....
router.use("/shirts", didYouLoggedIn);

// router 폴더와 파일을 만들어 api 관리하는 방법
// middleware로 didYouLoggedIn 펑션 추가

// 미들웨어 일일히 입력했을때
// router.get("/shirts", didYouLoggedIn, (req, res) => {
//   res.send("shirts on sale!!");
// });

// 미들웨어 router.use(didYouLoggedIn); 으로 디폴트 처리 했을때.
router.get("/shirts", (req, res) => {
  res.send("shirts on sale!!");
});

router.get("/pants", (req, res) => {
  res.send("pants on sale!!");
});

module.exports = router;
