// Hello.
//
// This is The Scripts used for ___________ Theme
//
//
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
        document.getElementById('navbar').insertAdjacentHTML('beforeend', '<li><a id=\"logout_btn\">Logout</a></li>');

        $("#logout_btn").click(
            function() {
                var user=getCookie("account");
                if(user.length > 30) {
                    var auth2 = gapi.auth2.getAuthInstance();
                    auth2.signOut();
                }
                setCookie("account", "", "nickname", "", 30);
                checkCookie();
            }
        )
	} else {
        $("li a#logout_btn").remove();	
    }
}

function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
    $.ajax({
        method: "post",
        url: "/google_login",
        data: {
            id_token: profile.getId(),
            name: profile.getName(),
            email: profile.getEmail()
        },success: function(data) {
            if(data['success'] == true) {
                console.log("login success");
				setCookie("account", googleUser.getAuthResponse().id_token, 30);
                setCookie("nickname", profile.getName(), 30);
                checkCookie();
                $('#login_modal').modal('hide');
            }
        },error: function(data) {
            console.log("google login failed");
        }
    })
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	//console.log('Name: ' + profile.getName());
	//console.log('Image URL: ' + profile.getImageUrl());
	//console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

$("#create_btn").click(
    function() {
        var user=getCookie("account");
        if(user == "") {
            $("#login_modal").modal("show");
            document.getElementById('login_account').value = "";
            document.getElementById('login_account').value = "";
        }
        else
            window.open("./newDesign/index.html");
    }
)

$("#community_btn").click(
    function() { 
        window.open("./community/index.html");
    }
)

$("#login_send").click(
    function() {
        if($('#login_account').val() != "" && $('#login_password').val() != "") {
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
                        return false;
                    } else {
                        document.getElementById('login_account').style.backgroundColor = '#FFFFFF';
                        document.getElementById('login_password').style.backgroundColor = '#FFFFFF';
                        $('#login_modal').modal('hide');
                        setCookie("account", data['data'].account, 30);
                        setCookie("nickname", data['data'].nickname, 30);
                        checkCookie();
                        document.getElementById('login_account').value = "";
                        document.getElementById('login_password').value = "";
                        return true;
                    }
                },
                error: function(data) {
                    console.log("register error")
                    return false;
                }
            })
        }
    }
)

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

$('#reg_send').click(
    function(){
        if(!validateEmail($('#reg_email').val())) {
            document.getElementById('reg_email').style.backgroundColor = '#FFC1C1';
            return;
        }

        var reg_nickname = $( $.parseHTML($('#reg_nickname').val() )).text(); 
        var reg_account = $( $.parseHTML($('#reg_account').val() )).text(); 
        var reg_password = $( $.parseHTML($('#reg_password').val() )).text(); 

        if(reg_account != "" && reg_password != "" && reg_nickname != "" &&  $('#reg_email').val() != "") {
			$.ajax({
                method: "post",
                url: "/register",
                data: {
                    account: reg_account,
                    pwd: reg_password,
                    nickname: reg_nickname,
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
    }
)

$("#reg_link").click(
    function() {
        $("#login_modal").modal('hide');
        $("#reg_modal").modal('show');
    }
);


function main() {

(function () {
   'use strict';

   /* ==============================================
  	Testimonial Slider
  	=============================================== */ 

  	$('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });

    /*====================================
    Show Menu on Book
    ======================================*/
    $(window).bind('scroll', function() {
        var navHeight = $(window).height() - 100;
        if ($(window).scrollTop() > navHeight) {
            $('.navbar-default').addClass('on');
        } else {
            $('.navbar-default').removeClass('on');
        }
    });

    $('body').scrollspy({ 
        target: '.navbar-default',
        offset: 80
    })

  	$(document).ready(function() {
  	  $("#team").owlCarousel({
  	 
  	      navigation : false, // Show next and prev buttons
  	      slideSpeed : 300,
  	      paginationSpeed : 400,
  	      autoHeight : true,
  	      itemsCustom : [
				        [0, 1],
				        [450, 2],
				        [600, 2],
				        [700, 2],
				        [1000, 4],
				        [1200, 4],
				        [1400, 4],
				        [1600, 4]
				      ],
  	  });

  	  $("#clients").owlCarousel({
  	 
  	      navigation : false, // Show next and prev buttons
  	      slideSpeed : 300,
  	      paginationSpeed : 400,
  	      autoHeight : true,
  	      itemsCustom : [
				        [0, 1],
				        [450, 2],
				        [600, 2],
				        [700, 2],
				        [1000, 4],
				        [1200, 5],
				        [1400, 5],
				        [1600, 5]
				      ],
  	  });

      $("#testimonial").owlCarousel({
        navigation : false, // Show next and prev buttons
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true
        });

  	});

  	/*====================================
    Portfolio Isotope Filter
    ======================================*/
    $(window).load(function() {
        var $container = $('#lightbox');
        $container.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.cat a').click(function() {
            $('.cat .active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });

    });

    var time = 1,
    tl = new TimelineMax({
        repeat: -1,
        yoyo: false
    }),
    gons = $('.gon');
    tl.timeScale(30);
    function randy(min, max) {
        return Math.floor(Math.random() * (1 + max - min) + min);
    }
    for (var i = 0; i < gons.length; i++) {
        tl.set(gons[i], {
        x: randy((-400*(400/i))-300, (400*(400/i))+300),
        rotationY: randy(-400*(i/100), 400*(i/100)),
        rotationZ: randy(-400*(i/100), 400*(i/100)),
        y: randy((-400*(300/i))-300, (400*(300/i))+300),
        rotation: randy(-400*(i/100), 400*(i/100)),
        rotationX: randy(-400*(i/100), 400*(i/100)),
        opacity: 0
        });
    }
    for (var i = 0; i < gons.length; i++) {
        tl.to(gons[i], time*2 + 100, {
        rotationY: 0,
        rotationZ: 0,
        x: 0,
        opacity: 1,
        ease: Sine.easeInOut
        }, (i/5));
    }
    for (var i = 0; i < gons.length; i++) {
        tl.to(gons[i], time + 100, {
        rotation: 0,
        rotationX: 0,
        y: 0,
        ease: Sine.easeInOut
        }, (i/5));
    }
    for (var i = 0; i < gons.length; i++) {
        tl.to(gons[i], time + 100, {
        y: randy((-400*(i/200))-50, (400*(i/200))+50),
        rotation: randy(-400*(i/100), 400*(i/100)),
        rotationX: randy(-400*(i/100), 400*(i/100)),
        ease: Sine.easeInOut
        }, time + (gons.length/5) + (i/5)*2 + 100);
    }
    for (var i = 0; i < gons.length; i++) {
        tl.to(gons[i], time*2 + 100, {
        x: randy((-400*(i/50))-50, (400*(i/50))+50),
        rotationY: randy(-400*(i/100), 400*(i/100)),
        rotationZ: randy(-400*(i/100), 400*(i/100)),
        opacity: 0,
        ease: Sine.easeInOut
        }, (time * 2) + (gons.length/5) + (i/5)*2 + 100);
    }
}());


}
main();
