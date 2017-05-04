angular.module('serverModule', [])
.service('serverGet', serverGet)
.service('serverPost', serverPost);

function serverGet() {
	this.getPosts = function() {

	}

	this.getNotifications = function(userID, $scope) {
		var notificationUrl = "https://localhost:8000/getNotifications";
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
	}

	this.testFunction = function() {
		console.log("this function is working");
	}
}

function serverPost() {
	this.testFunction = function() {
		console.log("this function is working")
	}
}
