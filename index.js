const express = require("express");
const app = express();

const db = require("./db");
const cors = require("cors");
const { query } = require("express");

var jwt = require("jsonwebtoken");
app.use(
  express.urlencoded({
    extended: true,
  })
);
const PORT = 8000;
let bcrypt = require("bcryptjs");
app.use(cors());
app.use(express.json());

// Signup Api.........

app.post("/signup", async (req, res) => {
  if (!req.body.email) {
    return res.send({ msg: "Enter valid email!" });
  }
  let hash = bcrypt.hashSync(`${req.body.password}`, bcrypt.genSaltSync(10));
  db.query(
    "SELECT * FROM user WHERE email=?",
    [req.body.email],
    (err, result, fields) => {
      console.log(err, result);
      if (err) {
        return res.send({ msg: "Somthing went wrong try again later" });
      }
      if (result.length > 0) {
        return res.send({
          msg: "This email already exist please login or user another email id",
        });
      }
      if (!result.length) {
        db.query(
          "INSERT INTO `user` (`email`, `password`,`first_name`,`last_name`) VALUES (?,?,?,?)",
          [req.body.email, hash, req.body.first_name, req.body.last_name],
          (error, result) => {
            let token = jwt.sign({ user_info: req.body.password }, "mytoken");
            if (error)
              return res.send({ msg: "Somthing went wrong try again later" });
            return res.send({ msg: "Signup sucessfully!", token: token });
          }
        );
      }
    }
  );
});

// Login Api..............
app.post("/login", async (req, res) => {
  db.query(
    "SELECT * FROM user WHERE email=? ",
    [req.body.email],
    (error, result, fields) => {
      if (error) {
        return res.send({ msg: "credential error1" });
      } else {
        if (result.length > 0) {
          if (bcrypt.compareSync(req.body.password, result[0].password)) {
            let token = jwt.sign({ user_info: req.body.password }, "mytoken");
            return res.send({ msg: "login sucessfully!", token: token });
          } else {
            return res.send({ msg: "credential error" });
          }
        } else {
          return res.send({ msg: "credential error" });
        }
      }
    }
  );
});
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
