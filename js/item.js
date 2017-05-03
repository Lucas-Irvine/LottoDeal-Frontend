var app = angular.module("item_app", ["ngRoute"])



$('#myTabs a').click(function(e) {
    console.log('tab clicked');
    e.preventDefault()
    $(this).tab('show')
});


var userID;
var scope;

//Code modified from https://www.w3schools.com/howto/howto_js_tabs.asp
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



app.controller("itemController", ["$scope", "$rootScope", "$location", "$routeParams", function($scope, $rootScope, $location, $routeParams) {
    var searchObject = $location.search();
    var id = searchObject['id'];
    console.log(id);

    scope = $scope;



    // $scope.post = null;

    function getSuggestions() {
        //GET SUGGESTIONS
        var suggestionsURL = "https://localhost:8000/getSuggestions"
        if (userID != null) {
            $.ajax({
                url: suggestionsURL,
                type: 'GET',
                data: {
                    userID: userID
                },
                statusCode: {
                    200: function(response) {
                        $(document.body).show(); // SHOULD EDIT THIS TO BE BETTER DESIGN - WHAT IF AJAX CALL FAILS
                    },
                    404: function(response) {
                        var newDoc = document.open("text/html", "replace");
                        // console.log(response);
                        newDoc.write(response.responseText);
                        newDoc.close();
                    }
                },
                success: function(data) {
                    var parsed = JSON.parse(data)
                    console.log(parsed)
                    console.log("retrieved suggestions")


                    $scope.suggestions = parsed;
                    $scope.$apply();
                },
                error: function(response, error) {
                    console.log(response)
                    console.log(error)
                }
            });
        }
    }


    var itemIDs = [];
    // mark all the notifications as read
    scope.markRead = function() {
        // AJAX POST TO SERVER
        var readurl = "https://localhost:8000/markRead";
        // var userID = localStorage.getItem("curUserID")

        console.log(userID + "here's the userID in mark read");
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

                    itemIDs.push(notifications[i].itemID);

                    var date = new Date(notifications[i].datePosted);

                    var hoursAgo = Math.abs(DateDiff.inHours(curDate, date));

                    if (hoursAgo < 24) {
                        if (hoursAgo == 0) {
                            notifications[i].datePosted = "Just Now";
                        } else if (hoursAgo == 1) {
                            notifications[i].datePosted = hoursAgo + " hour ago";
                        } else {
                            notifications[i].datePosted = hoursAgo + " hours ago";
                            console.log(notifications[i].datePosted);
                        }
                    } else {
                        var month = date.getMonth();
                        var day = date.getDate();

                        /* code taken from http://stackoverflow.com/questions/8888491/
                         how-do-you-display-javascript-datetime-in-12-hour-am-pm-format */

                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var ampm = hours >= 12 ? 'pm' : 'am';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        minutes = minutes < 10 ? '0' + minutes : minutes;
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


    var url = "https://localhost:8000/getItem"

    var userid = userID;
    // console.log(userid)

    $scope.canEdit = false;


    $scope.editing = false;



    $.ajax({
        url: url,
        type: 'GET',
        data: {
            id: id
        },
        statusCode: {
            200: function(response) {
                $(document.body).show(); // SHOULD EDIT THIS TO BE BETTER DESIGN - WHAT IF AJAX CALL FAILS
            },
            404: function(response) {
                var newDoc = document.open("text/html", "replace");
                // console.log(response);
                newDoc.write(response.responseText);
                newDoc.close();
            }
        },
        success: function(data) {
            console.log(data["_id"])
            var parsed = JSON.parse(data)
            console.log(parsed);
            console.log(parsed._id)

            // amount raised
            parsed.percentageRaised = (Number(parsed.amountRaised) / Number(parsed.price)) * 100;
            console.log("Raised" + parsed.percentageRaised);
            var expirationDate = new Date(parsed.expirationDate);
            var date = new Date();
            parsed.hoursToGo = DateDiff.inHours(date, expirationDate)
            parsed.daysToGo = DateDiff.inDays(date, expirationDate)
            parsed.titleUppercase = parsed.title.toUpperCase();


            var image = parsed.img;

            if (image == null) {
                parsed["src"] = "http://placehold.it/320x150"
            } else {
                // console.log(parsed)
                //    console.log(parsed.img)

                // var b64 = base64ArrayBuffer(parsed.img.data.data);
                // var dataURL = "data:image/jpeg;base64," + b64;

                // parsed["src"] = dataURL;
                parsed["src"] = parsed.img.compressed;
            }


            // check if user can edit
            if (parsed.sellerID == userid) {
                console.log("matches")
                $scope.canEdit = true;

            } else {
                console.log(userid + "cannot edit this post");
            }



            $scope.post = parsed;
            $scope.$apply();
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });



    var handler = StripeCheckout.configure({
        key: 'pk_test_I1JByOdv34UVHxZhjKYlKGc4',
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function(token) {
            console.log('attempting stripe payment')
            var userID = localStorage.getItem("curUserID")
            var amountToCharge = $scope.amountToCharge;
            var itemTitle = $scope.itemTitle;
            var itemID = $scope.itemID;
            var amountRaised = $scope.amountRaised;
            var price = $scope.price;

            if (userID != undefined) {
                data = {
                    itemID: itemID,
                    itemTitle: itemTitle,
                    userID: userID,
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


                        post = $scope.post
                        console.log(itemID)
                        if (post["_id"] == itemID) {
                            var newPrice = post.amountRaised + amountToCharge;
                            post.amountRaised = newPrice;
                            post.percentageRaised = (newPrice / post.price) * 100;
                        }

                        $scope.$apply()

                    },
                    error: function(response, error) {
                        console.log(response)
                        console.log(error)
                    }
                });

            } else {
                document.getElementById('loginMessage').innerHTML = 'You must login before you are able to bid on an item!';
                showLoginPopup();
                console.log('UserID is undefined')
            }
        }
    });



    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {

        console.log('initiating bid');
        $scope.price = price;
        $scope.amountToCharge = amount;
        $scope.itemID = itemID
        $scope.itemTitle = itemTitle
        $scope.amountRaised = amountRaised

        if (userID != undefined) {

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
        } else {
            document.getElementById('loginMessage').innerHTML = 'You must login before you are able to bid on an item!';
            showLoginPopup();
            console.log('UserID is undefined')
        }

    }

    var dataDelete = {
        id: id
    }
    $scope.deleteItem = function() {
        BootstrapDialog.show({
            title: 'Are you sure you would like to delete this item?',
            message: 'This cannot be undone',
            buttons: [{
                id: 'btn-1',
                label: 'Delete Item',
                action: function(dialog) {
                    var $button = this; // 'this' here is a jQuery object that wrapping the <button> DOM element.
                    $button.disable();
                    $button.spin();
                    dialog.setClosable(false);
                    $.ajax({
                        url: 'https://localhost:8000/deleteItem',
                        data: dataDelete,
                        type: 'DELETE',
                        success: function(data) {
                            console.log('Success deleting item')
                            var $footerButton = dialog.getButton('btn-1');
                            $footerButton.enable();
                            $footerButton.stopSpin();
                            dialog.setClosable(true);
                            dialog.close();
                            window.location.href = 'https://dominicwhyte.github.io/LottoDeal-Frontend/index.html';
                        },
                        error: function(response, error) {
                            console.log('Error deleting item')
                            var $footerButton = dialog.getButton('btn-1');
                            $footerButton.enable();
                            $footerButton.stopSpin();
                            dialog.setClosable(true);
                        }
                    });


                }
            }]
        });
    }

    $scope.editItem = function() {
        // display editable fields

        if ($scope.editing == true) {
            $scope.editing = false;
        } else {
            $scope.editing = true;
        }



    }

    $scope.saveChanges = function() {
        // GET ALL CHANGES AND SEND BACK TO SERVER
    }



    //Code modified from http://ditio.net/2010/05/02/javascript-date-difference-calculation/
    var DateDiff = {

        inHours: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            if (t2 == null || t1 == null) {
                return 0
            }
            return (parseInt((t2 - t1) / (3600 * 1000))) % 24;
        },

        inDays: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            if (t2 == null || t1 == null) {
                return 0
            }
            return parseInt((t2 - t1) / (24 * 3600 * 1000));
        }
    };


    // console.log($routeParams)
    // console.log($routeParams.id)

    // console.log(searchObject);

    // console.log($location.search('id'));
    // $(document.body).show()
}])


// Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. According to my tests, this appears to be a faster approach:
// http://jsperf.com/encoding-xhr-image-data/5

/*
MIT LICENSE
Copyright 2011 Jon Leighton
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


function showLoginPopup() {
    $('#loginPopup').modal({
        keyboard: false
    })
};


function base64ArrayBuffer(arrayBuffer) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63 // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}



// Facebook Login code -----------------------------------



window.fbAsyncInit = function() {

    FB.init({
        appId: '228917890846081',
        status: true,
        cookie: true,
        xfbml: true
    });
    FB.getLoginStatus(function(response) {
        userID = response.userID;
        getSuggestions();
        console.log(userID + "saving UserID as a global variable when logging in ")
    });
};

(function(d) {
    var js, id = 'facebook-jssdk';
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));



// window.fbAsyncInit = function() {
//     FB.init({
//         appId: '228917890846081',
//         xfbml: true,
//         cookie: true,
//         version: 'v2.8'
//     });
//     console.log('test1')
//         // Check whether the user already logged in
//     FB.getLoginStatus(function(response) {
//         if (response.status === 'connected') {
//             //display user data
//             document.getElementById('successScreen').innerHTML = "";
//             document.getElementById('login').innerHTML = 'Logout';
//             facebookLoginButton.innerHTML = "Sign Out With Facebook";
//             $("#signInMessage").hide();


//             FB.api('/me', {
//                     locale: 'en_US',
//                     fields: 'id'
//                 },
//                 function(response) {
//                     //localStorage.setItem("curUserID", response.id);
//                     userID = response.id;
//                     $("#userid").val(userID)
//                     scope.getNotifications(userID);
//                     console.log(userID + "saving UserID as a global variable when logging in ")
//                 });

//             //saveUserID();
//             console.log('logged in')
//                 // Get and display the user profile data
//         } else {
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
//     document.getElementById('loginMessage').innerHTML = ""
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
//     var window = FB.login(function(response) {
//         if (response.authResponse) {
//             // Get and display the user profile data
//             document.getElementById('successScreen').innerHTML = 'Thanks for Logging In';
//             console.log('Successfully logged in')
//             getFbUserData();
//         } else {
//             document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
//         }
//     }, {
//         scope: 'email'
//     });
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

// function getFbUserData() {
//     FB.api('/me', {
//             locale: 'en_US',
//             fields: 'id,first_name,last_name,email,link,gender,locale,picture, age_range'
//         },
//         function(response) {
//             //localStorage.setItem("curUserID", response.id);
//             userID = response.id;
//             $("#userid").val(userID)
//             console.log(userID + "saving UserID as a global variable")

//             // Save user data
//             saveUserData(response);
//         });
// }

// function saveUserData(response) {

//     var url = "https://localhost:8000/createUser";

//     console.log('Gender:' + response.gender);
//     console.log('Age max: ' + response.age_range.max);
//     console.log('Age min: ' + response.age_range.min);
//     var avgAge = 25 //default to 25 if unspecified

//     if (response.age_range != null) {
//         avgAge = (response.age_range.max + response.age_range.min) / 2
//         console.log('Avg age is' + avgAge);
//     }

//     data = {
//         name: response.first_name + ' ' + response.last_name,
//         fbid: response.id,
//         age: avgAge,
//         gender: response.gender,
//         url: 'http://graph.facebook.com/' + response.id + '/picture?type=large',
//         email: response.email
//     }

//     // AJAX POST TO SERVER
//     $.ajax({
//         url: url,
//         type: 'post',
//         data: data,
//         success: function(data) {
//             console.log(data)
//         },
//         error: function(response, error) {
//             console.log(response)
//             console.log(error)
//         }
//     });
// }
//End Facebook login code -----------------------------------