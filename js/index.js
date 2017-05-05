var app = angular.module("index_app", ["serverModule"])

var userID;
var status = 'false';


// function to delete a given item 
function deleteItem () {
        // get all the accounts for all posts
    var deleteUrl = "https://localhost:8000/deleteItem";
    var data = {
        id: "CORRECT ID HERE"
    }

    $.ajax({
        url: deleteUrl,
        type: 'DELETE',
        data: data,

        success: function(message) {
            var success = JSON.parse(message)
            if (success == "0") {
                alert("You can't delete an item that has bids on it!")
            }
            console.log("item successfully deleted")
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });
}



var scope;


app.controller("indexController", ["$scope", "$rootScope", "$location", "serverGet", function($scope, $rootScope, $location, serverGet) {

    scope = $scope;
    $scope.selectedTab = 0
    $scope.posts = []

    console.log(serverGet);

    function hexToBase64(str) {
        return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }

    // $("#loading-image").bind('ajaxStart', function() {
    //     $(this).show();
    // }).bind('ajaxStop', function() {
    //     $(this).hide();
    // })

    // AJAX POST TO SERVERg]


    serverGet.getPosts($("#loading-icon"), $scope);
    // var url = "https://localhost:8000/getPosts";
    // $("#loading-icon").show()
    // $.ajax({
    //     url: url,
    //     type: 'GET',
    //     success: function(data) {
    //         console.log("completed AJAX call")
    //         var items = JSON.parse(data);
    //         var soldItems = [];
    //         var expiredItems = [];
    //         var listedItems = [];
    //         console.log(items);
    //         for (i = 0; i < items.length; i++) {
    //             items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
    //             // console.log( "Raised" + items[i].percentageRaised);
    //             var expirationDate = new Date(items[i].expirationDate);
    //             var date = new Date();
    //             var hours = DateDiff.inHours(date, expirationDate)
    //             var days = DateDiff.inDays(date, expirationDate)

    //             if (items[i].expired) {
    //                 items[i].expirationDate = "Lottery has expired!";                     
    //             }
    //             else if (items[i].sold) {
    //                 items[i].expirationDate = items[i].winnerName;
    //             }
    //             else if (hours < 0 || days < 0) {
    //                  items[i].expirationDate = "Negative days remaining (not expired yet)";   
    //             }
    //             else {
    //                 items[i].expirationDate =  hours + " Hours " + days + " Days left";
    //             }
    //            // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)

    //             var image = items[i].img;
    //             if (image == null) {
    //                 items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
    //             } 
    //             else if (items[i].img.compressed != null) {
    //                 items[i]["src"] = items[i].img.compressed;

    //             }
    //             else {
    //                 // WORKING SNIPPET
    //                 // var binary = '';
    //                 // var bytes = new Uint8Array(items[i].img.data.data);
    //                 // var len = bytes.byteLength;
    //                 // for (var j = 0; j < len; j++) {
    //                 //     binary += String.fromCharCode(bytes[j]);
    //                 // }
    //                 // END WORKING SNIPPET


    //                 // NOTE: EITHER ONE OF THE BELOW LINES WORK, SHOULD BE TESTED FOR SPEED
    //                 // var b64 = btoa(binary);
    //                 var b64 = base64ArrayBuffer(items[i].img.data.data)

    //                 // var raw = String.fromCharCode.apply(null, items[i].img.data.data)

    //                 // var b64=btoa(raw)
    //                 var dataURL = "data:image/jpeg;base64," + b64;

    //                 // if (items[i].img.compressed != null) {
    //                 //     items[i]["src"] = items[i].img.compressed;
    //                 // }
    //                 // else {
    //                 //     items[i]["src"] = dataURL;
    //                 // }
    //                 items[i]["src"] = dataURL;


    //                 // items[i]["src"] = 'data:image/jpeg;base64,' + items[i].img.data.data;
    //                 // items[i]["src"] = items[i].img.data.data;
    //             }
    //             if (items[i].sold == true) {
    //                 soldItems.push(items[i]);
    //             }
    //             else if (items[i].expired == true) {
    //                 expiredItems.push(items[i]);
    //             }
    //             else {
    //                 listedItems.push(items[i]);
    //             }

    //         }
    //         $scope.posts = listedItems;
    //         $scope.soldItems = soldItems;
    //         $scope.expiredItems = expiredItems;

    //         console.log($scope.posts)

    //         $("#loading-icon").hide();
    //         $scope.$apply()
    //     },
    //     error: function(response, error) {
    //         console.log(response)
    //         console.log(error)
    //     }
    // });





    // get all the accounts for all posts
    // var accountUrl = "https://localhost:8000/getAccountsForPosts";

    // $scope.accounts = []

    // $.ajax({
    //     url: accountUrl,
    //     type: 'GET',
    //     success: function(data) {
    //         var accounts = JSON.parse(data)
    //         $scope.accounts = accounts;
    //         console.log($scope.accounts)
    //         $scope.$apply()
    //     },
    //     error: function(response, error) {
    //         console.log(response)
    //         console.log(error)
    //     }
    // });
    serverGet.getAccountsForPosts($scope);


    $scope.notificationLength = 0;

    scope.getNotifications = function(userID) {
        serverGet.getNotifications(accessToken, $scope);
    }


    $scope.images = []

    // mark all the notifications as read
    scope.markRead = function() {
        serverGet.markRead(accessToken, $scope);
    }

    $scope.targetPost = null;
    $scope.amountRaised = 0
    $scope.amountToCharge = 0
    $scope.itemID = ""
    $scope.itemTitle = ""
    $scope.price = 0

    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {
        serverPost.bid(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document);
    }
}])

//For changing tabs Code modified from https://www.w3schools.com/howto/howto_js_tabs.asp
function changeTab(titleID, id) {
    console.log('test');
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].className = tabcontent[i].className.replace(" active", "");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }


    document.getElementById(titleID).className += " active";
    document.getElementById(id).className += " active";

    // Show the current tab, and add an "active" class to the button that opened the tab
    // document.getElementById(cityName).style.display = "block";
    //evt.currentTarget.className += " active";
}


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

            document.getElementById('successScreen').innerHTML = 'Thanks for Logging Out';
            document.getElementById('login').innerHTML = 'Login';
            facebookLoginButton.innerHTML = "Sign In With Facebook";
            $("#signInMessage").show();
        } else {
            fbLogin()

            document.getElementById('login').innerHTML = 'Logout';
            facebookLoginButton.innerHTML = "Sign Out With Facebook";
            $("#signInMessage").hide();
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



