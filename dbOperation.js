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
    });
  });
  });
}
  
function getHouseCorner (houseId) {
  //console.log("In getHouseCorner");
  return new Promise((resolve, reject) => {
    MongoClient.connect (dbPath, function (err, db) {
      if(err) reject(err);

      db.collection("community_house").find ({
        house_id: houseId
      }).toArray( (err, result) => {
        db.close();
        if (err) reject(err);
        if (result == 0) {
          reject("House sold out!");
        } else {
          var origin = '{"floorplan":{"corners":{"user' + houseId + 
                       '_c0" :{"x":' + result[0].corner[0].x + ',"y":' + result[0].corner[0].y + '},"user' + houseId + 
                       '_c1" :{"x":' + result[0].corner[1].x + ',"y":' + result[0].corner[1].y + '},"user' + houseId +
                       '_c2" :{"x":' + result[0].corner[2].x + ',"y":' + result[0].corner[2].y + '},"user' + houseId + 
                       '_c3" :{"x":' + result[0].corner[3].x + ',"y":' + result[0].corner[3].y + '}},"walls":[{"corner1":"user' + houseId +
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
        }
      });
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


module.exports = {
  getDesign: getDesign,
  saveDesign: saveDesign
};
