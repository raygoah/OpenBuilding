function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca  = decodedCookie.split(';');
  for(var i = 0; i < ca.length; ++i) {
    var c = ca[i];
    while(c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// add items to the "Add Items" tab

$(document).ready(function() {
  var user = getCookie("account");
  console.log(user);
  var items = [
   {
      "name" : user + "_Closed Door",
      "image" : "models/thumbnails/thumbnail_Screen_Shot_2014-10-27_at_8.04.12_PM.png",
      "model" : "models/js/closed-door28x80_baked.js",
      "type" : "7"
    }, 
    {
      "name" : user + "_Open Door",
      "image" : "models/thumbnails/thumbnail_Screen_Shot_2014-10-27_at_8.22.46_PM.png",
      "model" : "models/js/open_door.js",
      "type" : "7"
    }, 
    {
      "name" : user + "_Window",
      "image" : "models/thumbnails/thumbnail_window.png",
      "model" : "models/js/whitewindow.js",
      "type" : "3"
    }, 
    {
      "name" : user + "_Chair",
      "image" : "models/thumbnails/thumbnail_Church-Chair-oak-white_1024x1024.jpg",
      "model" : "models/js/gus-churchchair-whiteoak.js",
      "type" : "1"
    }, 
    {
      "name" : user + "_Red Chair",
      "image" : "models/thumbnails/thumbnail_tn-orange.png",
      "model" : "models/js/ik-ekero-orange_baked.js",
      "type" : "1"
    },
    {
      "name" : user + "_Blue Chair",
      "image" : "models/thumbnails/thumbnail_ekero-blue3.png",
      "model" : "models/js/ik-ekero-blue_baked.js",
      "type" : "1"
    },
    {
      "name" : user + "_Dresser - Dark Wood",
      "image" : "models/thumbnails/thumbnail_matera_dresser_5.png",
      "model" : "models/js/DWR_MATERA_DRESSER2.js",
      "type" : "1"
    }, 
    {
      "name" : user + "_Dresser - White",
      "image" : "models/thumbnails/thumbnail_img25o.jpg",
      "model" : "models/js/we-narrow6white_baked.js",
      "type" : "1"
    },  
    {
      "name" : user + "_Bedside table - Shale",
      "image" : "models/thumbnails/thumbnail_Blu-Dot-Shale-Bedside-Table.jpg",
      "model" : "models/js/bd-shalebedside-smoke_baked.js",
      "type" : "1"
    }, 
    {
      "name" : user + "_Bedside table - White",
      "image" : "models/thumbnails/thumbnail_arch-white-oval-nightstand.jpg",
      "model" : "models/js/cb-archnight-white_baked.js",
      "type" : "1"
    }, 
    {
      "name" : user + "_Wardrobe - White",
      "image" : "models/thumbnails/thumbnail_TN-ikea-kvikine.png",
      "model" : "models/js/ik-kivine_baked.js",
      "type" : "1"
    }, 
    {
      "name" : user + "_Full Bed",
      "image" : "models/thumbnails/thumbnail_nordli-bed-frame__0159270_PE315708_S4.JPG",
      "model" : "models/js/ik_nordli_full.js",
      "type" : "1"
    }, 
    {
      "name" : user + "_Bookshelf",
      "image" : "models/thumbnails/thumbnail_kendall-walnut-bookcase.jpg",
      "model" : "models/js/cb-kendallbookcasewalnut_baked.js",
      "type" : "1"
    }, 
        {
      "name" : user + "_Media Console - White",
      "image" : "models/thumbnails/thumbnail_clapboard-white-60-media-console-1.jpg",
      "model" : "models/js/cb-clapboard_baked.js",
      "type" : "1"
    }, 
    /*
        {
      "name" : user + "_Media Console - Black",
      "image" : "models/thumbnails/thumbnail_moore-60-media-console-1.jpg",
      "model" : "models/js/cb-moore_baked.js",
      "type" : "1"
    },*/ 
    /*   {
      "name" : user + "_Sectional - Olive",
      "image" : "models/thumbnails/thumbnail_img21o.jpg",
      "model" : "models/js/we-crosby2piece-greenbaked.js",
      "type" : "1"
    },*/ 
    {
      "name" : user + "_Sofa - Grey",
      "image" : "models/thumbnails/thumbnail_rochelle-sofa-3.jpg",
      "model" : "models/js/cb-rochelle-gray_baked.js",
      "type" : "1"
    }, 
        {
      "name" : user + "_Wooden Trunk",
      "image" : "models/thumbnails/thumbnail_teca-storage-trunk.jpg",
      "model" : "models/js/cb-tecs_baked.js",
      "type" : "1"
    }, 
        {
      "name" : user + "_Floor Lamp",
      "image" : "models/thumbnails/thumbnail_ore-white.png",
      "model" : "models/js/ore-3legged-white_baked.js",
      "type" : "1"
    },
    {
      "name" : user + "_Coffee Table - Wood",
      "image" : "models/thumbnails/thumbnail_stockholm-coffee-table__0181245_PE332924_S4.JPG",
      "model" : "models/js/ik-stockholmcoffee-brown.js",
      "type" : "1"
    }, 
    {
      "name" : user + "_Side Table",
      "image" : "models/thumbnails/thumbnail_Screen_Shot_2014-02-21_at_1.24.58_PM.png",
      "model" : "models/js/GUSossingtonendtable.js",
      "type" : "1"
    }, 
    {
      "name" : user + "_Dining Table",
      "image" : "models/thumbnails/thumbnail_scholar-dining-table.jpg",
      "model" : "models/js/cb-scholartable_baked.js",
      "type" : "1"
    }, 
    /*
    {
      "name" : user + "_Dining table",
      "image" : "models/thumbnails/thumbnail_Screen_Shot_2014-01-28_at_6.49.33_PM.png",
      "model" : "models/js/BlakeAvenuejoshuatreecheftable.js",
      "type" : "1"
    },*/
    {
      "name" : user + "_Blue Rug",
      "image" : "models/thumbnails/thumbnail_cb-blue-block60x96.png",
      "model" : "models/js/cb-blue-block-60x96.js",
      "type" : "8"
    },
    {
      "name" : user + "_NYC Poster",
      "image" : "models/thumbnails/thumbnail_nyc2.jpg",
      "model" : "models/js/nyc-poster2.js",
      "type" : "2"
    }
   /*     
   {
      "name" : "",
      "image" : "",
      "model" : "",
      "type" : "1"
    }, 
    */
  ]



  var itemsDiv = $("#items-wrapper")
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var index = item.name.indexOf("_") + 1;
    //console.log(item.name);
    var html =  '<a class="thumbnail add-item" model-name="' + 
                item.name + 
                '" model-url="' +
                item.model +
                '" model-type="' +
                item.type + 
                '"><img src="' +
                item.image + 
                '" alt="Add Item"> '+
                item.name.slice(index) +
                '</a>';
    itemsDiv.append(html);
  }
});
