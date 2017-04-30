var app = angular.module("app", []);


var scope;


app.controller("sellController", ["$scope", "$http", "$location",  function($scope, $http, $location) {
    console.log("got here")
    scope = $scope;
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


    $scope.notificationLength = 0;


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

            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            var curDate = new Date();

            for (i = 0; i < notifications.length; i++) {

                var date = new Date(notifications[i].datePosted);

                var hoursAgo = Math.abs(DateDiff.inHours(curDate, date));

                if (hoursAgo < 24) {
                    if (hoursAgo == 0) {
                        notifications[i].datePosted = "Just Now";
                    }
                    else if (hoursAgo == 1) {
                        notifications[i].datePosted = hoursAgo + " hour ago";
                    }
                    else {
                        notifications[i].datePosted = hoursAgo + " hours ago";
                        console.log(notifications[i].datePosted);
                    }
                }

                else {
                    var month = date.getMonth();
                    var day = date.getDate();

                    /* code taken from http://stackoverflow.com/questions/8888491/
                     how-do-you-display-javascript-datetime-in-12-hour-am-pm-format */

                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? '0'+ minutes : minutes;
                    var strTime = hours + ':' + minutes + ' ' + ampm;

                    /* --------- */

                    var newDate = monthNames[month] + " " + day + " at " + strTime;
                    notifications[i].datePosted = monthNames[month] + " " + day + " at " + strTime;
                    console.log(newDate);
                }
                if (!notifications[i].read) {
                    $scope.notificationLength++;
                }
            }

            $scope.notifications = notifications;
            console.log($scope.notifications)
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

                var monthNames = [
                    "January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"
                ];

                var curDate = new Date();

                for (i = 0; i < notifications.length; i++) {

                    var date = new Date(notifications[i].datePosted);

                    var hoursAgo = Math.abs(DateDiff.inHours(curDate, date));

                    if (hoursAgo < 24) {
                        if (hoursAgo == 0) {
                            notifications[i].datePosted = "Under an hour ago";
                        }
                        else if (hoursAgo == 1) {
                            notifications[i].datePosted = hoursAgo + " hour ago";
                        }
                        else {
                            notifications[i].datePosted = hoursAgo + " hours ago";
                            console.log(notifications[i].datePosted);
                        }
                    }

                    else {
                        var month = date.getMonth();
                        var day = date.getDate();

                        /* code taken from http://stackoverflow.com/questions/8888491/
                         how-do-you-display-javascript-datetime-in-12-hour-am-pm-format */

                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var ampm = hours >= 12 ? 'pm' : 'am';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        minutes = minutes < 10 ? '0'+ minutes : minutes;
                        var strTime = hours + ':' + minutes + ' ' + ampm;

                        /* --------- */

                        var newDate = monthNames[month] + " " + day + " at " + strTime;
                        notifications[i].datePosted = monthNames[month] + " " + day + " at " + strTime;
                        console.log(newDate);
                    }
                }

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