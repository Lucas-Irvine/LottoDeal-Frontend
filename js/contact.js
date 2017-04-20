
console.log('test')



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
            console.log('logged in')
            // Get and display the user profile data
            showLoginPopup();
        }
        else {
        	console.log('Not logged in');
        	showLoginPopup();
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

var btn = document.getElementById("loginToFacebook");

// When the user clicks the button, open the modal 
btn.onclick = function() {
	console.log('logging in/out')
	var window = FB.login(function (response) {
        if (response.authResponse) {
            // Get and display the user profile data
            btn.setAttribute("onclick","fbLogout()");
            btn.innerHTML = 'Facebook Logout';
            //getFbUserData();
            window.focus();
        } else {
            document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
        }
    }, {scope: 'email'});
}
//End Facebook login code -----------------------------------




