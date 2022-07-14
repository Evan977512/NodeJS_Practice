// 첫 GET요청을 해보자
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, function () {
  console.log("Server is running on port 8080");
});

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
  res.sendFile(__dirname + "/write.html");
});
// 함수안에 함수가 있는걸 callback function 이라고 한다.

// 어떤사람이 /add로 경로로 post요청을 하면 ....?? 을 해주세요
app.post("/add", (req, res) => {
  res.send("Submission Complete");
  console.log(req.body);
  console.log(req.body.todolist);
  console.log(req.body.duedate);
});
