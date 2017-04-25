// Facebook Login code -----------------------------------
window.fbAsyncInit = function() {
	FB.init({
		appId      : '228917890846081',
		xfbml      : true,
		cookie     : true,
		version    : 'v2.8'
	});

    // Check whether the user already logged in
    FB.getLoginStatus(function(response) {
    	if (response.status === 'connected') {
            //display user data
            document.getElementById('login').innerHTML = 'Logout';
            console.log('logged in')
            // Get and display the user profile data
        }
        else {
        	console.log('Not logged in');
            document.getElementById('login').innerHTML = 'Login';
        }
    });
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src="https://connect.facebook.net/en_US/all.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function showLoginPopup() {
	$('#loginPopup').modal({
  		keyboard: false
	})
};

var facebookLoginButton = document.getElementById("loginToFacebook");

// When the user clicks the button, open the modal 
facebookLoginButton.onclick = function() {
    console.log('logging in/out')
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {

            //display user data
            fbLogout()
            document.getElementById('loginTitle').innerHTML = 'Logout';
            document.getElementById('successScreen').innerHTML = 'Thanks for Logging Out';
            document.getElementById('login').innerHTML = 'Login';
        } else {
            fbLogin()
            document.getElementById('loginTitle').innerHTML = 'Login';
            document.getElementById('successScreen').innerHTML = 'Thanks for Logging In';
            document.getElementById('login').innerHTML = 'Logout';
        }
    });
}



function fbLogin() {
    var window = FB.login(function (response) {
        if (response.authResponse) {
            // Get and display the user profile data
            facebookLoginButton.setAttribute("onclick","fbLogout()");
            facebookLoginButton.innerHTML = 'Facebook Logout';
            console.log('Successfully logged in')
            getFbUserData();
        } else {
            document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
        }
    }, {scope: 'email'});
}

// Logout from facebook
function fbLogout() {
    //delete local storage
    delete localStorage.curUserID;

    FB.logout(function() {
        facebookLoginButton.setAttribute("onclick","fbLogin()");
        facebookLoginButton.innerHTML = 'Facebook Login';
        console.log('Successfully logged out')
    });
}

function getFbUserData(){
    FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture'},
        function (response) {
            localStorage.setItem("curUserID", response.id);
            // Save user data
            saveUserData(response);
        });
}

function saveUserData(response) {

      var url = "https://localhost:8000/createUser";

      data = {
        name: response.first_name+ ' ' + response.last_name,
        fbid: response.id,
        url: response.picture.data.url,
        email: response.email,
      }

      // AJAX POST TO SERVER
      $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function(data) {
        console.log(data)
        },
        error: function(response, error) {
        console.log(response)
        console.log(error)
        }
    });
}
//End Facebook login code -----------------------------------