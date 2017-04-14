var app = angular.module("index_app", [])

app.controller("indexController", function($scope) {
	$scope.selectedTab = 0

	$scope.posts = []

	var url = "https://localhost:8000/getPosts";


    console.log('test')

    // AJAX POST TO SERVER
    $.ajax({
    	url: url,
    	type: 'GET',
    	success: function(data) {
            var items = JSON.parse(data)
            $scope.posts = items;
            console.log($scope.posts)
            $scope.$apply()
        },
        error: function(response, error) {
          console.log(response)
          console.log(error)
      }
  });
    

    $scope.bid = function (event) {
        console.log('hi')
        console.log(event)

        var url = "https://localhost:8000/addBid";
        var userID = localStorage.getItem("curUserID")
        if (userID != null) {
            data = {
               itemID: event,
               userID: userID,
               newAmount: 4
           }

           $.ajax({
            url: url,
            data: data,
            type: 'POST',
            success: function(data) {
                console.log('Bid added for ' + event)
            },
            error: function(response, error) {
                console.log(response)
                console.log(error)
            }
        });

       }
       else {
        console.log('UserID is null')
    }

}

})	

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
