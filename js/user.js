/* JS for the tabs */
$(document).ready(function() {
    $(".btn-pref .btn").click(function () {
        $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-primary");
    });
    $("#sellingTab").click();
});


var reviewID; // person being reviewed

// change the number of stars selected
function changeStars(stars) {
    $('#numStars').val(stars);
}


function createReviewFunction() {

    // var searchObject = $location.search();
    // var id = searchObject['id'];
    // console.log(id);


    var url = "https://localhost:8000/createReview";

        console.log(numStars);

        var sellerID = reviewID;
        var reviewDes = $("#reviewDes").val();
        var stars = $("#numStars").val(); 
        // var userID = localStorage.getItem("curUserID");
        console.log(stars)

        if (stars != 0) {

            console.log("posting a review NOW!")
            data = {
             sellerID: sellerID,
             reviewDes: reviewDes,
             stars: stars, //change later to actual value
             accessToken: accessToken,
            }

            // AJAX POST TO SERVER
            $.ajax({
             url: url,
             type: 'POST',
             data: data,
             success: function(data) {
                console.log(data)
                $("#reviewAddedModal").modal()
             },
             error: function(response, error) {
                 console.log(response)
                 console.log(error)
             }
         });
        }
        else {
            alert("Please select the number of stars")
        }
        


}

var app = angular.module("user_app", ["ngRoute"])

app.controller("userController", ["$scope", "$rootScope", "$location", function($scope, $rootScope, $location) {


    scope = $scope;


    
    var searchObject = $location.search();
    var id = searchObject['id'];
    console.log(id);

    reviewID = id;





    if (reviewID != userID && accessToken != undefined) {
        $("#reviewForm").show();
    }

    
    // USER SHOULD NOT BE ABLE TO REVIEW THEMSELVES IF THEY ARE ON THEIR OWN PAGE - can check this on the backend as well actually (necessary actually)







    $scope.selectedTab = 0

    $scope.bids = []
    $scope.items = []
    $scope.listedItems = []


    // AJAX POST TO SERVER for listed items
    var url = "https://localhost:8000/getListedItemsForUsers";
    var dataGET = {
        userID: id
    }
    console.log('Asking for ListedItems')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        statusCode: {
            // 200: function(response) {
            //     $(document.body).show(); // SHOULD EDIT THIS TO BE BETTER DESIGN - WHAT IF AJAX CALL FAILS
            // },
            404: function(response) {
                var newDoc = document.open("text/html", "replace");
                // console.log(response);
                newDoc.write(response.responseText);
                newDoc.close();
            }
        },
        success: function (data) {
            var items = JSON.parse(data)
            console.log(items);
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log( "Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
            
                var hours = DateDiff.inHours(date, expirationDate)
                var days = DateDiff.inDays(date, expirationDate)

                if (items[i].expired) {
                    items[i].expirationDate = "Lottery has expired!";                     
                }
                else if (items[i].sold) {
                    items[i].expirationDate = "Item was sold to:" + items[i].winnerName;
                }
                else if (hours < 0 || days < 0) {
                     items[i].expirationDate = "Negative days remaining (not expired yet)";   
                }
                else {
                    items[i].expirationDate =  hours + " Hours " + days + " Days left";
                }
               // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)

                var image = items[i].img;
                if (image == null) {
                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
                } 
                else if (items[i].img.compressed != null) {
                    items[i]["src"] = items[i].img.compressed;
                }
                else {
                    var b64 = base64ArrayBuffer(items[i].img.data.data)
                    var dataURL = "data:image/jpeg;base64," + b64;
                    items[i]["src"] = dataURL;
                }

                var count = 0;
                for (var j = 0; j < items[i].bids.length; j++) {
                    if (accessToken == items[i].bids[j].ID) {
                        count += items[i].bids[j].amount;
                    }
                }
                items[i]["yourBids"] = count;
            }
            $scope.listedItems = items;
            console.log($scope.listedItems)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.soldItems = []


    // AJAX POST TO SERVER for sold items
    var url = "https://localhost:8000/getSoldItemsForUsers";
    var dataGET = {
        userID: id
    }
    console.log('Asking for SoldItems')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log( "Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
            
                var hours = DateDiff.inHours(date, expirationDate)
                var days = DateDiff.inDays(date, expirationDate)

                if (items[i].expired) {
                    items[i].expirationDate = "Lottery has expired!";                     
                }
                else if (items[i].sold) {
                    items[i].expirationDate = "Item was sold to:" + items[i].winnerName;
                }
                else if (hours < 0 || days < 0) {
                     items[i].expirationDate = "Negative days remaining (not expired yet)";   
                }
                else {
                    items[i].expirationDate =  hours + " Hours " + days + " Days left";
                }
               // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)

                var image = items[i].img;
                if (image == null) {
                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
                } 
                else if (items[i].img.compressed != null) {
                    items[i]["src"] = items[i].img.compressed;
                }
                else {
                    var b64 = base64ArrayBuffer(items[i].img.data.data)
                    var dataURL = "data:image/jpeg;base64," + b64;
                    items[i]["src"] = dataURL;
                }

                var count = 0;
                for (var j = 0; j < items[i].bids.length; j++) {
                    if (accessToken == items[i].bids[j].ID) {
                        count += items[i].bids[j].amount;
                    }
                }
                items[i]["yourBids"] = count;

            }
            $scope.soldItems = items;
            console.log($scope.soldItems)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.reviews = []

    // AJAX POST TO SERVER for reviews
    var url = "https://localhost:8000/getReviews";
    var dataGET = {
        sellerID: id
    }
    console.log('Asking for Reviews')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        statusCode: {
            // 200: function(response) {
            //     $(document.body).show(); // SHOULD EDIT THIS TO BE BETTER DESIGN - WHAT IF AJAX CALL FAILS
            // },
            404: function(response) {
                var newDoc = document.open("text/html", "replace");
                console.log(response);
                newDoc.write(response.responseText);
                newDoc.close();
            }
        },
        success: function (data) {
            var items = JSON.parse(data)


            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            for (i = 0; i < items.length; i++) {


                var date = new Date(items[i].datePosted)
                var month = date.getMonth();
                var day = date.getDate();
                var year = date.getFullYear();
                var newDate = monthNames[month] + " " + day + ", " + year;
                items[i].datePosted = newDate;
                console.log(newDate);
            }

            $scope.reviews = items;
            console.log($scope.reviews)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(JSON.stringify(response))
            console.log(error)
        }
    });

    $scope.reviewers = []

    // AJAX POST TO SERVER for reviews
    var url = "https://localhost:8000/getReviewerImagesandNames";
    var dataGET = {
        userID: id
    }
    console.log('Asking for Reviewers')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var items = JSON.parse(data)
            $scope.reviewers = items;
            console.log($scope.reviewers)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });



    var itemIDs = [];
    scope.markRead = function() {
        // AJAX POST TO SERVER
        var readurl = "https://localhost:8000/markRead";
        // var userID = localStorage.getItem("curUserID")

        console.log(userID + "here's the userID in mark read");
        var data = {
            accessToken: accessToken
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

                    itemIDs.push(notifications[i].itemID);

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




    $scope.account = []

    // AJAX get TO SERVER for account
    var url = "https://localhost:8000/getAccount";
    var dataGET = {
        userID: id
    }
    console.log('Asking for account info')
    
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var account = JSON.parse(data)
            console.log("Here's your account for another user" + account)



            document.getElementById('profileName').innerHTML = account.fullName;
            document.getElementById('profileImage').src = account.pictureURL;
            var reviews = account.reviews;
            var length = reviews.length;
            var total = 0; 
            var average = 0;
            var averageRounded = 0;
            if (length != 0) {
                var total = 0; 
                for (var i = 0; i < length; i++) {
                    total += parseInt(reviews[i].stars);
                }

                var average = total/length;
                var averageRounded = Math.round(average*10)/10
            }

            var account = {
                averageRating : averageRounded,
            }
            
            $scope.account = account;
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });


    $scope.targetPost = null;



    $scope.amountRaised = 0
    $scope.amountToCharge = 0
    $scope.itemID = ""
    $scope.itemTitle = ""
    $scope.price = 0

    var handler = StripeCheckout.configure({
        key: 'pk_test_I1JByOdv34UVHxZhjKYlKGc4',
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function(token) {
            console.log('attempting stripe payment')
            // var userID = localStorage.getItem("curUserID")
            var amountToCharge = $scope.amountToCharge;
            var itemTitle = $scope.itemTitle;
            var itemID = $scope.itemID;
            var amountRaised = $scope.amountRaised;
            var price = $scope.price;

            if (accessToken != undefined) {
                data = {
                    itemID: itemID,
                    itemTitle: itemTitle,
                    userID: accessToken,
                    stripeToken: token.id,
                    amount: Number(amountToCharge)
                }
                $.ajax({
                    url: 'https://localhost:8000/performPaymentAndAddBid',
                    data: data,
                    type: 'POST',
                    success: function(data) {
                        console.log('success payment and bid added')
                        console.log(data);

                        for (var i = 0; i < $scope.listedItems.length; i++) {
                            post = $scope.listedItems[i]
                            console.log(itemID)
                            if (post["_id"] == itemID) {
                                var newPrice = post.amountRaised + amountToCharge;
                                post.amountRaised = newPrice;
                                post.percentageRaised = (newPrice / post.price) * 100;
                                break;
                            }
                        }
                        $scope.$apply()

                    },
                    error: function(response, error) {
                        console.log(response)
                        console.log(error)
                    }
                });

            } else {
                console.log('UserID is null')
            }
        }
    });


    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {

        $scope.price = price;
        $scope.amountToCharge = amount;
        $scope.itemID = itemID
        $scope.itemTitle = itemTitle
        $scope.amountRaised = amountRaised
if (accessToken != undefined) {
            if (price >= amountRaised + amount) {
                handler.open({
                    name: 'LottoDeal',
                    description: 'Bid on ' + itemTitle,
                    amount: amount * 100
                });
            } else {
                console.log('Bid overpasses item price!');
                BootstrapDialog.show({
                    title: 'Bid surpasses item price',
                    message: 'Choose a lower bid or search for similar items',
                    buttons: [{
                        id: 'btn-ok',
                        icon: 'glyphicon glyphicon-check',
                        label: 'OK',
                        cssClass: 'btn-primary',
                        data: {
                            js: 'btn-confirm',
                            'user-id': '3'
                        },
                        autospin: false,
                        action: function(dialogRef) {
                            dialogRef.close();
                        }
                    }]
                });

            }
        }
        else {
                document.getElementById('loginMessage').innerHTML = 'You must login before you are able to bid on an item!';
                showLoginPopup();
                console.log('UserID is undefined')
        }



    }


}])


//Code modified from http://ditio.net/2010/05/02/javascript-date-difference-calculation/
var DateDiff = {

    inHours: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        if (t2 == null || t1 == null) {
            return 0
        }
        return (parseInt((t2 - t1) / (3600 * 1000))) % 24;
    },

    inDays: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        if (t2 == null || t1 == null) {
            return 0
        }
        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },
}



// // -------------------- For Facebook login -----------------------------------------



//     // Facebook Login code -----------------------------------
// window.fbAsyncInit = function() {
//     FB.init({
//         appId      : '228917890846081',
//         xfbml      : true,
//         cookie     : true,
//         version    : 'v2.8'
//     });   

//     // Check whether the user already logged in
//     FB.getLoginStatus(function(response) {
//         if (response.status === 'connected') {
//             //display user data
//             document.getElementById('successScreen').innerHTML = "";
//             document.getElementById('login').innerHTML = 'Logout';
//             facebookLoginButton.innerHTML = "Sign Out With Facebook";
//             $("#signInMessage").hide();


//      FB.api('/me', {locale: 'en_US', fields: 'id'},
//         function (response) {
//             //localStorage.setItem("curUserID", response.id);
//             accessToken = response.id;
//             console.log(accessToken + "saving UserID as a global variable when logging in ")
//         });

//             //saveUserID();
//             console.log('logged in')
//             // Get and display the user profile data
//         }
//         else {
//             userID = undefined;
//             console.log('Not logged in');
//             document.getElementById('successScreen').innerHTML = "";
//             document.getElementById('login').innerHTML = 'Login';
//             $("#signInMessage").show();
//             facebookLoginButton.innerHTML = "Sign In With Facebook";
//         }
//     });





// };

// (function(d, s, id){
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {return;}
//     js = d.createElement(s); js.id = id;
//     js.src="https://connect.facebook.net/en_US/all.js";
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));



// function showLoginPopup() {
//     $('#loginPopup').modal({
//         keyboard: false
//     })
// };

// var facebookLoginButton = document.getElementById("loginToFacebook");

// // When the user clicks the button, open the modal 
// facebookLoginButton.onclick = function() {
//     console.log('logging in/out')
//     FB.getLoginStatus(function(response) {
//         if (response.status === 'connected') {
//             //display user data
//             fbLogout()

//             document.getElementById('successScreen').innerHTML = 'Thanks for Logging Out';
//             document.getElementById('login').innerHTML = 'Login';
//             facebookLoginButton.innerHTML = "Sign In With Facebook";
//             $("#signInMessage").show();
//         } else {
//             fbLogin()

//             document.getElementById('login').innerHTML = 'Logout';
//             facebookLoginButton.innerHTML = "Sign Out With Facebook";
//             $("#signInMessage").hide();
//         }
//     });
// }



// function fbLogin() {
//     var window = FB.login(function (response) {
//         if (response.authResponse) {
//             // Get and display the user profile data
//             document.getElementById('successScreen').innerHTML = 'Thanks for Logging In';
//             console.log('Successfully logged in')
//             getFbUserData();
//         } else {
//             document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
//         }
//     }, {scope: 'email'});
// }

// // Logout from facebook
// function fbLogout() {
//     //delete local storage
//     // delete localStorage.curUserID;

//     userID = undefined;

//     FB.logout(function() {
//         console.log('Successfully logged out')
//     });
// }

// function getFbUserData(){
//     FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture, age_range'},
//         function (response) {
//             //localStorage.setItem("curUserID", response.id);
//             accessToken = response.id;

//             console.log(accessToken + "saving UserID as a global variable")

//             // Save user data
//             saveUserData(response);
//         });
// }

// function saveUserData(response) {

//       var url = "https://localhost:8000/createUser";
      
//       console.log('Gender:' + response.gender);
//       console.log('Age max: ' + response.age_range.max);
//       console.log('Age min: ' + response.age_range.min);
//       var avgAge = 25 //default to 25 if unspecified

//       if (response.age_range != null) {
//         avgAge = (response.age_range.max + response.age_range.min) / 2
//         console.log('Avg age is' + avgAge);
//       }

//       data = {
//         name: response.first_name+ ' ' + response.last_name,
//         fbid: response.id,
//         age: avgAge,
//         gender: response.gender,
//         url: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
//         email: response.email
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



