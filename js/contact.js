function sendEmail() {
// 	var postmark = require("postmark");
// // Example request
// var client = new postmark.Client("27c10544-6caa-46b9-8640-67b000036be3");

// client.sendEmail({
// 	"From": "dwhyte@princeton.edu",
// 	"To": "dwhyte@princeton.edu",
// 	"Subject": "Test", 
// 	"TextBody": "Hello from Postmark!"
// });	
console.log('testemail')
emailjs.send("lotto_deal", "sample_template", {"email":"dwhyte@princeton.edu"})
}

console.log('test')

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
            getFbUserData();

            // Get and display the user profile data
            document.getElementById('fbLink').setAttribute("onclick","fbLogout()");
            document.getElementById('fbLink').innerHTML = 'Facebook Logout';
        }
        else {
            console.log('Not logged in');
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

