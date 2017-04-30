var app = angular.module("index_app", ["ngRoute"])

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


app.controller("indexController", ["$scope", "$rootScope", "$location", function($scope, $rootScope, $location) {

    scope = $scope;
    $scope.selectedTab = 0
    $scope.posts = []

    function hexToBase64(str) {
        return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }

    // $("#loading-image").bind('ajaxStart', function() {
    //     $(this).show();
    // }).bind('ajaxStop', function() {
    //     $(this).hide();
    // })

    // AJAX POST TO SERVERg]

    var url = "https://localhost:8000/getPosts";
    $("#loading-icon").show()
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            console.log("completed AJAX call")
            var items = JSON.parse(data);
            var soldItems;
            var expiredItems;
            console.log(items);
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                // console.log( "Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
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
                    // WORKING SNIPPET
                    // var binary = '';
                    // var bytes = new Uint8Array(items[i].img.data.data);
                    // var len = bytes.byteLength;
                    // for (var j = 0; j < len; j++) {
                    //     binary += String.fromCharCode(bytes[j]);
                    // }
                    // END WORKING SNIPPET


                    // NOTE: EITHER ONE OF THE BELOW LINES WORK, SHOULD BE TESTED FOR SPEED
                    // var b64 = btoa(binary);
                    var b64 = base64ArrayBuffer(items[i].img.data.data)

                    // var raw = String.fromCharCode.apply(null, items[i].img.data.data)

                    // var b64=btoa(raw)
                    var dataURL = "data:image/jpeg;base64," + b64;

                    // if (items[i].img.compressed != null) {
                    //     items[i]["src"] = items[i].img.compressed;
                    // }
                    // else {
                    //     items[i]["src"] = dataURL;
                    // }
                    items[i]["src"] = dataURL;


                    // items[i]["src"] = 'data:image/jpeg;base64,' + items[i].img.data.data;
                    // items[i]["src"] = items[i].img.data.data;
                }
                if (items[i].sold == true) {
                    soldItems.push(items[i]);
                }
                if (items[i].expired == true) {
                    expiredItems.push(items[i]);
                }
            }
            $scope.posts = items;
            $scope.soldItems = soldItems;
            $scope.expiredItems = expiredItems;

            console.log($scope.posts)

            $("#loading-icon").hide();
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });





    // get all the accounts for all posts
    var accountUrl = "https://localhost:8000/getAccountsForPosts";

    $scope.accounts = []

    $.ajax({
        url: accountUrl,
        type: 'GET',
        success: function(data) {
            var accounts = JSON.parse(data)
            $scope.accounts = accounts;
            console.log($scope.accounts)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.notificationLength = 0;

// AJAX POST TO SERVER
    var notificationUrl = "https://localhost:8000/getNotifications";
    var userID = localStorage.getItem("curUserID")
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


    // mark all the notifications as read
    scope.markRead = function() {
        // AJAX POST TO SERVER
        var readurl = "https://localhost:8000/markRead";
        var userID = localStorage.getItem("curUserID")
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

    $scope.targetPost = null;

    // HANDLE ROUTING
    // $rootScope.$on('$routeChangeStart', function(e, current, pre) {
    //     console.log('Current route name: ' + $location.path());
    //     var path = $location.path().substring(1, $location.path().length)
    //     console.log(path)
    //     console.log(e)
    //     console.log(current)

    //     var foundItem = false;

    //     // can make this a param in url instead of part of path (?itemId = 123)

    //     // if item is in database, display that webpage
    //     for (var i = 0; i < $scope.posts.length; i++) {
    //         var post = $scope.posts[i]
    //         var postId = post["_id"]
    //         console.log(postId)
    //         console.log(path)
    //         if (path == postId) {
    //             $scope.targetPost = post;
    //             foundItem = true;
    //             $location.path("/" + path)
    //             // $scope.$apply()
    //             break;
    //         }
    //     }

    //     // otherwise, go back to home page
    //     if (!foundItem) {
    //         console.log("Going back to home page")
    //         $location.path('/')
    //     }
    // });
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
            var userID = localStorage.getItem("curUserID")
            var amountToCharge = $scope.amountToCharge;
            var itemTitle = $scope.itemTitle;
            var itemID = $scope.itemID;
            var amountRaised = $scope.amountRaised;
            var price = $scope.price;

            if (userID != null) {
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

                        for (var i = 0; i < $scope.posts.length; i++) {
                            post = $scope.posts[i]
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

}])


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
    },

    // inWeeks: function(d1, d2) {
    //     var t2 = d2.getTime();
    //     var t1 = d1.getTime();

    //     return parseInt((t2-t1)/(24*3600*1000*7));
    // },

    // inMonths: function(d1, d2) {
    //     var d1Y = d1.getFullYear();
    //     var d2Y = d2.getFullYear();
    //     var d1M = d1.getMonth();
    //     var d2M = d2.getMonth();

    //     return (d2M+12*d2Y)-(d1M+12*d1Y);
    // },

    // inYears: function(d1, d2) {
    //     return d2.getFullYear()-d1.getFullYear();
    // }
}


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

// /* Create Tabs */

// $(document).ready(function(){
//     $("#login").click(function(){
//         $(".content").load("./login.html .content");
//         console.log("here");
//         return false;
//     });

//     $("#about").click(function(){
//         $(".content").load("./about.html .content");
//         return false;
//     });

//     $("#sell").click(function(){
//         $(".content").load("./sell.html .content");
//         return false;
//     });

//     $("#contact").click(function(){
//         $(".content").load("./contact.html .content");
//         return false;
//     });

//     $("#home").click(function(){
//         $(".content").load("./index.html .content");
//         return false;
//     });
// });




// function myFunction() {
//     console.log('testme');

//     var handler = StripeCheckout.configure({
//     key: 'pk_test_I1JByOdv34UVHxZhjKYlKGc4',
//     image: '/square-image.png',
//     token: function(token, args) {
//       // Use the token to create the charge with a server-side script.
//       // You can access the token ID with `token.id`
//       console.log(token)
//       $.ajax({
//           url: 'link/to/php/stripeDonate.php',
//           type: 'post',
//           data: {tokenid: token.id, email: token.email, donationAmt: donationAmt},
//           success: function(data) {
//             if (data == 'success') {
//                 console.log("Card successfully charged!");
//             }
//             else {
//                 console.log("Success Error!");
//             }

//           },
//           error: function(data) {
//             console.log("Ajax Error!");
//             console.log(data);
//           }
//         }); // end ajax call
//     }
//   });

// }









// // For Facebook login

// // Facebook Javascript SDK configuration and setup
// window.fbAsyncInit = function() {
//     FB.init({
//         appId: '228917890846081',
//         xfbml: true,
//         cookie: true,
//         version: 'v2.8'
//     });

//     // Check whether the user already logged in
//     FB.getLoginStatus(function(response) {
//         if (response.status === 'connected') {
//             //display user data
//             getFbUserData();
//             console.log("Logged in");
//             // Get and display the user profile data
//             // document.getElementById('fbLink').setAttribute("onclick","fbLogout()");
//             // document.getElementById('fbLink').innerHTML = 'Facebook Logout';
//         } else {
//             console.log('Not logged in');
//         }
//     });
// };

// // Load the Javascript SDK asynchronously

// (function(d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {
//         return;
//     }
//     js = d.createElement(s);
//     js.id = id;
//     js.src = "https://connect.facebook.net/en_US/all.js";
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));


// // Facebook login with JavaScript SDK
// function fbLogin() {


//     var window = FB.login(function(response) {
//         if (response.authResponse) {
//             // Get and display the user profile data
//             document.getElementById('fbLink').setAttribute("onclick", "fbLogout()");
//             document.getElementById('fbLink').innerHTML = 'Facebook Logout';
//             getFbUserData();
//             window.focus();
//         } else {
//             document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
//         }
//     }, {
//         scope: 'email'
//     });
// }

// function saveUserData(response) {

//     var url = "https://localhost:8000/createUser";

//     data = {
//         name: response.first_name + ' ' + response.last_name,
//         fbid: response.id,
//         url: response.picture.data.url,
//         email: response.email,
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




// // Fetch the user profile data from facebook
// function getFbUserData() {
//     FB.api('/me', {
//             locale: 'en_US',
//             fields: 'id,first_name,last_name,email,link,gender,locale,picture'
//         },
//         function(response) {

//             // document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.first_name + '!';
//             // document.getElementById('userData').innerHTML = '<p><b>FB ID:</b> '+response.id+'</p><p><b>Name:</b> '+response.first_name+' '+response.last_name+'</p><p><b>Email:</b> '+response.email+'</p><p><b>Gender:</b> '+response.gender+'</p><p><b>Locale:</b> '+response.locale+'</p><p><b>Picture:</b> <img src="'+response.picture.data.url+'"/></p><p><b>FB Profile:</b> <a target="_blank" href="'+response.link+'">click to view profile</a></p>';

//             localStorage.setItem("curUserID", response.id);
//             // Save user data
//             saveUserData(response);
//         });
// }

// // Logout from facebook
// function fbLogout() {

//     //delete local storage
//     delete localStorage.curUserID;

//     FB.logout(function() {
//         document.getElementById('login').setAttribute("onclick", "fbLogin()");
//         document.getElementById('login').innerHTML = 'Facebook Login';
//         document.getElementById('userData').innerHTML = '';
//         document.getElementById('status').innerHTML = 'You have successfully logout from Facebook.';
//     });
// }

/* For notifications */

var check = false;

$(document).ready(function() {
    $("#notifications").click(function() {
        if (!check) {
            $("#notificationContainer").fadeIn(300);
            // $("#notification_count").fadeOut("slow");
            check = true;
        }
        else {
            $("#notificationContainer").fadeOut(300);
            scope.markRead();
            check = false;
        }

        return false;
    });

    //Document Click hiding the popup
    $(document).click(function() {
        $("#notificationContainer").hide();
        if (check) {
            scope.markRead();
        }
        check = false;
    });

    // //Popup on click
    // $("#notificationContainer").click(function() {
    //     return false;
    // });

});

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