var app = angular.module("app", []);


app.controller("sellController", ["$scope", "$http", "$location",  function($scope, $http, $location) {
    console.log("got here")
    var sellerID = localStorage.getItem("curUserID");
    $("#userid").val(sellerID)
    console.log(sellerID)

    $scope.id = null;

    var searchObject = $location.search();
    var value = searchObject["value"]
    var id = searchObject["id"]
    $location.url("");
    console.log('test');
    if (value == null) {
        console.log("No value returned");
    }
    else {
        console.log(value);
        console.log("Successful item creation!");
        $("#postCreatedModal").modal()
        $scope.id = id;
        // $scope.$apply();
    }

    $scope.changeURL = function() {
    	$location.url("");
    }

	$scope.debugSubmit = function() {
		var testUrl = "https://localhost:8000/debugPost"
		var sellerID = localStorage.getItem("curUserID")

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
	
	// //when field is entered
	// $('#price, #title, #description').bind('keyup', function() {
		
 //    if(allFilled()) {
 //    	console.log('removing attribute');
 //    	$('#submitButton').removeAttr('disabled');
 //    }
 //    else {
 //    	$('#submitButton').attr('disabled', 'disabled');
 //    }    	
	// });

	// //When file/date is chosen
	// $("#itemPicture, #expirDate").change(function(){
	// 	if(allFilled()) {
	// 	    console.log('removing attribute');
	// 	    $('#submitButton').removeAttr('disabled');
	// 	  }
	// 	  else {
	// 	  	$('#submitButton').attr('disabled', 'disabled');
	// 	  }    
	//  });


	// function allFilled() {

	//     var filled = true;
	// 	//console.log('test' + $('#expirDate').val());
	// 	var fields = ['#title', '#price', '#itemPicture', '#description', '#expirDate']; 
	// 	for (field of fields) {

 //  			if ($(field).val() == '') {
 //  				filled = false;
 //  				console.log('false!');
 //  			}
	// 	}
	//     return filled;
	// }

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


// should be in controller if used


 //    $("#submitForm").submit(function(e) {
 //    	console.log("got here")
	//     e.preventDefault();

 //    	var url = "https://localhost:8000/createPost";

	//     var price = $("#price").val()
	//     var title = $("#title").val()
	//     var description = $("#description").val()
	//     var date = new Date()
	//     var offset = $("#expirDate").val()
	//     var sellerID = localStorage.getItem("curUserID")
	//     console.log(sellerID);
	//     if (offset == 1) {
	//     	date.setDate(date.getDate() + 1); 
	//     }
	//     else if (offset == 2) {
	//     	date.setDate(date.getDate() + 7); 
	//     }
	//     else {
	//     	date.setDate(date.getDate() + 30); 
	//     }

	//     //var image = $("#itemPicture").val()

	//    // console.log(image)

	//     data = {
	//     	price: price,
	//     	title: title,
	//     	description: description,
	//     	expirationDate: date,
	//     	sellerID: sellerID
	//     	//image: image
	//     }

	//     // var formData = new FormData($(this)[0]);
	//     // var data = formData
	//     // console.log(formData)

	//     // AJAX POST TO SERVER
	//     $.ajax({
	// 	    url: url,
	// 	    type: 'POST',
	// 	    data: data,
	// 	    //data: new FormData(this),
	// 	    success: function(data) {
	// 			console.log(data)
	// 	    },
	// 	    //contentType: false,
	// 	    //processData: false,
	// 	    error: function(response, error) {
	// 			console.log(response)
	// 			console.log(error)
	// 	    }
	// 	});

	// });