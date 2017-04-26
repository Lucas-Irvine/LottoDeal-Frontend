var app = angular.module("item_app", ["ngRoute"])

$('#myTabs a').click(function(e) {
    console.log('tab clicked');
    e.preventDefault()
    $(this).tab('show')
});

app.controller("itemController", ["$scope", "$rootScope", "$location", "$routeParams", function($scope, $rootScope, $location, $routeParams) {
    var searchObject = $location.search();
    var id = searchObject['id'];
    console.log(id);


    $scope.post = null;

    var url = "https://localhost:8000/getItem"




    $.ajax({
        url: url,
        type: 'GET',
        data: {
            id: id
        },
        statusCode: {
            404: function(response) {
                var newDoc = document.open("text/html", "replace");
                newDoc.write(myString);
                newDoc.close();
            }
        },
        success: function(data) {
            console.log(data["_id"])
            var parsed = JSON.parse(data)

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

                var b64 = base64ArrayBuffer(parsed.img.data.data);
                var dataURL = "data:image/jpeg;base64," + b64;

                parsed["src"] = dataURL;
            }


            $scope.post = parsed;






            $scope.$apply();
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });



    /* ADD BID FUNCTIONALITY HERE */
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


                        post = $scope.post
                        console.log(itemID)
                        if (post["_id"] == itemID) {
                            var newPrice = post.amountRaised + amountToCharge;
                            post.amountRaised = newPrice;
                            post.percentageRaised = (newPrice / post.price) * 100;
                            break;
                        }

                        $scope.$apply()

                        // DISPLAY BID ON FRONT-END
                        // var progressbar = $("#progress-bar-" + itemID)
                        // // console.log(progressbar)
                        // var currentAmount = progressbar.css("width")
                        // // console.log(currentAmount)
                        // var totalWidth = (parseInt(currentAmount.substring(0, currentAmount.length - 2)) * parseInt(price)) / parseInt(amountRaised)
                        // var percentage = progressbar.width() / progressbar.parent().width() * 100
                        // var newAmount = parseInt(amountRaised) + parseInt(amountToCharge)
                        // // console.log(newAmount)
                        // var newPercent = ((newAmount * 1.0) / (parseInt(price) * 1.0))
                        // // console.log(newPercent)
                        // // var newWidth = progressbar.parent().width() * newPercent
                        // var newWidth = totalWidth * newPercent
                        // // console.log("newwidth: " + newWidth)
                        // var pixelWidth = ""  + newWidth + "px"
                        // progressbar.css("width", pixelWidth)

                        // // change the amount raised
                        // var amountText = $("#amountRaised-" + itemID)
                        // // console.log(amountText)
                        // amountText.text("$" + newAmount + " of $" + price + " raised")
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
        console.log('initiating bid');
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