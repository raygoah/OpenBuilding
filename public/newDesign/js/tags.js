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
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    //console.log(item.name);

    var html =  '<option value="' + 
                item.name + '">' +
                item.name +
                '</option>';

    itemSelect.append(html);
  }
});

$("#tag-context-submit").click(function(e) {
  e.preventDefault();
  var selected = $("#tag-input");
  var txtField = $("new-tag");

  var items = $.map(selected.val(), function(value, index) {
    return [value];
  });

  //console.log(items);
});
