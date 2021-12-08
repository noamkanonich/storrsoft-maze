const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors")
const bodyParser = require("body-parser");

var port = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    port: 3306,
    password: 'storrsoft',
    database: 'mazeDB'
})

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var create_table = "CREATE TABLE IF NOT EXISTS scores (id INT AUTO_INCREMENT PRIMARY KEY, score INT NULL, unique_id CHAR(64) NULL, UNIQUE INDEX unique_id_UNIQUE (unique_id ASC) VISIBLE);"
    db.query(create_table, function (err, result) {
      if (err) console.log(err);
    });
});

app.get('/highScore', function(req, res){
    db.query(
        "SELECT MAX(score) as highScore FROM scores",
        (err, result) => {
            if(err) console.log(err)
            res.send(result[0])
        }
    )
})

app.get('/load/:userId', function(req, res){
    const unique_id = req.params.userId
    db.query(
        "SELECT score FROM scores WHERE unique_id = (?)",
        [unique_id],
        (err, result) => {
            if(err) console.log(err)
            res.send(result[0])
        }
    )
})

app.post('/save', function(req, res){
    const {score, unique_id} = req.body;
    db.query(
        "INSERT INTO scores (score, unique_id) VALUES (?,?)",
        [score, unique_id],
        (err, result) => {
            if(err) {
                console.log(err)
            } else {
                res.send("Score Saved!")
            }
        }
    )
})

app.put('/updateScore/:userId', function(req, res){
    const newScore = req.body.score;
    const userId = req.params.userId
    db.query(
        "SELECT score FROM scores WHERE unique_id = (?)",
        [userId],
        (err, result) => {
            if(err) {
                console.log(err)
            } else {
                if(newScore > result[0].score){
                    // update score
                    db.query("UPDATE scores SET score = (?) WHERE unique_id = (?)",
                    [newScore, userId],
                    (err, result) => {
                        if(err) console.log(err)
                        else console.log("UPDATE SUCCESSFULY!")
                    })
                }
            }
        }
    )
})

app.listen(port, () => {
    console.log("App is listening on port 3002")
})