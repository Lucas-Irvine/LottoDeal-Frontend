var app = angular.module("item_app", ["ngRoute"])

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
        success: function(data) {
            console.log(data)
            console.log(data["_id"])
            var parsed = JSON.parse(data)
            console.log(parsed)

            // amount raised
            parsed.percentageRaised = (Number(parsed.amountRaised) / Number(parsed.price)) * 100;
            console.log( "Raised" + parsed.percentageRaised);
            var expirationDate = new Date(parsed.expirationDate);
            var date = new Date();
            parsed.expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";




            var image = parsed.img;
            if (image == null) {
            	parsed["src"] = "http://placehold.it/320x150"
            }
            else {
            	console.log(parsed)
                console.log(parsed.img)

                var raw = String.fromCharCode.apply(null, parsed.img.data.data)

                var b64=btoa(raw)
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
	    }
	};


    // console.log($routeParams)
    // console.log($routeParams.id)

    // console.log(searchObject);

    // console.log($location.search('id'));
}]) 

