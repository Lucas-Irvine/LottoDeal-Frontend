// var prodUrl = "https://lottodeal.club:8000/";
// var prodUrl = "https://162.243.121.223:8000/"
var prodUrl = "http://162.243.121.223:8000/"
var debug = "https://localhost:8000/"

function checkIfUser(accessToken, callback) {
    // get all the accounts for all posts
    var checkURL = prodUrl + "checkIfUser";
    var data = {
        accessToken: accessToken
    }
    $.ajax({
        url: checkURL,
        type: 'GET',
        data: data,
        success: function(data) {
            status = data;

            if (status == "false") {
                document.getElementById('loginMessage').innerHTML = 'Please logout and login so that you will be a registered user. You must accept third' +
                    'party cookies to login successfully.';
                showLoginPopup();
            }
            callback();
        },
        error: function(response, error) {
            console.log("Error in checkIfUser")
            console.log(response)
            console.log(error)
        }
    });
}


// Check if a form is okay to submit before acces
// http://stackoverflow.com/questions/40711082/call-a-javascript-function-before-action-in-html-form
function sellCheck() {
    if (accessToken != undefined) {
        checkIfUser(accessToken, function() {
            if (status == 'true') {
                //to submit the form
                document.getElementById("submitForm").disabled = true;
                return true;
            } else {
                document.getElementById('loginMessage').innerHTML = 'You must login and logout before you are able to sell an item!';
                showLoginPopup();
                // to not submit the form
                return false;
            }


        });
    } else {
        document.getElementById('loginMessage').innerHTML = 'You must login before you are able to sell an item!';
        showLoginPopup();
        return false;
    }
}



$('#loginPopup').on('hidden.bs.modal', function() {
    document.getElementById('successScreen').innerHTML = '';
    document.getElementById('loginMessage').innerHTML = ""
})


// Facebook Login code -----------------------------------
window.fbAsyncInit = function() {
    FB.init({
        appId: '228917890846081',
        xfbml: true,
        cookie: true,
        version: 'v2.8'
    });

    // Check whether the user already logged in
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            //display user data
            document.getElementById('successScreen').innerHTML = "";
            document.getElementById('login').innerHTML = 'Logout';
            facebookLoginButton.innerHTML = "Sign Out With Facebook";
            $("#signInMessage").hide();

            accessToken = response.authResponse.accessToken;

            // sell page
            if ($("#accessToken") != undefined) {
                $("#accessToken").val(accessToken);
            }
            userID = response.authResponse.userID;;

            if (window.location.href.indexOf("item.html") > -1) {
                scope.getSuggestions();
                scope.getItem();
            }

            if (window.location.href.indexOf("user.html") > -1) {
                scope.checkIfReviewingSelf(accessToken, userID);
            }

            if (window.location.href.indexOf("profile.html") > -1) {
                scope.getAccount();
                scope.getBiddedItemsOfUsers();
                scope.getListedItemsForUsers();
                scope.getSoldItemsForUsers();
                scope.getReviews();
                scope.getReviewerImagesAndNames();
            }
            if (accessToken != null && accessToken != undefined) {
                scope.getNotifications(accessToken);
            }

            // Get and display the user profile data
        } else {
            accessToken = undefined;

            if (window.location.href.indexOf("profile.html") > -1) {
                document.getElementById('loginMessage').innerHTML = 'Please login before you can access your profile';
                document.getElementById('login').innerHTML = 'Login';
                $("#signInMessage").show();
                showLoginPopup();
            }

            if (window.location.href.indexOf("item.html") > -1) {
                scope.getItem(); // should be able to see item still
            }

            document.getElementById('successScreen').innerHTML = "";
            document.getElementById('login').innerHTML = 'Login';
            $("#signInMessage").show();
            facebookLoginButton.innerHTML = "Sign In With Facebook";
        }
    });



};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/all.js";
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
    document.getElementById('loginMessage').innerHTML = ""
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            //display user data
            fbLogout()

            // below is used for the sell page but should be dleeted once we use check user
            // $('#submitButton').attr('onclick', 'sellLoginCheck()');
            // $('#submitForm').attr('action', '');
            document.getElementById('successScreen').innerHTML = 'Thanks for Logging Out';
            document.getElementById('login').innerHTML = 'Login';
            facebookLoginButton.innerHTML = "Sign In With Facebook";
            $("#signInMessage").show();
        } else {
            fbLogin()
                // below is same as above
                // $('#submitForm').attr('action', 'https://localhost:8000/createPost');
                // $('#submitButton').attr('onclick', '');
            document.getElementById('login').innerHTML = 'Logout';
            facebookLoginButton.innerHTML = "Sign Out With Facebook";
            $("#signInMessage").hide();
        }
    });
}



function fbLogin() {
    var window = FB.login(function(response) {
        if (response.authResponse) {
            // Get and display the user profile data
            document.getElementById('successScreen').innerHTML = 'Thanks for Logging In';
            userID = response.id;
            FB.getAuthResponse(function(response) {
                if (response.status === 'connected') {
                    accessToken = response.authResponse.accessToken;
                }
            });
            getFbUserData();
        } else {
            document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
        }
    }, {
        scope: 'email'
    });
}

// Logout from facebook
function fbLogout() {
    accessToken = undefined;

    FB.logout(function() {
        // successfully logged out
    });
}

function getFbUserData() {
    FB.api('/me', {
            locale: 'en_US',
            fields: 'id,first_name,last_name,email,link,gender,locale,picture, age_range'
        },
        function(response) {
            // for sell page
            if ($("#accessToken") != undefined) {
                $("#accessToken").val(accessToken);
            }

            if (window.location.href.indexOf("item.html") > -1) {
                scope.getSuggestions();
                scope.getItem();
            }

            if (window.location.href.indexOf("user.html") > -1) {
                scope.checkIfReviewingSelf(accessToken, userID);
            }


            if (window.location.href.indexOf("profile.html") > -1) {
                scope.getAccount();
                scope.getBidsOfUsers();
                scope.getBiddedItemsOfUsers();
                scope.getListedItemsForUsers();
                scope.getSoldItemsForUsers();
                scope.getReviews();
                scope.getReviewerImagesAndNames();
            }

            if (accessToken != null && accessToken != undefined) {
                scope.getNotifications(accessToken);
            }

            window.location.reload(true); // reload a page when you log in
            

            // Save user data
            saveUserData(response);
        });
}

function saveUserData(response) {
    var url = prodUrl + "createUser";

    var avgAge = 25 //default to 25 if unspecified

    if (response.age_range != null) {
        avgAge = (response.age_range.max + response.age_range.min) / 2
    }

    data = {
        name: response.first_name + ' ' + response.last_name,
        fbid: response.id,
        age: avgAge,
        gender: response.gender,
        url: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
        email: response.email
    }

    $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function(data) {
            // successful post
        },
        error: function(response, error) {
            console.log("Error in saving user from facebook")
            console.log(response)
            console.log(error)
        }
    });
}
//End Facebook login code -----------------------------------


// /* code taken from http://cssmenumaker.com/blog/solving-the-double-tap-issue-on-ios-devices
// *  makes links work on 1 click on mobile */
//
// $(document).ready(function() {
//
//     $('a').on('click touchend', function(e) {
//         var el = $(this);
//             if (el.hasAttribute('href')) {
//                 var link = el.attr('href');
//                 window.location = link;
//             }
//         }
//     });
//
// });

