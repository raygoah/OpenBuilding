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

$('#login_form').submit(
    function(e) {
        e.preventDefault();
    }
)

$('#reg_form').submit(
    function(e) {
        e.preventDefault();
    }
)

$('#login_send').click(
    function() {
        $.ajax({
            method: "post",
            url: "/login",
            data: {
                account: $('#login_account').val(),
                pwd: $('#login_password').val()
            }, 
            success: function(data) {
                if(data['success'] == false) {
                    if(data['account'] == false) {
                        document.getElementById('login_account').style.backgroundColor = '#FFC1C1';
                        document.getElementById('login_password').style.backgroundColor = '#FFFFFF';
                    } else {
                        document.getElementById('login_account').style.backgroundColor = '#FFFFFF';
                        document.getElementById('login_password').style.backgroundColor = '#FFC1C1';
                    }
                } else {
                    document.getElementById('login_account').style.backgroundColor = '#FFFFFF';
                    document.getElementById('login_password').style.backgroundColor = '#FFFFFF';
                    $('#login_modal').modal('hide');
                    $('.logreg_btn').html(
                        "<p id=\"username\">Welcome, " + data['data'].nickname + "</p>" + 
                        "<button id=\"logout_btn\" class=\"ui grey button\">Logout<i class=\"icon right arrow\"></i></button>"
                    );
                }
            },
            error: function(data) {
                console.log("login error")
            }
        })
    }
)

$('#reg_send').click(
    function() {
        $.ajax({
            method: "post",
            url: "/register",
            data: {
                account: $('#reg_account').val(),
                pwd: $('#reg_password').val(),
                nickname: $('#reg_nickname').val(),
                email: $('#reg_email').val()
            },
            success: function(data) {
                console.log(data)
                if(data['success'] == false) {
                    if(data['account'] == false) {
                        document.getElementById('reg_account').style.backgroundColor = '#FFFFFF';
                        document.getElementById('reg_account').style.backgroundColor = '#FFC1C1';
                        document.getElementById('reg_email').style.backgroundColor = '#FFFFFF';
                    } else {
                        document.getElementById('reg_account').style.backgroundColor = '#FFFFFF';
                        document.getElementById('reg_email').style.backgroundColor = '#FFFFFF';
                        document.getElementById('reg_email').style.backgroundColor = '#FFC1C1';
                    }
                } else {
                    document.getElementById('reg_account').style.backgroundColor = '#FFFFFF';
                    document.getElementById('reg_email').style.backgroundColor = '#FFFFFF';
                    $('#reg_modal').modal('hide');
                }
            },
            error: function(data) {
                console.log("register error")
            }
        })
    }
)

$("a.create > img").hover(
    function() {
        $(this).attr("src", "./assets/image/create_btn_hover.png");
    },
    function() {
        $(this).attr("src", "./assets/image/create_btn.png");
    }
);

$("a.community > img").hover(
    function() {
        $(this).attr("src", "./assets/image/community_btn_hover.png");
    },
    function() {
        $(this).attr("src", "./assets/image/community_btn.png");
    }
);

$("a.search > img").hover(
    function() {
        $(this).attr("src", "./assets/image/search_btn_hover.png");
    },
    function() {
        $(this).attr("src", "./assets/image/search_btn.png");
    }
);

$("#login_btn").click(
    function() {
        $("#login_modal").modal('show');
    }
);

$("#register_btn").click(
    function() {
        $("#reg_modal").modal('show');
    }
);

$("#reg_link").click(
    function() {
        $("#reg_modal").modal('show');
    }
);
