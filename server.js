// 첫 GET요청을 해보자
const express = require("express");
const app = express();

// add .env library
require("dotenv").config();

// The MongoClient class is a class that allows for making Connections to MongoDB.
const MongoClient = require("mongodb").MongoClient;

// EJS 사용하도록 설정
app.set("view engine", "ejs");

// middleware, 나는 public 파일을 보관하기 위해 public 폴더를 사용하곘다 라는 뜻
app.use("/public", express.static("public"));

// utilize method-override module
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

var db;

// DB 연결
MongoClient.connect(process.env.DB_URL, function (err, client) {
  if (err) return console.log(err);

  db = client.db("CodingApple_todoApp");
  // db.collection("post").insertOne({ _id: 001, name: "Evan", age: 30 }, function (err, result) {
  //   console.log("실행중");
  // });

  app.listen(parseInt(process.env.PORT), function () {
    console.log("MongoDB + NodeJs Server is running on port 8080");
  });
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// https://naverm.com/..../beauty/home 으로 GET요청을 하면 뷰티 상품들을 보여줌
// https://naverm.com/..../pet/home으로 GET요청하면 펫 상품을 보여줌
// 이걸 해본다(GET요청)
// -> 누군가가 /pet으로 방문을 하면.....pet관련 안내문을 띄워주자 라는 코드를 작성해보자.
app.get("/pet", function (req, res) {
  res.send("pet shopping website");
});

// HTML로 GET을 해보자.
app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

// arrow function 을 사용해서 코드를 줄임
app.get("/beauty", (req, res) => {
  res.send("beauty shopping website");
});

app.get("/write", (req, res) => {
  console.log("to write!!!!!");
  res.render(__dirname + "/views/write.ejs");
});
// 함수안에 함수가 있는걸 callback function 이라고 한다.

// 어떤사람이 /add로 경로로 post요청을 하면 ....?? 을 해주세요
// app.post("/add", (req, res) => {
//   res.send("Submission Complete");
//   console.log(req.body);
//   console.log(req.body.todolist);
//   console.log(req.body.duedate);
// });

/**
 * 저장된 데이터들을 새로운 페이지에 표시하는 코드를 작성해보자
누군가가 /list로 경로로 GET요청을 하면
저장된 데이터들을 html형식으로 보여주는 코드를 작성해보자
 */
app.get("/list", (req, res) => {
  // db.collection("post") -> 이게 거의 디폴트 시작이라고 보면 될거같다. post 콜렉션에 접근하는 코드
  // DB에 저장된 post라는 collection안에 있는 모든 데이터를 가져와라
  // EJS는 sendFile을 사용하면 안된다....render을 사용
  db.collection("post")
    .find()
    .toArray((error, result) => {
      console.log(result); // show all the lists in 'post' collection.
      res.render("list.ejs", { posts: result });
    });
});

// detail page.
app.get("/detail/:id", (req, res) => {
  db.collection("post").findOne({ _id: parseInt(req.params.id) }, (err, result) => {
    console.log(result);
    res.render("detail.ejs", { data: result }); /** {이런이름으로 : 이런데이터를전송} */
  });
});

app.get("/edit/:id", (req, res) => {
  db.collection("post").findOne({ _id: parseInt(req.params.id) }, (err, result) => {
    try {
      console.log(result);
      res.render("edit.ejs", { post: result });
    } catch (err) {
      console.log(err);
    }
  });
});

app.put("/edit", (req, res) => {
  // form에 담긴 제목, 날짜데이터를 가지고 db.collection('post')에 업데이트 함

  /**
   * updateOne({}, {}, function(err, result){})
   * 첫번째 {} == 어떤 게시물을수정 할 것인가
   * 두번쨰 {} == 수정값
   * 세번째 {} == 콜백함수
   */
  db.collection("post").updateOne({ _id: parseInt(req.body.id) }, { $set: { todoList: req.body.todolist, DueDate: req.body.duedate } }, (err, result) => {
    console.log("update complete");
    res.redirect("/list");
  });
});

// session 방식 login function create
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");

// middleware....??? what the heck???
/**
 * app.use('middleware'); -> 나는 미들웨어를 사용하곘다는 뜻
 * 웹서버는 요청 - 응답 해주는 머신
 * 요청하고 응답 중간에 뭔가 동작을 실행시키고 싶으면 app.use()를 사용한다....?
 */
app.use(session({ secret: "secretCode", resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// login function
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// login authentication
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/fail",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/mypage", didYouLoggedIn, (req, res) => {
  console.log(req.user);
  res.render("mypage.ejs", { User: req.user });
});

function didYouLoggedIn(req, res, next) {
  // req.user가 있으면... 없으면....
  if (req.user) {
    next();
  } else {
    res.send("did not logged in");
  }
}

passport.use(
  new localStrategy(
    {
      usernameField: "id",
      passwordField: "pw",

      // 로그인 후 세션을 저장할 것인지 묻는 문구
      session: true,
      passReqToCallback: false,
    },
    (typedId, typedPw, done) => {
      console.log(typedId, typedPw);
      db.collection("login").findOne({ id: typedId }, (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false, { message: "id do not exist" });
        if (typedPw == result.pw) {
          return done(null, result);
        } else {
          return done(null, false, { message: "pw wrong" });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.collection("login").findOne({ id: id }, (err, result) => {
    done(null, result);
  });
});

// signup function page
app.post("/register", (req, res) => {
  db.collection("login").insertOne({ id: req.body.id, pw: req.body.pw }, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

/**
 * 어떤 사람이 /add 라는 경로로 post요청을 하면
 * 2개의 데이터(list, duedate)를 'post'라는 컬렉션에 저장하라
 */
app.post("/add", (req, res) => {
  // counter 콜렉션에 저장된 총 개시물 수를 세어보자
  db.collection("counter").findOne({ name: "numberOfPost" }, (error, result) => {
    console.log(result.totalpost);
    // 총 게시물 변수에 저장
    var totalPost = result.totalpost;
    // 저장할 내용 오브젝트형식으로 저장.
    var posting = { _id: totalPost + 1, todoList: req.body.todolist, DueDate: req.body.duedate, createdBy: req.user._id };

    db.collection("post").insertOne(posting, () => {
      console.log("저장완료");

      // couter라는 콜렉션에 있는 totalPost 항목도 1 증가시켜야 함
      db.collection("counter").updateOne({ name: "numberOfPost" }, { $inc: { totalpost: 1 } }, (err, result) => {
        if (err) throw err;
        console.log("1 document updated");
      });
    });
  });
  res.redirect("/list");
});

// 삭제요청 처리하는 코드
app.delete("/delete", (req, res) => {
  console.log(req.body);
  req.body._id = parseInt(req.body._id);

  var dataDelete = { _id: req.body._id, createdBy: req.user._id };

  // req.body에 담겨진 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요.
  db.collection("post").deleteOne(dataDelete, function (error, result) {
    console.log("delete complete");
    res.status(200).send({ message: "delete success" });
    if (error) throw error;
  });
});

app.get("/search", (req, res) => {
  // 검색조건 중복 가능
  var condition = [
    {
      $search: {
        index: "todoList_search",
        text: {
          query: req.query.value,
          path: "todoList", // 제목날짜 둘다 찾고 싶으면 ['todoList', 'DueDate']
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
    // score는 검색결과가 얼마나 match하는정도의 비율
    { $project: { todoList: 1, _id: 0, score: { $meta: "searchScore" } } },
  ];

  db.collection("post")
    //.find({ $text: { $search: req.query.value } })
    .aggregate(condition)
    .toArray((err, result) => {
      console.log(result);
      if (err) throw err;
      res.render("search.ejs", { posts: result });
    });
});

// api파일(shop.js) require로 불러오기
app.use("/shop", require("./routes/shop.js"));
app.use("/board/sub", require("./routes/board.js"));

// upload function
app.get("/upload", (req, res) => {
  res.render("upload.ejs");
});

// multer 사용법 -> 데이터를 쉽게 전송하는 라이브러리
let multer = require("multer");
var storage = multer.diskStorage({
  // 저장 위치 설정
  destination: (req, file, cb) => {
    cb(null, "./public/image");
  },
  // 파일명 설정...?
  filename: (req, file, cb) => {
    cb(null, file.originalname + new Date());
  },
});

var upload = multer({
  storage: storage,
});

app.post("/upload", upload.single("profile"), (req, res) => {
  // 여러개의 파일은 'upload.array('input의 name', 최대 x개)' => upload('profile', 10)
  res.send("saved");
});

// 업로드한 파일 보는 페이지
app.get("/image/:imageName", (req, res) => {
  res.sendFile(__dirname + "/public/image/" + req.params.imageName);
});

//<img src="/image/cafe.jpeg"></img>;

// chat id save to DB
app.post("/chatroom", didYouLoggedIn, (req, res) => {
  var chatData = {
    title: "somethingChatroom",
    //[채팅당한 유저의 id, 채팅을 건 유저의 id]
    member: [req.body.SelectedId, res.user._id],
    date: new Date(),
  };

  db.collection("chatroom")
    .insertOne(chatData)
    .then((result) => {});
});
