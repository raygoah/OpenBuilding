function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
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
const user = getCookie("account");

// add items to the "tag items" tab

$(document).ready(function() {
  var items = [
   {
      "name" : "basement",
    }, 
    {
      "name" : "bathroom",
    }, 
    {
      "name" : "bedroom",
    }, 
    {
      "name" : "dining room",
    }, 
    {
      "name" : "kitchen",
    },
    {
      "name" : "living room",
    },
    {
      "name" : "storeroom",
    }
  ]

  var itemSelect = $("#tag-input")
  var itemList = $(".show_tags");

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    console.log(item.name);

    var html =  '<option value="' + 
                item.name + '">' +
                item.name +
                '</option>';

    itemSelect.append(html);
  }
});

/* Grab existed tags */
$(document).ready(function() {
  var tagList = $(".show_tag");
  $.ajax({
    method: "post",
    url: "/getTags",
    data: {
      account: user
    },
    success: function (data) {
      //show tags on web
      console.log(JSON.stringify(data));
      console.log(data.length);
      for (var i in data) {
        var html = '<button type="button" class="btn-info btn-xs tag-list">' +
                   '<span>' + data[i].tag + '</span>' +
                   '</button>';
        tagList.append(html);
      }
    }
  });
});

/* Submit new tags */
$("#tag-context-submit").click(function(e) {
  e.preventDefault();
  var selected = $("#tag-input");
  var txtField = $("#new-tag");
  var tagList = $(".show_tag");
  var items = [];
  
  // new tag list
  if (selected.val() != null) {
    items = $.map(selected.val(), function(value, index) {
      return [value];
    });
  } 
    
  if(txtField.val() != "") {
    items.push(txtField.val());
  }

  //console.log(items);
  $.ajax({
    method: "post",
    url: "/addTags",
    data: {
      account: user,
      tags: items
    },
    success: function (data) {
      //show tags on web
      for (var i in items) {
        var html = '<button type="button" class="btn-info btn-xs tag-list">' +
                   '<span>' + items[i] + '</span>' +
                   '</button>';
        tagList.append(html);
      }
      //console.log(data);
    }
  });
    
  txtField.val('');
  selected.selectpicker("deselectAll");
});

/* Delete tag */
$(document).ready(function() { 
  $(".show_tag").on( "click", ".tag-list", function() {
    var target = $(this);
    var item = [target.text()];
  
    $.ajax({
      method: "post",
      url: "/deleteTags",
      data: {
        account: user,
        tags: item
      },
      success: function (data) {
        //delete tag on web
        target.remove();
        console.log(data);
      }
    });
  });
});
