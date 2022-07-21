// 첫 GET요청을 해보자
const express = require("express");
const app = express();

// The MongoClient class is a class that allows for making Connections to MongoDB.
const MongoClient = require("mongodb").MongoClient;

// EJS 사용하도록 설정
app.set("view engine", "ejs");

var db;

// DB 연결
MongoClient.connect("mongodb+srv://emdwlekr:TBVxY7PnrLhBmUoS@cluster0.wuba1f8.mongodb.net/?retryWrites=true&w=majority", function (err, client) {
  // 연결되면 할 일
  if (err) return console.log(err);

  db = client.db("CodingApple_todoApp");
  // db.collection("post").insertOne({ _id: 001, name: "Evan", age: 30 }, function (err, result) {
  //   console.log("실행중");
  // });

  app.listen(8080, function () {
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
  res.sendFile(__dirname + "/index.html");
});

// arrow function 을 사용해서 코드를 줄임
app.get("/beauty", (req, res) => {
  res.send("beauty shopping website");
});

app.get("/write", (req, res) => {
  console.log("to write!!!!!");
  res.sendFile(__dirname + "/write.html");
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
 * 어떤 사람이 /add 라는 경로로 post요청을 하면
 * 2개의 데이터(list, duedate)를 'post'라는 컬렉션에 저장하라
 */
app.post("/add", (req, res) => {
  res.send("Submission Complete");
  //   console.log(req.body);
  //   console.log(req.body.todolist);
  //   console.log(req.body.duedate);

  // counter 콜렉션에 저장된 총 개시물 수를 세어보자
  db.collection("counter").findOne({ name: "numberOfPost" }, (error, result) => {
    console.log(result.totalpost);
    // 총 게시물 변수에 저장
    var totalPost = result.totalpost;

    db.collection("post").insertOne({ _id: totalPost + 1, todoList: req.body.todolist, DueDate: req.body.duedate }, function () {
      console.log("저장완료");

      // couter라는 콜렉션에 있는 totalPost 항목도 1 증가시켜야 함
      db.collection("counter").updateOne({ name: "numberOfPost" }, { $inc: { totalpost: 1 } }, (err, result) => {
        if (err) throw err;
        console.log("1 document updated");
      });
    });
  });
});

/**
 * 저장된 데이터들을 새로운 페이지에 표시하는 코드를 작성해보자
누군가가 /list로 경로로 GET요청을 하면
저장된 데이터들을 html형식으로 보여주는 코드를 작성해보자
 */
app.get("/list", (req, res) => {
  // db.collection("post") -> 이게 거의 디폴트 시작이라고 보면 될거같다. post 콜렉션에 접근하는 코드
  // DB에 저장된 post라는 collection안에 있는 모든 데이터를 가져와라
  // EJS는 sendFile을 사용하면 안된다....
  db.collection("post")
    .find()
    .toArray((error, result) => {
      console.log(result);
      res.render("list.ejs", { posts: result });
    });
});

//
app.delete("/delete", (req, res) => {
  console.log(req.body);
});
