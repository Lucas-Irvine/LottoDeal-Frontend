

var app = angular.module("app", ['serverModule']);




app.controller("sellController", ["$scope", "$http", "$location", "serverGet",  function($scope, $http, $location, serverGet) {

    console.log("got here")
    scope = $scope;

    serverGet.testFunction();
    
    // var sellerID = userID;
    // console.log("hello its" + sellerID);

    //var sellerID = localStorage.getItem("curUserID");
    // $("#userid").val(sellerID)
   // console.log(sellerID)

    $scope.id = null;

    var searchObject = $location.search();
    var value = searchObject["value"]
    var id = searchObject["id"]
    $location.url("");
    console.log('test');
    if (value == null) {
        console.log("No value returned");
    }
    else if (value == "success") {
    	console.log(value);
        console.log("Successful item creation!");
        $("#postCreatedModal").modal()
        $scope.id = id;
    }
    else {
  		$("#invalidFormModal").modal();
    }



    $scope.changeURL = function() {
    	$location.url("");
    }


    $scope.notificationLength = 0;


    scope.getNotifications = function(accessToken) {
        serverGet.getNotifications(accessToken, $scope);

    }


	scope.markRead = function() {
        serverGet.markRead(accessToken, $scope);
    }


	$scope.debugSubmit = function() {
		var testUrl = "http://162.243.121.223:8000/debugPost"
        var sellerID = "10208239805023661";
//		var sellerID = localStorage.getItem("curUserID")

		var data = {
			title: "Test Item",
			price: "5",
			longDescription: "This is a great item, with the following features: \
			- Great \
			- Awesome \
			- Cool \
			- Amazing \
			You should buy it!",
			shortDescription: "This is a short description for a great product.",
			expirDate: "1",
			userID: sellerID,
		}

		$.ajax({
		    url: testUrl,
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
	}
	
	
}])






/* code taken from http://stackoverflow.com/questions/12368910/html-display-image-after-selecting-filename */

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageUploaded')
                .attr('src', e.target.result)
                .width(150)
                .height(100);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$("#itemPicture").change(function(){
    readURL(this);
});
