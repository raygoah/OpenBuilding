window.onload = checkCookie();

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user=getCookie("account");
    if (user != "") {
    	// user login;
		var name = getCookie("nickname");
        $('.logreg_btn').html(
            "<div id=\"username\">" +
                "<p>Welcome " + name + "</p>" + 
                "<button id=\"logout_btn\" class=\"ui grey button\">" +
                    "Logout" +
                "</button>" +
            "</div>"
        );
        
        $("#logout_btn").click(
            function() {
               setCookie("account", "", "nickname", "", 30);
               checkCookie();
            }
        )
	} else {
        $('.logreg_btn').html(
            "<button id=\"login_btn\" class=\"ui grey button\">" +
                "<i class=\"icon user\"></i>Login" +
            "</button>" +
            "<button id=\"register_btn\" class=\"ui grey button\">" +
                "<i class=\"icon add user\"></i>Register" +
            "</button>"
        )

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
	}
}

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
					setCookie("account", data['data'].account, 30);
                    setCookie("nickname", data['data'].nickname, 30);
                    checkCookie();
                    document.getElementById('login_account').value = "";
                    document.getElementById('login_password').value = "";
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
					setCookie("account", $('#reg_account').val(), 30);
                    setCookie("nickname", $('#reg_nickname').val(), 30);
                    checkCookie();

                    document.getElementById('reg_account').value = "";
                    document.getElementById('reg_password').value = "";
                    document.getElementById('reg_nickname').value = "";
                    document.getElementById('reg_email').value = "";
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



$("#reg_link").click(
    function() {
        $("#reg_modal").modal('show');
    }
);
