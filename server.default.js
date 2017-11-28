const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express()
const port = 8181
const MongoClient = require('mongodb').MongoClient;
const dbPath = "mongodb://your_db_account:your_db_pwd@your_db_ip:27017/your_db_name";

app.listen(port)
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/login', function(req, res) {
    var account = req.body['account'];
    var pwd = req.body['pwd'];
    
    MongoClient.connect(dbPath, function (err, db) {
        if(err) throw err;
   		db.collection("user").find({
           account: account
        }).toArray(function(err, result) {
    		if (err) throw err;
            if(result == 0) {
                res.send({
                    success: false,
                    account: false,
                    password: false
                })
            } else {
                if(result[0].password == pwd) {
                    res.send({
                        success: true,
                        data: result[0]
                    })
                } else {
                    res.send({
                        success: false,
                        account: true,
                        password: false
                    })
                }
            }
            db.close();
  		});
	});
})

app.post('/register', function(req, res) {
    var account = req.body['account'];
    var pwd = req.body['pwd'];
    var nickname = req.body['nickname'];
    var email = req.body['email'];

    MongoClient.connect(dbPath, function (err, db) {
        if(err) throw err;
   		
        db.collection("user").find({
           account: account
        }).toArray(function(err, result) {
            if(err) throw err;
            if(result != 0) {
                res.send({
                    success: false,
                    account: false
                })
                db.close();
            } else {
                db.collection("user").find({
                    email: email
                }).toArray(function(err1, result1) {
                    if(err1) throw err1
                    if(result1 != 0) {
                        res.send({
                            success: false,
                            account: true,
                            email: false
                        })
                        db.close();
                    } else {
                        db.close();
                        MongoClient.connect(dbPath, function (err1, db1) {
                            if(err1) throw err1;
   	                        db1.collection("user").insertOne({
  	                            account: account,
                                password: pwd,
                                email: email,
                                nickname: nickname
                            }, function(err2, res1) {
                                if(err2) throw err2
                                else {
                                    res.send({
                                        success: true
                                    })
                                }
                            });
                            db1.close();
	                    });
                    }
                });
            }
  		});
	});
});
