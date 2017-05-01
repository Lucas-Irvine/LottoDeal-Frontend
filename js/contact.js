var userID;
console.log(userID + "saving UserID as a global variable")





var app = angular.module("app", []);


var scope;


app.controller("contactController", ["$scope", "$http", "$location",  function($scope, $http, $location) {

    console.log("got here")
    scope = $scope;




    $scope.notificationLength = 0;






    scope.getNotifications = function(userID) {
// AJAX POST TO SERVER
    var notificationUrl = "https://localhost:8000/getNotifications";
    //var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for notifications')
    $.ajax({
        url: notificationUrl,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var notifications = JSON.parse(data)

            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            var curDate = new Date();

            for (i = 0; i < notifications.length; i++) {

                var date = new Date(notifications[i].datePosted);

                var hoursAgo = Math.abs(DateDiff.inHours(curDate, date));

                if (hoursAgo < 24) {
                    if (hoursAgo == 0) {
                        notifications[i].datePosted = "Just Now";
                    }
                    else if (hoursAgo == 1) {
                        notifications[i].datePosted = hoursAgo + " hour ago";
                    }
                    else {
                        notifications[i].datePosted = hoursAgo + " hours ago";
                        console.log(notifications[i].datePosted);
                    }
                }

                else {
                    var month = date.getMonth();
                    var day = date.getDate();

                    /* code taken from http://stackoverflow.com/questions/8888491/
                     how-do-you-display-javascript-datetime-in-12-hour-am-pm-format */

                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? '0'+ minutes : minutes;
                    var strTime = hours + ':' + minutes + ' ' + ampm;

                    /* --------- */

                    var newDate = monthNames[month] + " " + day + " at " + strTime;
                    notifications[i].datePosted = monthNames[month] + " " + day + " at " + strTime;
                    console.log(newDate);
                }
                if (!notifications[i].read) {
                    $scope.notificationLength++;
                }
            }

            $scope.notifications = notifications;
            console.log($scope.notifications)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

}

	// mark all the notifications as read
	scope.markRead = function() {
		// AJAX POST TO SERVER
	    var readurl = "https://localhost:8000/markRead";
	    //var userID = localStorage.getItem("curUserID")
	    var data = {
	        userID: userID
	    }
	    console.log('Asking for notifications')
	    $.ajax({
	        url: readurl,
	        data: data,
	        type: 'GET',
	        success: function(data) {
	            var notifications = JSON.parse(data)
	            $scope.notificationLength = 0;

                var monthNames = [
                    "January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"
                ];

                var curDate = new Date();

                for (i = 0; i < notifications.length; i++) {

                    var date = new Date(notifications[i].datePosted);

                    var hoursAgo = Math.abs(DateDiff.inHours(curDate, date));

                    if (hoursAgo < 24) {
                        if (hoursAgo == 0) {
                            notifications[i].datePosted = "Under an hour ago";
                        }
                        else if (hoursAgo == 1) {
                            notifications[i].datePosted = hoursAgo + " hour ago";
                        }
                        else {
                            notifications[i].datePosted = hoursAgo + " hours ago";
                            console.log(notifications[i].datePosted);
                        }
                    }

                    else {
                        var month = date.getMonth();
                        var day = date.getDate();

                        /* code taken from http://stackoverflow.com/questions/8888491/
                         how-do-you-display-javascript-datetime-in-12-hour-am-pm-format */

                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var ampm = hours >= 12 ? 'pm' : 'am';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        minutes = minutes < 10 ? '0'+ minutes : minutes;
                        var strTime = hours + ':' + minutes + ' ' + ampm;

                        /* --------- */

                        var newDate = monthNames[month] + " " + day + " at " + strTime;
                        notifications[i].datePosted = monthNames[month] + " " + day + " at " + strTime;
                        console.log(newDate);
                    }
                }

	            $scope.notifications = notifications;
	            console.log($scope.notifications)
	            console.log("updated the notifications")
	            $scope.$apply()
	        },
	        error: function(response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	
}])

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
            document.getElementById('successScreen').innerHTML = "";
            document.getElementById('login').innerHTML = 'Logout';
            facebookLoginButton.innerHTML = "Sign Out With Facebook";
            $("#signInMessage").hide();


     FB.api('/me', {locale: 'en_US', fields: 'id'},
        function (response) {
            //localStorage.setItem("curUserID", response.id);
            userID = response.id;
            $("#userid").val(userID)
            scope.getNotifications(userID);
            console.log(userID + "saving UserID as a global variable")
        });

            //saveUserID();
            console.log('logged in')
            // Get and display the user profile data
        }
        else {
            userID = undefined;
            console.log('Not logged in');
            document.getElementById('successScreen').innerHTML = "";
            document.getElementById('login').innerHTML = 'Login';
            $("#signInMessage").show();
            facebookLoginButton.innerHTML = "Sign In With Facebook";
        }
    });




    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            console.log("you're connected")
            //display user data
            $('#submitForm').attr('action', 'https://localhost:8000/createPost');
            $('#submitButton').attr('onclick', '');
        } else {
            $('#submitButton').attr('onclick', 'sellLoginCheck()');
            $('#submitForm').attr('action', '');
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
            $('#submitButton').attr('onclick', 'sellLoginCheck()');
            $('#submitForm').attr('action', '');
            document.getElementById('successScreen').innerHTML = 'Thanks for Logging Out';
            document.getElementById('login').innerHTML = 'Login';
            facebookLoginButton.innerHTML = "Sign In With Facebook";
            $("#signInMessage").show();
        } else {
            fbLogin()
            $('#submitForm').attr('action', 'https://localhost:8000/createPost');
            $('#submitButton').attr('onclick', '');
            document.getElementById('login').innerHTML = 'Logout';
            facebookLoginButton.innerHTML = "Sign Out With Facebook";
            $("#signInMessage").hide();
        }
    });
}


// when a user tries to sell an item check if they are logged in and open up a modal to login if they are not logged in
function sellLoginCheck () {
        FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            //display user data
            return true; 
        } else {
            document.getElementById('loginMessage').innerHTML = 'You must login before you are able to sell an item!';
            showLoginPopup();
            return false;
        }
    });
}



function fbLogin() {
    var window = FB.login(function (response) {
        if (response.authResponse) {
            // Get and display the user profile data
            document.getElementById('successScreen').innerHTML = 'Thanks for Logging In';
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
    // delete localStorage.curUserID;

    userID = undefined;

    FB.logout(function() {
        console.log('Successfully logged out')
    });
}

function getFbUserData(){
    FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture, age_range'},
        function (response) {
            //localStorage.setItem("curUserID", response.id);
            userID = response.id;
            $("#userid").val(userID)
            scope.getNotifications(userID);
            console.log(userID + "saving UserID as a global variable")

            // Save user data
            saveUserData(response);
        });
}

console.log(userID + "saving UserID as a global variable")

function saveUserData(response) {

      var url = "https://localhost:8000/createUser";
      
      console.log('Gender:' + response.gender);
      console.log('Age max: ' + response.age_range.max);
      console.log('Age min: ' + response.age_range.min);
      var avgAge = 25 //default to 25 if unspecified

      if (response.age_range != null) {
        avgAge = (response.age_range.max + response.age_range.min) / 2
        console.log('Avg age is' + avgAge);
      }

      data = {
        name: response.first_name+ ' ' + response.last_name,
        fbid: response.id,
        age: avgAge,
        gender: response.gender,
        url: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
        email: response.email
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

console.log('test')



// // Facebook Login code -----------------------------------
// window.fbAsyncInit = function() {
// 	FB.init({
// 		appId      : '228917890846081',
// 		xfbml      : true,
// 		cookie     : true,
// 		version    : 'v2.8'
// 	});

//     // Check whether the user already logged in
//     FB.getLoginStatus(function(response) {
//     	if (response.status === 'connected') {
//             //display user data
//             console.log('logged in')
//             // Get and display the user profile data
//         }
//         else {
//         	console.log('Not logged in');
//         	showLoginPopup();
//         }
//     });
// };

// (function(d, s, id){
// 	var js, fjs = d.getElementsByTagName(s)[0];
// 	if (d.getElementById(id)) {return;}
// 	js = d.createElement(s); js.id = id;
// 	js.src="https://connect.facebook.net/en_US/all.js";
// 	fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));


// function showLoginPopup() {
// 	$('#loginPopup').modal({
//   		keyboard: false
// 	})
// };

// var facebookLoginButton = document.getElementById("loginToFacebook");

// // When the user clicks the button, open the modal 
// facebookLoginButton.onclick = function() {
//     console.log('logging in/out')
//     FB.getLoginStatus(function(response) {
//         if (response.status === 'connected') {
//             //display user data
//             fbLogout()
//         } else {
//             fbLogin()
//         }
//     });
// }

// function fbLogin() {
//     var window = FB.login(function (response) {
//         if (response.authResponse) {
//             // Get and display the user profile data
//             facebookLoginButton.setAttribute("onclick","fbLogout()");
//             facebookLoginButton.innerHTML = 'Facebook Logout';
//             getFbUserData();
//         } else {
//             document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
//         }
//     }, {scope: 'email'});
// }

// // Logout from facebook
// function fbLogout() {
//     //delete local storage
//     delete localStorage.curUserID;

//     FB.logout(function() {
//         facebookLoginButton.setAttribute("onclick","fbLogin()");
//         facebookLoginButton.innerHTML = 'Facebook Login';
//     });
// }

// function getFbUserData(){
//     FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture'},
//         function (response) {
//             localStorage.setItem("curUserID", response.id);
//             // Save user data
//             saveUserData(response);
//         });
// }

// function saveUserData(response) {

//       var url = "https://localhost:8000/createUser";

//       data = {
//         name: response.first_name+ ' ' + response.last_name,
//         fbid: response.id,
//         url: response.picture.data.url
//       }

//       // AJAX POST TO SERVER
//       $.ajax({
//         url: url,
//         type: 'post',
//         data: data,
//         success: function(data) {
//         console.log(data)
//         },
//         error: function(response, error) {
//         console.log(response)
//         console.log(error)
//         }
//     });
// }
// //End Facebook login code -----------------------------------




