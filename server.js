const express = require('express')
const https = require('https')
const fs = require('fs')
const secret = require('./secret.js') /* ssl and DB info */
const Design = require('./dbOperation.js')
const bodyParser = require('body-parser')
const await = require('await')
const app = express()
const port = 8181 
const MongoClient = require('mongodb').MongoClient;
const dbPath = secret.dbPath;

/* https setting */
const credential = {ca: secret.CA, key: secret.privateKey, cert: secret.certificate}

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
    extended: true
}));

httpsServer = https.createServer(credential, app)
httpsServer.listen(port, function () {
  console.log('listening on port 8181')
})

app.post("/newDesign", function (req, res) {
  var account = req.body['account'];
  Design.getDesign(account).then((design) => {
    res.send({
      file: JSON.parse(design)
    })
  });
})

app.post("/updateDesign", function (req, res) {
  var account = req.body['account'];
  var design = req.body['design'];
  Design.saveDesign(account, design).then((result) => {
    res.send("Success!");
  }).catch((e) => {
    res.send("Fail!");
  });
})

app.post('/renew',function(req, res){
    MongoClient.connect(dbPath, function(err1, db1) {
        if (err1) throw err1;
        db1.collection("community_info").find({//取得社區資料
            community_id: 1
        }).toArray(function(err2, result1){
            if (err2) throw err2
            if (result1 != 0) {
                var c_date=result1[0].update_time;//community's renew date
                var c_file=result1[0].community_file;//community's file info
                var Group_obj = JSON.parse(c_file);

                MongoClient.connect(dbPath, function(err3, db2) {
                    if (err3) throw err3;
                    db2.collection("design_info").find({//取得須更新資料
                        last_modified_time: {$gte: c_date}//搜尋日期在c_date後的
                    }).toArray(function(err4,result2){
                        if (err4) throw err4;
                        if (result2 == 0) {//不需要更新社區時
                            res.send({
                                file: Group_obj							
                            })
                        } else {//需要更新社區時

                            var corner_is_in = false
                            var wall_is_in = false

                            for (i = 0; i < result2.length; ++i) {
                                var design = JSON.parse(result2[i].design);
                                for (j = 0; j < design.items.length; ++j) {
                                    Group_obj.items.push(design.items[j]);
                                }

                                for (j in design.floorplan.corners) {
                                    corner_is_in = false
                                    for (k in Group_obj.floorplan.corners)
                                        if (j == k)
                                            corner_is_in = true
                                    if (!corner_is_in)
                                        Group_obj.floorplan.corners[j] = {"x":design.floorplan.corners[j].x, "y": design.floorplan.corners[j].y}
                                }

                                for (j = 0; j < design.floorplan.walls.length; j++) {
                                    wall_is_in = false
                                    for (k = 0; k < Group_obj.floorplan.walls.length; k++)
                                        if (design.floorplan.walls[j].corner1 == Group_obj.floorplan.walls[k].corner1)
                                            if (design.floorplan.walls[j].corner2 == Group_obj.floorplan.walls[k].corner2)
                                                wall_is_in = true
                                    if (!wall_is_in)
                                        Group_obj.floorplan.walls.push(design.floorplan.walls[j])
                                }
                            }

                            res.send({
                                file: Group_obj
                            })
                            var answer = JSON.stringify(Group_obj);
                            var myquery = {community_id:1};
                            var set_community = {$set:{community_file: answer}};
                            var time = new Date();
                            time = time.toJSON();
                            var set_time = {$set:{update_time: time}};
                            MongoClient.connect(dbPath, function(err5, db3) {
                                if (err5) throw err5;
                                db3.collection("community_info").updateOne(//更新資料庫中community_info的community_file
                                    myquery,
                                    set_community,
                                    function(err6, result3) {
                                        if (err6) throw err6;
                                        console.log("community file update");
                                    }
                                );

                                db3.collection("community_info").updateOne(//更新料庫中community_info的update_time
                                    myquery,
                                    set_time,
                                    function(err7, result4){
                                        if (err7) throw err7;
                                        console.log("community time update");
                                    }
                                )
                                
                                db3.close()
                            })//db3 connect
                        }
                    })
                    db2.close()
                })//db2 connect
            }
        })
        db1.close();
    })//db1 connect
})//app.post

app.post('/login', function(req, res) {
    var account = req.body['account'];
    var pwd = req.body['pwd'];
    
    MongoClient.connect(dbPath, function (err, db) {
   		var promise = new Promise(function(resolve, reject) {
            db.collection("user").find({
            account: account
            }).toArray(function(err, result) {
                if(err) reject(err);
                else resolve(result);
            });
        });
        promise.then(function(result) {
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
  		}).catch(function(err) {
            throw err;
        });
	});
})

app.post('/register', function(req, res) {
    var account = req.body['account'];
    var pwd = req.body['pwd'];
    var nickname = req.body['nickname'];
    var email = req.body['email'];
    var user_id;

    MongoClient.connect(dbPath, function (err, db) {
        if(err) throw err;
        
        var promise = new Promise(function(resolve, reject) {
            db.collection("user").find({
                account: account
            }).toArray(function(err, result) {
                if(err) reject(err);
                else resolve(result);
            });
        });
        
        promise.then(function(result) {
            if(result != 0) {
                res.send({
                    success: false,
                    account: false
                })
                db.close();
            } else {
                return new Promise(function(resolve, reject) {
                    db.collection("user").find({
                    }).toArray(function(err, result) {
                        user_id = result.length + 1;
                        resolve(user_id);
                    });
                });
            }
        }).then(function(user_id) {
            return new Promise(function(resolve, reject) {
                db.collection("user").find({
                    email: email
                }).toArray(function(err, result) {
                    resolve(result);
                });
            });
        }).then(function(result) {
            db.close();
            if(result != 0) {
                res.send({
                    success: false,
                    account: true,
                    email: false
                })
            } else {
                MongoClient.connect(dbPath, function (err, db) {
                    db.collection("user").insertOne({
  	                    account: account,
                        password: pwd,
                        email: email,
                        nickname: nickname,
                        user_id: user_id
                    }, function(err1, res1) {
                        res.send({
                            success: true
                        })
                    });
                    db.close();
	            });
            }
        }).catch(function(err) {
            console.log(err);
        });
	});
});
