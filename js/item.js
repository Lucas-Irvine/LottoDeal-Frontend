var app = angular.module("item_app", ["ngRoute"])

app.controller("itemController", ["$scope", "$rootScope", "$location", "$routeParams", function($scope, $rootScope, $location, $routeParams) {
    var searchObject = $location.search();
    var id = searchObject['id'];
    console.log(id);

    var url = "https://localhost:8000/getItem"

    $.ajax({
        url: url,
        type: 'GET',
        data: {
        	id: id
        },
        success: function(data) {
            console.log(data)
        },
        error: function(response, error) {
          console.log(response)
          console.log(error)
      }
    });


    // console.log($routeParams)
    // console.log($routeParams.id)

    // console.log(searchObject);

    // console.log($location.search('id'));
}]) 

