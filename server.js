const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express()
const port = 4456
const MongoClient = require('mongodb').MongoClient;
const dbPath = "mongodb://wp2017_groupb:openbuilding2017@luffy.ee.ncku.edu.tw:27017/wp2017_groupb";

app.listen(port)
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
    extended: true
}));
/*
function _getCommunity (callback) {
  console.log("getcommunity");
  MongoClient.connect(dbPath, function(err, db){
  db.collection("community_info").find({//取得社區資料
		community_id: 1
	}).toArray(function(err, result) {
		if(err) throw err;
		if(result != 0) {
			var c_file = result[0].community_file;
			var c_date = result[0].update_time;
      console.log("aaa           "+c_file);
      console.log("bbb           "+c_date);
			return callback(c_file, c_date);
		}
	});
  })
}

app.post('/renew',function(req, res){
  //MongoClient.connect(dbPath, function(err, db){  
  //if (err) throw err;
  var n = 0;
  var c_date;
  var c_file; 
  console.log("step 1");
//  var result = db.collection("community_info").find({
//    community_id: 1
//  }).toArray();
  
  
//  function(err, result){
//    if (err) throw err;      
//      c_date=result[0].update_time;
//      c_file=result[0].community_file;
//    })

	_getCommunity(function(file, date) {
			c_file = file;
			c_date = date;
	})
  function myFunc(arg) {
    console.log("ccc     "+c_file);
    console.log("ddd     "+c_date);

  }

  setTimeout(myFunc, 3000, 'funky');

  //console.log("ccc     "+c_file);
  //console.log("ddd     "+c_date);
  MongoClient.connect(dbPath, function(err, db){
  if (err) throw err;
  //console.log(result[0].update_time);
  //c_file=JSON.parse(result[0].community_file);
  //c_date=result[0].update_time;
  var Group_obj = JSON.parse(c_file);
  console.log(Group_obj);
  var obj;
  console.log("step 2");
  db.collection("design_info").find({//取得須更新資料                                                                                              
    last_modified_time: {$gte: c_date}//搜尋日期在c_date後的
  }).toArray(function(err,result){
    if (err) throw err;                                                                                                                                                                                                                       
    if (result==0){//不需要更新社區時     
      var now_date = new Date();                                                                                                                            
      now_date = now_date.toJSON();                                                                                                                                    
      res.send({                                                                                                             
        file: c_file,                                                                                                                                                      
        date: now_date                                                                                                                                                            
      })                                                                                                                                                                          
    }                                                                                                                                                                                
    else {//需要更新社區時                                                                                                                                                                                    
      n = 1;
      console.log("step 3");
      for (i=0;i<result.length;++i){                                                                                                                                                                                                    
        for (j=0;j<result[i].items.length;++j){                                                                                                                                                                                                                      
          Group_obj.items.push(result[i].items[j]);
        }                                                                                                                                                                                                                                        
      }
      var now_date = new Date();
      now_date = now_date.toJSON();
      res.send({
        file: Group_obj,
        date: now_date
      })
    }
  });
    var myquery = {id:1};
    var newvalue = {$set:{community_file: Group_obj}};
    var time = new Date();
    time = time.toJSON();
    var newvalue1 = {$set:{update_time: time}};
  if (n == 1){
      db.collection("community_info").updateOne({//更新資料庫中community_info的community_file
          myquery,
          newvalue,
          function(err, res){
            if (err) throw err;
            console.log("community file update");       
          }       
      });

      db.collection("community_info").updateOne({//更新料庫中community_info的update_time
          myquery,
          newvalue1,
          function(err, res){
            if (err) throw err;
            console.log("community time update");       
          }
      });
  }

  db.close();
  });//Mongo

});//app.post
*/
app.post('/renew',function(req, res){
	MongoClient.connect(dbPath, function(err, db){
		if (err) throw err;
		var n = 0;
		var c_date;
		var c_file;	
		db.collection("community_info").find({//取得社區資料
				community_id: 1
		}).toArray(function(err, result){
			if (err) throw err;			
			if (result!=0)
			{
				c_date=result[0].update_time;//community's renew date
				c_file=result[0].community_file;//community's file info
				var Group_obj = JSON.parse(c_file);
				var obj;
       MongoClient.connect(dbPath, function(erra, db3){
       if (erra) throw erra;
				db3.collection("design_info").find({//取得須更新資料
					last_modified_time: {$gte: c_date}//搜尋日期在c_date後的
				}).toArray(function(err1,result1){
					if (err1) throw err1;

					if (result1==0){//不需要更新社區時
						var now_date = new Date();
						now_date = now_date.toJSON();
						res.send({
							file: Group_obj							
						})
					}
					else {//需要更新社區時
						n = 1;
            //console.log("gggggg")
            //console.log(result1.length);
            var len=result1.length;
						for (i=0;i<len;++i){
            //console.log(result1[0].design.items);
            var design_item = JSON.parse(result1[i].design);
							for (j=0;j<design_item.items.length;++j){
								Group_obj.items.push(design_item.items[j]);
							}
						}
            //console.log("g8");
						var now_date = new Date();
						now_date = now_date.toJSON();
						res.send({
							file: Group_obj,
						})
                var answer = JSON.stringify(Group_obj);
								var myquery = {community_id:1};
								var newvalue = {$set:{community_file: answer}};
								var time = new Date();
								time = time.toJSON();
								var newvalue1 = {$set:{update_time: time}};
                MongoClient.connect(dbPath, function(err3, db1){                
                if (err3) throw err3;
								if (n == 1){
									db1.collection("community_info").updateOne(//更新資料庫中community_info的community_file
										myquery,
										newvalue1,
										function(err4, res7){
											if (err4) throw err4;
											console.log("community file update");				
										}

									);
									db1.collection("community_info").updateOne(//更新料庫中community_info的update_time
										myquery,
										newvalue1,
										function(err5, res8){
											if (err5) throw err5;
											console.log("community time update");				
										}

									);
								}
                db1.close();
                })
					}
				});
        });
			}
		});
		db.close();
	});//Mongo
});//app.post

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
