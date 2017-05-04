function checkIfUser(userID, callback) {
    // get all the accounts for all posts
    var checkURL = "https://localhost:8000/checkIfUser";

    var data = {
        userID: userID
    }

    $.ajax({
        url: checkURL,
        type: 'GET',
        data: data,
        success: function(data) {
            status = data;

            if (status == "false") {
                document.getElementById('loginMessage').innerHTML = 'Please logout and login so that you will be a registered user';
                showLoginPopup();
                console.log('UserID is null')
            }
            callback();
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });
}


$('#loginPopup').on('hidden.bs.modal', function () {
  document.getElementById('successScreen').innerHTML = '';
  document.getElementById('loginMessage').innerHTML = ""
})


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
            // checkIfUser(userID);
            console.log(userID + "saving UserID as a global variable when logging in ")
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



    // only used for sell page to make the action of selling invalid
    // change this later to do the same as index bidding where you use
    // checkuser 
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




// this is from sell might delete

// // when a user tries to sell an item check if they are logged in and open up a modal to login if they are not logged in
// function sellLoginCheck () {
//         FB.getLoginStatus(function(response) {
//         if (response.status === 'connected') {
//             //display user data
//             return true; 
//         } else {
//             document.getElementById('loginMessage').innerHTML = 'You must login before you are able to sell an item!';
//             showLoginPopup();
//             return false;
//         }
//     });
// }



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
