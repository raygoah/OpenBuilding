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
    if(account === "")
        res.send(404);
    else {
    Design.getDesign(account).then((design) => {
        if (design === "House sold out!" || design === "Please Login First!") {
            res.send({
                success: false,
                file: design
            })
        } else {
            res.send({
                success: true,
                file: JSON.parse(design)
            })
        }
    });
    }
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

app.post("/getTags", function (req, res) {
  var account = req.body['account'];
  Design.getTag(account).then((result) => {
    res.send(result);
  }).catch((e) => {
    res.send("Fail!");
  });
})

app.post("/addTags", function (req, res) {
  var account = req.body['account'];
  var tags = req.body['tags'];
  Design.updateTag(account, tags, 0).then((result) => {
    res.send("success!");
  }).catch((e) => {
    res.send("Fail!");
  });
})

app.post("/deleteTags", function (req, res) {
  var account = req.body['account'];
  var tags = req.body['tags'];
  Design.updateTag(account, tags, 1).then((result) => {
    res.send("success!");
  }).catch((e) => {
    res.send("remove Fail!");
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
                var communityX = JSON.parse(result1[0].communityX);
                var communityY = JSON.parse(result1[0].communityY);
                var house_count = JSON.parse(result1[0].house_count);
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

                            for (i = 0; i < result2.length; ++i) {
                                
                                var design = JSON.parse(result2[i].design);
                                var user_name
                                
                                var minX = 99999999
                                var minY = 99999999
                                var maxX = -99999999
                                var maxY = -99999999
                                
                                for (j in design.floorplan.corners) {
                                    user_name = j.split("_")[0]
                                }

                                for (j in Group_obj.floorplan.corners) {
                                    if (j.split("_")[0] == user_name)
                                        delete Group_obj.floorplan.corners[j]
                                }

                                for(j = 0;; j++) {
                                    if (j == Group_obj.floorplan.walls.length)
                                        break
                                    if (Group_obj.floorplan.walls[j].corner1.split("_")[0] == user_name) {
                                        var deletedWall = Group_obj.floorplan.walls.splice(j, 1)
                                        j--
                                    }
                                }

                                if (design.items.length > 0)
                                    user_name = design.items[0].item_name.split("_")[0]
                                for (j = 0;; j++) {
                                    if (j == Group_obj.items.length)
                                        break
                                    if (Group_obj.items[j].item_name.split("_")[0] == user_name) {
                                        var deletedItem = Group_obj.items.splice(j, 1)
                                        j--
                                    }
                                }

                                // Calculate house min rect
                                for (j in design.floorplan.corners) {
                                    if (design.floorplan.corners[j].x < minX)
                                        minX = design.floorplan.corners[j].x
                                    if (design.floorplan.corners[j].y < minY)
                                        minY = design.floorplan.corners[j].y
                                    if (design.floorplan.corners[j].x > maxX)
                                        maxX = design.floorplan.corners[j].x
                                    if (design.floorplan.corners[j].y > maxY)
                                        maxY = design.floorplan.corners[j].y
                                }
                                
                                var rangeX = minX - communityX
                                var rangeY = minY - communityY
                               
                                // Add corners
                                for (j in design.floorplan.corners) {
                                    Group_obj.floorplan.corners[j] = {"x": design.floorplan.corners[j].x - rangeX, "y": design.floorplan.corners[j].y - rangeY}
                                }
                                
                                // Add walls
                                for (j = 0; j < design.floorplan.walls.length; j++) {
                                    Group_obj.floorplan.walls.push(design.floorplan.walls[j])
                                }

                                // Add items
                                for (j = 0; j < design.items.length; ++j) {
                                    design.items[j].xpos = design.items[j].xpos - rangeX
                                    design.items[j].zpos = design.items[j].zpos - rangeY
                                }
                                for (j = 0; j < design.items.length; ++j) {
                                    Group_obj.items.push(design.items[j]);
                                }

                                communityX = communityX + (maxX - minX)
                                house_count++
                                if (house_count % 9 == 0) {
                                    communityY = communityY + 600 + (maxY - minY)
                                    communityX = 0

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
                            
                            var set_xy = {$set:{communityX: communityX, communityY: communityY, house_count: house_count}};
                            
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
                                
                                db3.collection("community_info").updateOne(//更新料庫中community_info的corner info
                                    myquery,
                                    set_xy,
                                    function(err8, result5){
                                        if (err8) throw err8;
                                        console.log("corner info update");
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
                return new Promise(function(resolve, reject) {
                    resolve(-1);
                });
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
            if(user_id == -1) {
                return new Promise(function(resolve, reject) {
                    resolve(-1);
                });
            } else {
                return new Promise(function(resolve, reject) {
                    db.collection("user").find({
                        email: email
                    }).toArray(function(err, result) {
                        resolve(result);
                    });
                });
            }
        }).then(function(result) {
            db.close();
            if(result == -1) {
            } else if(result != 0) {
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

app.post('/google_login', function(req, res) {
    var id_token = req.body['id_token'];
    var nickname = req.body['name'];
    var email = req.body['email'];
    var user_id;

    MongoClient.connect(dbPath, function(err, db) {
        var promise = new Promise(function(resolve, reject) {
            db.collection("user").find({
                account: id_token
            }).toArray(function(err, result) {
                if(err) reject(err);
                resolve(result);
            });
        });
    
        promise.then(function(result) {
            if(result == 0) {
                //register
                return new Promise(function(resolve, reject) {
                    db.collection("user").find({
                    }).toArray(function(err, result) {
                        user_id = result.length + 1;
                        resolve(user_id);
                    });
                });
            } else {
                return new Promise(function(resolve, reject) {
                    resolve(0);
                });
            }
        }).then(function(result) {
            if(result != 0) {
                user_id = result;
                return new Promise(function(resolve, reject) {
                    db.close();
                    MongoClient.connect(dbPath, function(err, db) {
                        db.collection("user").insertOne({
                            account: id_token,
                            nickname: nickname,
                            email: email,
                            user_id: user_id
                        }, function(err, result1) {
                            if(err) reject(err);
                        });
                    });
                });
            }
            res.send({
                success: true
            });
        }).catch(function(err) {
            console.log(err);
        });
    });
});
