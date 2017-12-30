const MongoClient = require('mongodb').MongoClient
const secret = require('./secret.js')
var await = require('await')
const dbPath = secret.dbPath

function getHouseId (account) {
  //console.log("In getHouseId");
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbPath, (err, db) => {
      if (err) reject(err);

      db.collection("user").find ({
        account: account 
      }).toArray ((err, res) => {
        if (err) reject(err);
        else if(res[0].user_id > 18)
          reject("House sold out!");
        else {
          db.close();
          resolve(res[0].user_id);
        }
      });
    });
  });
}

function getHouse (houseId) {
  //console.log("In getHouse " + houseId);
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbPath, (err, db) => {
      if (err) throw err;
    
      db.collection("design_info").find ({
        design_id: houseId
      }).toArray((err, result) => {
        db.close();
        if (err) reject(err);
        if (result == 0) {
          /* no creation yet */
          resolve(getHouseCorner(houseId)); 
        } else {
          /* load current design */
          //console.log(result[0]);
          resolve(result[0].design);
        }
      });
    });
  });
}

function saveNewDesign (houseId, design) {
  return new Promise((resolve, reject) => {
    MongoClient.connect (dbPath, (err, db) => {
      if(err) reject(err);

      var date = new Date(); 
      db.collection("design_info").insertOne ({
        user_account: null,
        xy: null,
        design_id: houseId,
        tag: null,
        created_time: date.toJSON(),
        last_modified_time: date.toJSON(),
        rank: 0,
        design: JSON.stringify(design)
      }, (err1, res1) => {
        db.close();
        if(err1) reject(err1);
        else resolve("insert success");
      });
    });
  });
}

function saveDesign (account, design) {
  return new Promise((resolve, reject) => {
    getHouseId(account).then ((houseId) => {
    MongoClient.connect (dbPath, (err, db) => {
      if(err) reject(err);
 
      var date = new Date();
      db.collection("design_info").update({
        design_id: houseId },{
        $set: {
          last_modified_time: date.toJSON(),
          design: design
        }}, (err1, res) => {
          if (err1) reject(err1);
          else resolve();
      });
      db.close();
    });
  });
  });
}
  
function getHouseCorner (houseId) {
  //console.log("In getHouseCorner");
  return new Promise((resolve, reject) => {
		var origin = '{"floorplan":{"corners":{"user' + houseId + 
								 '_c0" :{"x":204.85099999999989,"y":289.052},"user' + houseId + 
			  				 '_c1" :{"x":672.2109999999999, "y":289.052},"user' + houseId +
								 '_c2" :{"x":672.2109999999999, "y":-178.308},"user' + houseId + 
								 '_c3" :{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"user' + houseId +
								 '_c3","corner2":"user' + houseId +
								 '_c0","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"user' + houseId + 
								 '_c0","corner2":"user' + houseId +
								 '_c1","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"user' + houseId +
								 '_c1","corner2":"user' + houseId + 
								 '_c2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"user' + houseId + 
								 '_c2","corner2":"user' + houseId + 
								 '_c3","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}';
		origin = JSON.parse(origin);

		saveNewDesign(houseId, origin). then((res) => {
			resolve(JSON.stringify(origin));
		}).catch((e) => {
			reject(e);
		});
	});
}

async function getDesign (account) {
  try {
    //console.log("In getDesign " + account);
    const houseId = await getHouseId(account);
    return await getHouse(houseId);

  } catch (err) {
    return err;
  }
} 

function getTag (account) {
  return new Promise((resolve, reject) => {
    var oldTag = [];

    getHouseId (account).then( (houseId) => {

      MongoClient.connect (dbPath, (err, db) => {
        if(err) reject(err);
       
        db.collection("design_info").find({
          design_id: houseId 
        }).toArray ((err, res) => {
          if (err) reject(err);
					else if (res[0] == null) 
						resolve();
          else if (res[0].tag != null ){
            //console.log(res[0].tag);
            oldTag = JSON.parse(res[0].tag);
          }
          db.close();
          resolve(oldTag);
        });
      });
    });
  });
}
 
function getNewTag (account, tags, opt) {
  return new Promise((resolve, reject) => {
    getTag(account).then( (oldTag) => {

      if (opt == 0) {
        //insert new tag to json array
        for (var i in tags) {
          var item = tags[i], flag = 0;
          // check if there is the same tag
          for (var j in oldTag) {
            if (oldTag[j].tag == item) {
              flag = 1;
              break;
            }
          }
          if (flag == 0) {
            oldTag.push ({
              "tag" : item
            });
          }
        };
      } else if (opt == 1) {
        // delete a tag
        for (var j in oldTag) {
          if (oldTag[j].tag == tags) {
            oldTag.splice(j, 1);
            break;
          }
        }
      };

      resolve(oldTag);
    });
  });
}
  
async function updateTag (account, tag, opt) {
  var tags, houseId;

  try{
    houseId = await getHouseId(account);
    tags = await getNewTag(account, tag, opt);
  } catch (e) {
    return e;
  }

  MongoClient.connect (dbPath, (err, db) => {
    if (err) reject(err);

    db.collection("design_info").update({
      design_id: houseId },{
      $set: {
        tag: JSON.stringify(tags)
      }}, (err1, res) => {
        if (err1) return(err1);
        else return;
      });
    db.close();
  });
}

module.exports = {
  getDesign: getDesign,
  saveDesign: saveDesign,
  getTag: getTag,
  updateTag: updateTag
};
