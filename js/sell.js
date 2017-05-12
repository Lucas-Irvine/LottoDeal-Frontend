var app = angular.module("app", ['serverModule']);

app.controller("sellController", ["$scope", "$http", "$location", "serverGet",  function($scope, $http, $location, serverGet) {
    scope = $scope;

    $scope.id = null;

    var searchObject = $location.search();
    var value = searchObject["value"]
    var id = searchObject["id"]
    $location.url("");
    if (value == null) {
        // no value returned
    }
    else if (value == "success") {
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
