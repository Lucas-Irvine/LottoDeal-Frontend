var app = angular.module("item_app", ["serverModule"])



$('#myTabs a').click(function(e) {
    console.log('tab clicked');
    e.preventDefault()
    $(this).tab('show')
});

var sellerID;
var userID;
var accessToken;
var scope;

//Code modified from https://www.w3schools.com/howto/howto_js_tabs.asp
function changeTab(titleID, id) {
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
}



app.controller("itemController", ["$scope", "$location", "serverGet", "serverPost", function($scope, $location, serverGet, serverPost) {
    var searchObject = $location.search();
    var id = searchObject['id'];
    console.log(id);

    scope = $scope;


    window.fbAsyncInit = function() {

        FB.init({
            appId: '228917890846081',
            status: true,
            cookie: true,
            xfbml: true
        });
        FB.getLoginStatus(function(response) {
            userID = response.authResponse.userID;
            sellerID = sellerID;
            // check if user can edit
            if (sellerID == userID) {
                console.log("matches")
                $scope.canEdit = true;

            } else {
                console.log(userID + "cannot edit this post");
            }

            accessToken = response.authResponse.accessToken;
            console.log('setting the access token to: ' + accessToken)
            console.log(response);
            console.log(userID + "saving UserID as a global variable when logging in ")
            getSuggestions();
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

    // $scope.post = null;

    function getSuggestions() {
        serverGet.getSuggestions(accessToken, $scope)
    }


    var itemIDs = [];

    scope.markRead = function() {
        serverGet.markRead(userID, $scope);
    }

    
    var userid = userID;
    // console.log(userid)

    $scope.canEdit = false;


    $scope.editing = false;


    serverGet.getItem(id, $scope);



    // var handler = StripeCheckout.configure({
    //     key: 'pk_test_I1JByOdv34UVHxZhjKYlKGc4',
    //     image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    //     locale: 'auto',
    //     token: function(token) {
    //         console.log('attempting stripe payment')
    //         var amountToCharge = $scope.amountToCharge;
    //         var itemTitle = $scope.itemTitle;
    //         var itemID = $scope.itemID;
    //         var amountRaised = $scope.amountRaised;
    //         var price = $scope.price;

    //         if (accessToken != undefined) {
    //             data = {
    //                 itemID: itemID,
    //                 itemTitle: itemTitle,
    //                 accessToken: accessToken,
    //                 stripeToken: token.id,
    //                 amount: Number(amountToCharge)
    //             }
    //             $.ajax({
    //                 url: 'https://localhost:8000/performPaymentAndAddBid',
    //                 data: data,
    //                 type: 'POST',
    //                 success: function(data) {
    //                     console.log('success payment and bid added')
    //                     console.log(data);

    //                     post = $scope.post
    //                     console.log(itemID)
    //                     if (post["_id"] == itemID) {
    //                         var newPrice = post.amountRaised + amountToCharge;
    //                         post.amountRaised = newPrice;
    //                         post.percentageRaised = (newPrice / post.price) * 100;
    //                     }

    //                     $scope.$apply()

    //                 },
    //                 error: function(response, error) {
    //                     console.log(response)
    //                     console.log(error)
    //                 }
    //             });

    //         } else {
    //             document.getElementById('loginMessage').innerHTML = 'You must login before you are able to bid on an item!';
    //             showLoginPopup();
    //             console.log('UserID is undefined')
    //         }
    //     }
    // });



    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {
        serverPost.bid(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document);
        // console.log('initiating bid');
        // $scope.price = price;
        // $scope.amountToCharge = amount;
        // $scope.itemID = itemID
        // $scope.itemTitle = itemTitle
        // $scope.amountRaised = amountRaised

        // if (accessToken != undefined) {

        //     if (price >= amountRaised + amount) {
        //         handler.open({
        //             name: 'LottoDeal',
        //             description: 'Bid on ' + itemTitle,
        //             amount: amount * 100
        //         });
        //     } else {
        //         console.log('Bid overpasses item price!');
        //         BootstrapDialog.show({
        //             title: 'Bid surpasses item price',
        //             message: 'Choose a lower bid or search for similar items',
        //             buttons: [{
        //                 id: 'btn-ok',
        //                 icon: 'glyphicon glyphicon-check',
        //                 label: 'OK',
        //                 cssClass: 'btn-primary',
        //                 data: {
        //                     js: 'btn-confirm',
        //                     'user-id': '3'
        //                 },
        //                 autospin: false,
        //                 action: function(dialogRef) {
        //                     dialogRef.close();
        //                 }
        //             }]
        //         });
        //     }
        // } else {
        //     document.getElementById('loginMessage').innerHTML = 'You must login before you are able to bid on an item!';
        //     showLoginPopup();
        //     console.log('UserID is undefined')
        // }
    }

    $scope.deleteItem = function() {
        serverPost.deleteItem(id, accessToken, $scope)
        // BootstrapDialog.show({
        //     title: 'Are you sure you would like to delete this item?',
        //     message: 'This cannot be undone',
        //     buttons: [{
        //         id: 'btn-1',
        //         label: 'Delete Item',
        //         action: function(dialog) {
        //             var $button = this; // 'this' here is a jQuery object that wrapping the <button> DOM element.
        //             $button.disable();
        //             $button.spin();
        //             dialog.setClosable(false);
        //             $.ajax({
        //                 url: 'https://localhost:8000/deleteItem',
        //                 data: {
        //                     accessToken: accessToken,
        //                     id: id
        //                 },
        //                 type: 'DELETE',
        //                 success: function(data) {
        //                     console.log('Success deleting item')
        //                     var $footerButton = dialog.getButton('btn-1');
        //                     $footerButton.enable();
        //                     $footerButton.stopSpin();
        //                     dialog.setClosable(true);
        //                     dialog.close();
        //                     window.location.href = 'https://dominicwhyte.github.io/LottoDeal-Frontend/index.html';
        //                 },
        //                 error: function(response, error) {
        //                     console.log('Error deleting item')
        //                     var $footerButton = dialog.getButton('btn-1');
        //                     $footerButton.enable();
        //                     $footerButton.stopSpin();
        //                     dialog.setClosable(true);
        //                 }
        //             });


        //         }
        //     }]
        // });
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