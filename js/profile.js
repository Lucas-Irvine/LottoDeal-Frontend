/* JS for the tabs */
$(document).ready(function() {
    $(".btn-pref .btn").click(function() {
        $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-primary");
    });
});



// copied from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function updateSettings() {
    var email = $("#newEmail").val();

    if (validateEmail(email)) {

        var url = "https://localhost:8000/updateSettings";

        console.log("updating your settings")

        var userID = localStorage.getItem("curUserID");



        data = {
            email: email,
            userID: userID,
        }

        // AJAX POST TO SERVER
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data)
            },
            error: function(response, error) {
                console.log(response)
                console.log(error)
            }
        });
    } else {
        alert("Not a valid email address");
    }
}


var app = angular.module("profile_app", ["ngRoute"])

app.controller("profileController", ["$scope", "$rootScope", "$location", function($scope, $rootScope, $location) {
    $scope.selectedTab = 0

    $scope.bids = []
    $scope.items = []
    $scope.listedItems = []


    var url = "https://localhost:8000/getBidsofUsers";

    // AJAX POST TO SERVER for bids
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for Bids')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var bids = JSON.parse(data)
            if (bids.length != 0) {
                $scope.bids = bids;
                console.log($scope.bids)
                $scope.$apply()
            } else {
                document.getElementById('BidCount').innerHTML = "No Bids Yet";
            }
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    // AJAX POST TO SERVER for bidded items
    var url = "https://localhost:8000/getBiddedItemsofUsers";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for Items')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log("Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
            
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
            }
            $scope.items = items;
            console.log($scope.items)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    // AJAX POST TO SERVER for listed items
    var url = "https://localhost:8000/getListedItemsForUsers";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for ListedItems')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log("Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
            
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



            }
            $scope.listedItems = items;
            console.log($scope.listedItems)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.soldItems = []


    // AJAX POST TO SERVER for sold items
    var url = "https://localhost:8000/getSoldItemsForUsers";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for SoldItems')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log("Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
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
            }
            $scope.soldItems = items;
            console.log($scope.soldItems)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });


    //Start reviews
    $scope.reviews = []

    // AJAX POST TO SERVER for reviews
    var url = "https://localhost:8000/getReviews";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        sellerID: userID
    }
    console.log('Asking for Reviews')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
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
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.reviewers = []

    // AJAX POST TO SERVER for reviews
    var url = "https://localhost:8000/getReviewerImagesandNames";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for Reviewers')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)
            $scope.reviewers = items;
            console.log($scope.reviewers)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });



    $scope.account = []

    // AJAX get TO SERVER for account
    var url = "https://localhost:8000/getAccount";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for account info')

    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var account = JSON.parse(data)
            console.log("Here's your account for another user" + account)



            document.getElementById('profileName').innerHTML = account.fullName;
            document.getElementById('profileImage').src = account.pictureURL;
            document.getElementById('profileImageBackground').src = account.pictureURL;
            console.log(account.pictureURL);
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

                var average = total / length;
                var averageRounded = Math.round(average * 10) / 10
            } else {
                document.getElementById('averageRating').innerHTML = "No Ratings Yet";
            }

            var account = {
                averageRating: averageRounded,
            }

            $scope.account = account;
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });



    $scope.account = []

    // AJAX get TO SERVER for account
    var url = "https://localhost:8000/getAccount";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for account info')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var account = JSON.parse(data)
            console.log("Here's your account" + account)

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

                var average = total / length;
                var averageRounded = Math.round(average * 10) / 10
            }

            var reviewData = {
                averageRating: averageRounded,
            }

            $scope.reviewData = reviewData;
            $scope.account = account;
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.targetPost = null;

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
}

// -------------------- For Facebook login -----------------------------------------

// Facebook Javascript SDK configuration and setup
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
            console.log('you are logged in');
        } else {
            console.log('Not logged in');
        }
    });
};

// Load the Javascript SDK asynchronously

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
