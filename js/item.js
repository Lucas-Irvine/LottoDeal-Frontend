var app = angular.module("item_app", ["ngRoute"])

app.controller("itemController", ["$scope", "$rootScope", "$location", "$routeParams", function($scope, $rootScope, $location, $routeParams) {
    var searchObject = $location.search();
    var id = searchObject['id'];
    console.log(id);
    console.log($routeParams)
    console.log($routeParams.id)

    console.log(searchObject);

    //console.log($location.search('id'));
}]) 

