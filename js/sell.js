var app = angular.module("app", []);


var scope;


console.log(userID);


app.controller("sellController", ["$scope", "$http", "$location",  function($scope, $http, $location) {
    console.log("got here")
    scope = $scope;
    // var sellerID = localStorage.getItem("curUserID");
    console.log(userID);
    var sellerID = userID;
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


    $scope.notificationLength;


    // AJAX POST TO SERVER
    var notificationUrl = "https://localhost:8000/getNotifications";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for notifications')
    $.ajax({
        url: notificationUrl,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var notifications = JSON.parse(data)
            $scope.notifications = notifications;
            var counter = 0;
            for (var i = 0;i < notifications.length; i++) {
            	if (notifications[i].read == false) counter++;
            }
            $scope.notificationLength = counter;

            console.log($scope.notifications)
            console.log("hi")
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });


	// mark all the notifications as read
	scope.markRead = function() {
		// AJAX POST TO SERVER
	    var readurl = "https://localhost:8000/markRead";
	    var userID = localStorage.getItem("curUserID")
	    var data = {
	        userID: userID
	    }
	    console.log('Asking for notifications')
	    $.ajax({
	        url: readurl,
	        data: data,
	        type: 'GET',
	        success: function(data) {
	            var notifications = JSON.parse(data)


	            $scope.notificationLength = 0;


	            $scope.notifications = notifications;
	            console.log($scope.notifications)
	            console.log("updated the notifications")
	            $scope.$apply()
	        },
	        error: function(response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
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



var check = false;

$(document).ready(function() {
    $("#notifications").click(function() {
    	if (!check) {
    		$("#notificationContainer").fadeIn(300);
    		// $("#notification_count").fadeOut("slow");
    		check = true;
    	}
    	else {
    		$("#notificationContainer").fadeOut(300);
    		scope.markRead();
    		check = false;
    	}

        return false;
    });

   	//Document Click hiding the popup
    $(document).click(function() {
        $("#notificationContainer").hide();
        if (check) {
        	scope.markRead();
        }
        check = false;
    });

    // //Popup on click
    // $("#notificationContainer").click(function() {
    //     return false;
    // });

});