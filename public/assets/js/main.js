$("#home_btn").click(
    function() {
        $.ajax({
            method: "get",
            url: "./home.html",
            success: function(data) {
                $('#main_page').transition('drop');
                setTimeout(function(){
                    $("#main_page").html(data);
                    $('#main_page').transition('drop');
                }, 300);
            },
            error: function(data) {
                console.log("get home page error")
            }
        })
        $(".item").removeClass('active')
        $(this).addClass('active')
    }
)

$("#about_btn").click(
    function() {
        $.ajax({
            method: "get",
            url: "./about.html",
            success: function(data) {
                $('#main_page').transition('drop');
                setTimeout(function(){
                    $("#main_page").html(data);
                    $('#main_page').transition('drop');
                }, 300);
            },
            error: function(data) {
                console.log("get home page error")
            }
        })
        $(".item").removeClass('active')
        $(this).addClass('active')
    }
)

