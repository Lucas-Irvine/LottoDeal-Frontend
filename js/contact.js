
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
//End Facebook login code -----------------------------------

