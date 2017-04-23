var app = angular.module("index_app", ["ngRoute"])

// app.config(function($routeProvider) {
//     $routeProvider
//     .when('/', {
//         templateUrl: 'pages/template.html',
//         controller: 'indexController',
//         reloadOnSearch: false,
//     })
//     .otherwise({
//         templateUrl: 'pages/item.html',
//         controller: 'indexController',
//         reloadOnSearch: false,
//     })
// })

// app.run(['$rootScope', '$location', '$routeParams', function($rootScope, $location, $routeParams) {
//     $rootScope.$on('$routeChangeStart', function(e, current, pre) {
//         console.log('Current route name: ' + $location.path());
//         var path = $location.path().substring(1, $location.path().length)
//         console.log(path)
//         console.log(e)
//         console.log(current)
//         console.log(pre)


//         // if item is in database, display that webpage



//         // otherwise, go back to home page


//     });
// }])




app.controller("indexController", ["$scope", "$rootScope", "$location", function($scope, $rootScope, $location) {
    $scope.selectedTab = 0

    $scope.posts = []

    var url = "https://localhost:8000/getPosts";


    function hexToBase64(str) {
        return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }

    // $("#loading-image").bind('ajaxStart', function() {
    //     $(this).show();
    // }).bind('ajaxStop', function() {
    //     $(this).hide();
    // })










    // AJAX POST TO SERVER
    $("#loading-icon").show()
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log( "Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
                // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)
                
                var image = items[i].img;
                if (image == null) {
                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
                }
                else {
                    console.log(items[i])
                    console.log(items[i].img.data)

                    var raw = String.fromCharCode.apply(null, items[i].img.data.data)

                    var b64=btoa(raw)
                    var dataURL = "data:image/jpeg;base64," + b64;

                    items[i]["src"] = dataURL;


                    // items[i]["src"] = 'data:image/jpeg;base64,' + items[i].img.data.data;
                    // items[i]["src"] = items[i].img.data.data;
                }

                console.log(items[i])
                //items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)
            }
            $scope.posts = items;
            console.log($scope.posts)

            $("#loading-icon").hide();


            $scope.$apply()
        },
        error: function(response, error) {
          console.log(response)
          console.log(error)
      }
    });


    $scope.accounts = []
    for (var i = 0; i < $scope.posts.length; i++) {
         // AJAX get TO SERVER for account
        var url = "https://localhost:8000/getAccount";
        var userID = $scope.posts[i].sellerID
        var dataGET = {
            userID: userID
        }
        console.log('Asking for account info for each seller')
        
        $.ajax({
            url: url,
            data: dataGET,
            type: 'GET',
            success: function (data) {
                var account = JSON.parse(data);
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
                
                $scope.accounts.push(account);
                $scope.$apply()
            },
            error: function (response, error) {
                console.log(response)
                console.log(error)
            }
        });

    }



    // AJAX POST TO SERVER
    var notificationUrl = "https://localhost:8000/getNotifications";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
            userID : userID
        }
    console.log('Asking for notifications')
    $.ajax({
        url: notificationUrl,
        // data: { 
        //     userID : 'test'
        // },
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var notifications = JSON.parse(data)
            $scope.notifications = notifications;
            console.log($scope.notifications)
            $scope.$apply()
        },
        error: function(response, error) {
          console.log(response)
          console.log(error)
      }
    });


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


    $scope.bid = function (itemID, amount, amountRaised, price, itemTitle) {

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
        }
        else {
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
                    action: function(dialogRef){    
                        dialogRef.close();
                    }
                }]
            });
            
        }
        


        



        // $.ajax({
        //     url: url,
        //     data: data,
        //     type: 'POST',
        //     success: function(data) {
        //         console.log('Bid added for ' + event)
        //     },
        //     error: function(response, error) {
        //         console.log(response)
        //         console.log(error)
        //     }
        // });




        // ADD BID TO DATABASE
    //     console.log("Adding bid for item " + event + " for " + amount)


    //     var url = "https://localhost:8000/addBid";
    //     var userID = localStorage.getItem("curUserID")

    //     if (userID != null) {
    //         data = {
    //            itemID: event,
    //            userID: userID,
    //            newAmount: Number(amount)
    //        }

    //        $.ajax({
    //         url: url,
    //         data: data,
    //         type: 'POST',
    //         success: function(data) {
    //             console.log('Bid added for ' + event)
    //         },
    //         error: function(response, error) {
    //             console.log(response)
    //             console.log(error)
    //         }
    //     });

    //    }
    //    else {
    //     console.log('UserID is null')
    // }

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
        return (parseInt((t2-t1)/(3600*1000))) % 24;
    },

    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        if (t2 == null || t1 == null) {
            return 0
        }
        return parseInt((t2-t1)/(24*3600*1000));
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
