angular.module('serverModule', ['utilsModule'])
.service('serverGet', ["dateFunctions", serverGet])
.service('serverPost', serverPost);

// var prodUrl = "https://162.243.121.223:8000/";
var prodUrl = "http://162.243.121.223:8000/";

var debug = "https://localhost:8000/"


function serverGet(dateFunctions) {
	var DateDiff = dateFunctions.DateDiff; // define dateDiff

	this.getPosts = function(loadingIcon, $scope) {
		var url = prodUrl + "getPosts";
	    loadingIcon.show()
	    $.ajax({
	        url: url,
	        type: 'GET',
	        success: function(data) {
	            console.log("completed AJAX call")
	            var items = JSON.parse(data);
	            var soldItems = [];
	            var expiredItems = [];
	            var listedItems = [];
	            console.log(items);
	            for (i = 0; i < items.length; i++) {
	                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
	                // console.log( "Raised" + items[i].percentageRaised);
	                var expirationDate = new Date(items[i].expirationDate);
	                var date = new Date();
	                var hours = DateDiff.inHours(date, expirationDate)
	                var days = DateDiff.inDays(date, expirationDate)

	                if (items[i].expired) {
	                    items[i].expirationDate = "Lottery has expired!";                     
	                }
	                else if (items[i].sold) {
	                    items[i].expirationDate = items[i].winnerName;
	                }
	                else if (hours < 0 || days < 0) {
	                     items[i].expirationDate = "Negative days remaining (not expired yet)";   
	                }
	                else {
	                    items[i].expirationDate =  hours + " Hours " + days + " Days left";
	                }
	               // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)

	                var image = items[i].img;
	                if (image == null) {
	                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
	                } 
	                else if (items[i].img.compressed != null) {
	                    items[i]["src"] = items[i].img.compressed;

	                }
	                else {
	                    // WORKING SNIPPET
	                    // var binary = '';
	                    // var bytes = new Uint8Array(items[i].img.data.data);
	                    // var len = bytes.byteLength;
	                    // for (var j = 0; j < len; j++) {
	                    //     binary += String.fromCharCode(bytes[j]);
	                    // }
	                    // END WORKING SNIPPET


	                    // NOTE: EITHER ONE OF THE BELOW LINES WORK, SHOULD BE TESTED FOR SPEED
	                    // var b64 = btoa(binary);
	                    var b64 = base64ArrayBuffer(items[i].img.data.data)

	                    // var raw = String.fromCharCode.apply(null, items[i].img.data.data)

	                    // var b64=btoa(raw)
	                    var dataURL = "data:image/jpeg;base64," + b64;

	                    // if (items[i].img.compressed != null) {
	                    //     items[i]["src"] = items[i].img.compressed;
	                    // }
	                    // else {
	                    //     items[i]["src"] = dataURL;
	                    // }
	                    items[i]["src"] = dataURL;


	                    // items[i]["src"] = 'data:image/jpeg;base64,' + items[i].img.data.data;
	                    // items[i]["src"] = items[i].img.data.data;
	                }
	                if (items[i].sold == true) {
	                    soldItems.push(items[i]);
	                }
	                else if (items[i].expired == true) {
	                    expiredItems.push(items[i]);
	                }
	                else {
	                    listedItems.push(items[i]);
	                }

	            }
	            $scope.posts = listedItems;
	            $scope.soldItems = soldItems;
	            $scope.expiredItems = expiredItems;

	            console.log($scope.posts)

	            loadingIcon.hide();
	            $scope.$apply()
	        },
	        error: function(response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	this.getNotifications = function(accessToken, $scope) {

		var itemIDs = [];

		var notificationUrl = prodUrl + "getNotifications";
	    var dataGET = {
	        accessToken: accessToken
	    }
	    console.log('Asking for notifications')
	    $.ajax({
	        url: notificationUrl,
	        data: dataGET,
	        type: 'GET',
	        success: function(data) {
	            var notifications = JSON.parse(data)
	            console.log(notifications)

	            var monthNames = [
	                "January", "February", "March",
	                "April", "May", "June", "July",
	                "August", "September", "October",
	                "November", "December"
	            ];

	            var curDate = new Date();

	            for (i = 0; i < notifications.length; i++) {
	                itemIDs.push(notifications[i].itemID);
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
	                if (!notifications[i].read) {
	                    $scope.notificationLength++;
	                }

	                if (notifications[i].sold != undefined && notifications[i].sold != null && notifications[i].sold == true) {
	                	// notifications[i]["description"] = "A winner has been chosen, click to see who won!"
	                	// notifications[i]["title"] = "LottoDeal:"
	                }
	                else {
	                	notifications[i].sold = false
	                	notifications[i].winnerName = "null"
	                }

	            }

	                var getImageForNotificationsURL = prodUrl + "getImagesForNotifications";

	                var data = {
	                    itemIDs: itemIDs
	                }

	                    $.ajax({
	                    url: getImageForNotificationsURL,
	                    type: 'GET',
	                    data: data,
	                    success: function(data) {
	                        var images = JSON.parse(data)
	                        if (images.length > 5) {
	                            images = images.slice(0, 5);
	                        }
	                        $scope.images = images;
	                        console.log($scope.images)
	                        $scope.$apply()
	                    },
	                    error: function(response, error) {
	                        console.log(response)
	                        console.log(error)
	                    }
	                });




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

	this.getSuggestions = function(accessToken, $scope) {
		var suggestionsURL = prodUrl + "getSuggestions"
        if (accessToken != null) {
            $.ajax({
                url: suggestionsURL,
                type: 'GET',
                data: {
                    accessToken: accessToken
                },
                statusCode: {
                    200: function(response) {
                        $(document.body).show(); // SHOULD EDIT THIS TO BE BETTER DESIGN - WHAT IF AJAX CALL FAILS
                    },
                    404: function(response) {
                        var newDoc = document.open("text/html", "replace");
                        // console.log(response);
                        newDoc.write(response.responseText);
                        newDoc.close();
                    }
                },
                success: function(data) {
                    var parsed = JSON.parse(data)
                    //console.log(parsed)
                    console.log("retrieved suggestions")


                    $scope.suggestions = parsed;
                    $scope.$apply();
                },
                error: function(response, error) {
                    console.log(response)
                    console.log(error)
                }
            });
        } else {
            console.log("Error: userID is null");
        }
	}

	this.getItem = function(id, $scope, accessToken, userID) {
		var url = prodUrl + "getItem"

		$.ajax({
	        url: url,
	        type: 'GET',
	        data: {
	            id: id
	        },
	        statusCode: {
	            200: function(response) {
	                $(document.body).show();
	            },
	            404: function(response) {
	                var newDoc = document.open("text/html", "replace");
	                newDoc.write(response.responseText);
	                newDoc.close();
	            }
	        },
	        success: function(data) {
	            var parsed = JSON.parse(data)
	            console.log(parsed.sold)
	            //console.log(parsed);
	            //console.log(parsed._id)

	            // amount raised
	            parsed.percentageRaised = (Number(parsed.amountRaised) / Number(parsed.price)) * 100;
	            console.log("Raised" + parsed.percentageRaised);
	            var expirationDate = new Date(parsed.expirationDate);
	            var date = new Date();
	            parsed.hoursToGo = DateDiff.inHours(date, expirationDate)
	            parsed.daysToGo = DateDiff.inDays(date, expirationDate)
	            parsed.titleUppercase = parsed.title.toUpperCase();
	            sellerID = parsed.sellerID;

	            var image = parsed.img;

	            if (image == null) {
	                parsed["src"] = "http://placehold.it/320x150"
	            } else {
	                parsed["src"] = parsed.img.compressed;
	            }

	            // check if user can edit
	      //       var editUrl = "https://localhost:8000/verifyAccessToken";
	      //       $.ajax({
			    //     url: editUrl,
			    //     type: 'GET',
			    //     data: {
			    //         accessToken: accessToken
			    //     },
			    //     success: function(response) {
			    //     	if (parsed.sellerID == response) {
			    //             console.log("matches")
			    //             $scope.canEdit = true;

			    //         } else {
			    //             console.log(response + "cannot edit this post");
			    //         }

			    //         $scope.post = parsed;
			    //         $scope.$apply();
			    //     },
			    //     error: function(response, error) {
			    //     	console.log(response);
			    //     	console.log(error);
			    //     }
			    // });
	            if (parsed.sellerID == userID) {
	                console.log("matches")
	                $scope.canEdit = true;

	            } else {
	                console.log(userID + "cannot edit this post");
	            }

	            $scope.post = parsed;
	            $scope.$apply();
	        },
	        error: function(response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

    this.markRead = function(accessToken, $scope) {
    	var itemIDs = [];

    	var readurl = prodUrl + "markRead";
        // var userID = localStorage.getItem("curUserID")

        console.log(accessToken + "here's the userID in mark read");
        var data = {
            accessToken: accessToken
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

                    itemIDs.push(notifications[i].itemID);

                    var date = new Date(notifications[i].datePosted);

                    var hoursAgo = Math.abs(DateDiff.inHours(curDate, date));

                    if (hoursAgo < 24) {
                        if (hoursAgo == 0) {
                            notifications[i].datePosted = "Under an hour ago";
                        } else if (hoursAgo == 1) {
                            notifications[i].datePosted = hoursAgo + " hour ago";
                        } else {
                            notifications[i].datePosted = hoursAgo + " hours ago";
                            console.log(notifications[i].datePosted);
                        }
                    } else {
                        var month = date.getMonth();
                        var day = date.getDate();

                        /* code taken from http://stackoverflow.com/questions/8888491/
                         how-do-you-display-javascript-datetime-in-12-hour-am-pm-format */

                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var ampm = hours >= 12 ? 'pm' : 'am';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        minutes = minutes < 10 ? '0' + minutes : minutes;
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
	
	this.getAccountsForPosts = function($scope) {
		var accountUrl = prodUrl + "getAccountsForPosts";



		$scope.listedAccounts = [];
    	$scope.soldAccounts = [];
    	$scope.expiredAccounts = [];

	    $.ajax({
	        url: accountUrl,
	        type: 'GET',
	        success: function(data) {
	            var allAccounts = JSON.parse(data)
	            console.log(allAccounts);


	            $scope.listedAccounts = allAccounts.listedAccounts;
    			$scope.soldAccounts = allAccounts.soldAccounts;
    			$scope.expiredAccounts = allAccounts.expiredAccounts;


	            $scope.$apply()
	        },
	        error: function(response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}


	this.getPublicAccount = function($scope, id) {
		var url = prodUrl + "getPublicAccount";
	    var dataGET = {
	        userID: id
	    }
	    console.log('Asking for account info')
	    
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function (data) {
	            var account = JSON.parse(data)
	            console.log("Here's your account for another user" + account)

	            document.getElementById('profileName').innerHTML = account.fullName;
	            document.getElementById('profileImage').src = account.pictureURL;
	            var reviews = account.reviews;
	            var length = reviews.length;
	            var total = 0; 
	            var average = 0;
	            var averageRounded = 0;
	            if (length != 0) {
	                var total = 0; 
	                for (var i = 0; i < length; i++) {
	                    total += parseInt(reviews[i].stars);
	                }

	                var average = total/length;
	                var averageRounded = Math.round(average*10)/10
	            }

	            var account = {
	                averageRating : averageRounded,
	            }
	            
	            $scope.account = account;
	            $scope.$apply()
	        },
	        error: function (response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	this.getListedItemsForUsers = function(userID, $scope) {
		var url = prodUrl + "getListedItemsForUsers";
	    var dataGET = {
	        userID: userID
	    }
	    console.log('Asking for ListedItems')
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        statusCode: {
	            // 200: function(response) {
	            //     $(document.body).show(); // SHOULD EDIT THIS TO BE BETTER DESIGN - WHAT IF AJAX CALL FAILS
	            // },
	            404: function(response) {
	                var newDoc = document.open("text/html", "replace");
	                // console.log(response);
	                newDoc.write(response.responseText);
	                newDoc.close();
	            }
	        },
	        success: function (data) {
	            var items = JSON.parse(data)
	            console.log(items);
	            for (i = 0; i < items.length; i++) {
	                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
	                console.log( "Raised" + items[i].percentageRaised);
	                var expirationDate = new Date(items[i].expirationDate);
	                var date = new Date();
	                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
	            
	                var hours = DateDiff.inHours(date, expirationDate)
	                var days = DateDiff.inDays(date, expirationDate)

	                if (items[i].expired) {
	                    items[i].expirationDate = "Lottery has expired!";                     
	                }
	                else if (items[i].sold) {
	                    items[i].expirationDate = "Item was sold to:" + items[i].winnerName;
	                }
	                else if (hours < 0 || days < 0) {
	                     items[i].expirationDate = "Negative days remaining (not expired yet)";   
	                }
	                else {
	                    items[i].expirationDate =  hours + " Hours " + days + " Days left";
	                }
	               // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)

	                var image = items[i].img;
	                if (image == null) {
	                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
	                } 
	                else if (items[i].img.compressed != null) {
	                    items[i]["src"] = items[i].img.compressed;
	                }
	                else {
	                    var b64 = base64ArrayBuffer(items[i].img.data.data)
	                    var dataURL = "data:image/jpeg;base64," + b64;
	                    items[i]["src"] = dataURL;
	                }

	                var count = 0;
	                for (var j = 0; j < items[i].bids.length; j++) {
	                    if (accessToken == items[i].bids[j].ID) {
	                        count += items[i].bids[j].amount;
	                    }
	                }
	                items[i]["yourBids"] = count;
	            }
	            $scope.listedItems = items;
	            console.log($scope.listedItems)
	            $scope.$apply()
	        },
	        error: function (response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	this.getSoldItemsForUsers = function(userID, $scope) {
		var url = prodUrl + "getSoldItemsForUsers";
	    var dataGET = {
	        userID: userID
	    }
	    console.log('Asking for SoldItems')
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function (data) {
	            var items = JSON.parse(data)
	            for (i = 0; i < items.length; i++) {
	                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
	                console.log( "Raised" + items[i].percentageRaised);
	                var expirationDate = new Date(items[i].expirationDate);
	                var date = new Date();
	                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
	            
	                var hours = DateDiff.inHours(date, expirationDate)
	                var days = DateDiff.inDays(date, expirationDate)

	                if (items[i].expired) {
	                    items[i].expirationDate = "Lottery has expired!";                     
	                }
	                else if (items[i].sold) {
	                    items[i].expirationDate = "Item was sold to:" + items[i].winnerName;
	                }
	                else if (hours < 0 || days < 0) {
	                     items[i].expirationDate = "Negative days remaining (not expired yet)";   
	                }
	                else {
	                    items[i].expirationDate =  hours + " Hours " + days + " Days left";
	                }
	               // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)

	                var image = items[i].img;
	                if (image == null) {
	                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
	                } 
	                else if (items[i].img.compressed != null) {
	                    items[i]["src"] = items[i].img.compressed;
	                }
	                else {
	                    var b64 = base64ArrayBuffer(items[i].img.data.data)
	                    var dataURL = "data:image/jpeg;base64," + b64;
	                    items[i]["src"] = dataURL;
	                }

	                var count = 0;
	                for (var j = 0; j < items[i].bids.length; j++) {
	                    if (accessToken == items[i].bids[j].ID) {
	                        count += items[i].bids[j].amount;
	                    }
	                }
	                items[i]["yourBids"] = count;

	            }
	            $scope.soldItems = items;
	            console.log($scope.soldItems)
	            $scope.$apply()
	        },
	        error: function (response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	this.getAccount = function(accessToken, $scope) {
		var url = prodUrl + "getAccount";

	    var dataGET = {
	        accessToken: accessToken
	    }
	    console.log('Asking for account info')

	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function(data) {
	            var account = JSON.parse(data)
	            console.log("Here's your account for another user" + account)



	            document.getElementById('profileName').innerHTML = account.fullName;
	            document.getElementById('profileImage').src = account.pictureURL;
	            console.log(account.pictureURL);
	            
	            $scope.email = account.email;


	            var reviews = account.reviews;
	            var length = reviews.length;
	            var total = 0;
	            var average = 0;
	            var averageRounded = 0;
	            if (length != 0) {
	                var total = 0;
	                for (var i = 0; i < length; i++) {
	                    total += parseInt(reviews[i].stars);
	                }

	                var average = total / length;
	                var averageRounded = Math.round(average * 10) / 10
	            } else {
	                document.getElementById('averageRating').innerHTML = "No Ratings Yet";
	            }

	            var account = {
	                averageRating: averageRounded,
	            }

	            $scope.account = account;
	            $scope.$apply()
	        },
	        error: function(response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });

	}

	this.getReviews = function(id, $scope) {
		var url = prodUrl + "getReviews";
	    var dataGET = {
	        sellerID: id
	    }
	    console.log('Asking for Reviews')
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        statusCode: {
	            // 200: function(response) {
	            //     $(document.body).show(); // SHOULD EDIT THIS TO BE BETTER DESIGN - WHAT IF AJAX CALL FAILS
	            // },
	            404: function(response) {
	                var newDoc = document.open("text/html", "replace");
	                console.log(response);
	                newDoc.write(response.responseText);
	                newDoc.close();
	            }
	        },
	        success: function (data) {
	            var items = JSON.parse(data)


	            var monthNames = [
	                "January", "February", "March",
	                "April", "May", "June", "July",
	                "August", "September", "October",
	                "November", "December"
	            ];

	            for (i = 0; i < items.length; i++) {


	                var date = new Date(items[i].datePosted)
	                var month = date.getMonth();
	                var day = date.getDate();
	                var year = date.getFullYear();
	                var newDate = monthNames[month] + " " + day + ", " + year;
	                items[i].datePosted = newDate;
	                console.log(newDate);
	            }

	            $scope.reviews = items;
	            console.log($scope.reviews)
	            $scope.$apply()
	        },
	        error: function (response, error) {
	            console.log(JSON.stringify(response))
	            console.log(error)
	        }
	    });
	}

    this.getReviewsOfSeller = function(itemID, $scope) {
        var url = prodUrl + "getReviewsOfSeller";
        var dataGET = {
            itemID: itemID
        }
        console.log('Asking for Reviews of Seller')
        $.ajax({
            url: url,
            data: dataGET,
            type: 'GET',
            statusCode: {
                // 200: function(response) {
                //     $(document.body).show(); // SHOULD EDIT THIS TO BE BETTER DESIGN - WHAT IF AJAX CALL FAILS
                // },
                404: function(response) {
                    var newDoc = document.open("text/html", "replace");
                    console.log(response);
                    newDoc.write(response.responseText);
                    newDoc.close();
                }
            },
            success: function (data) {
            	console.log('Got reviews of sellers');
                var items = JSON.parse(data)


                var monthNames = [
                    "January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"
                ];

                for (i = 0; i < items.length; i++) {


                    var date = new Date(items[i].datePosted)
                    var month = date.getMonth();
                    var day = date.getDate();
                    var year = date.getFullYear();
                    var newDate = monthNames[month] + " " + day + ", " + year;
                    items[i].datePosted = newDate;
                    console.log(newDate);
                }

                $scope.itemReviews = items;
                console.log($scope.itemReviews)
                $scope.$apply()
            },
            error: function (response, error) {
                console.log(JSON.stringify(response))
                console.log(error)
            }
        });
    }

	this.getReviewerImagesAndNames = function(id, $scope) {
		var url = prodUrl + "getReviewerImagesAndNames";
	    var dataGET = {
	        userID: id
	    }
	    console.log('Asking for Reviewers')
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function (data) {
	            var items = JSON.parse(data)
	            $scope.reviewers = items;
	            //console.log(items[0].fullName + "these are the names of the reviewers")
	            console.log($scope.reviewers)
	            $scope.$apply()
	        },
	        error: function (response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	this.getBidsOfUsers = function(accessToken, $scope) {
		var url = prodUrl + "getBidsofUsers";

	    var dataGET = {
	        accessToken: accessToken
	    }
	    console.log('Asking for Bids')
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function(data) {
	            var bids = JSON.parse(data)
	            if (bids.length != 0) {
	                $scope.bids = bids;
	                console.log($scope.bids)
	                $scope.$apply()
	            } else {
	                document.getElementById('BidCount').innerHTML = "No Bids Yet";
	            }
	        },
	        error: function(response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	this.getBiddedItemsOfUsers = function(accessToken, $scope) {
		var url = prodUrl + "getBiddedItemsofUsers";
	    var dataGET = {
	        accessToken: accessToken
	    }
	    console.log('Asking for Items')
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function(data) {
	            var allAccountsAndItems = JSON.parse(data)

	            var oldBiddedItems = allAccountsAndItems.oldBiddedItems;
	            var curBiddedItems = allAccountsAndItems.curBiddedItems;

	            for (i = 0; i < oldBiddedItems.length; i++) {


	                oldBiddedItems[i].percentageRaised = (Number(oldBiddedItems[i].amountRaised) / Number(oldBiddedItems[i].price)) * 100;
	                console.log("Raised" + oldBiddedItems[i].percentageRaised);
	                var expirationDate = new Date(oldBiddedItems[i].expirationDate);
	                var date = new Date();
	                oldBiddedItems[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
	            
	                var hours = DateDiff.inHours(date, expirationDate)
	                var days = DateDiff.inDays(date, expirationDate)

	                if (oldBiddedItems[i].expired) {
	                    oldBiddedItems[i].expirationDate = "Lottery has expired!";                     
	                }
	                else if (oldBiddedItems[i].sold) {
	                    oldBiddedItems[i].expirationDate =  oldBiddedItems[i].winnerName;
	                }
	                else if (hours < 0 || days < 0) {
	                     oldBiddedItems[i].expirationDate = "Negative days remaining (not expired yet)";   
	                }
	                else {
	                    oldBiddedItems[i].expirationDate =  hours + " Hours " + days + " Days left";
	                }
	               // oldBiddedItems[i]["src"] = 'data:image/jpeg;base64,' + btoa(oldBiddedItems[i].data.data)

	                var image = oldBiddedItems[i].img;
	                if (image == null) {
	                    oldBiddedItems[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
	                } 
	                else if (oldBiddedItems[i].img.compressed != null) {
	                    oldBiddedItems[i]["src"] = oldBiddedItems[i].img.compressed;
	                }
	                else {
	                    var b64 = base64ArrayBuffer(oldBiddedItems[i].img.data.data)
	                    var dataURL = "data:image/jpeg;base64," + b64;
	                    oldBiddedItems[i]["src"] = dataURL;
	                }
	            }



	           	for (i = 0; i < curBiddedItems.length; i++) {


	                curBiddedItems[i].percentageRaised = (Number(curBiddedItems[i].amountRaised) / Number(curBiddedItems[i].price)) * 100;
	                console.log("Raised" + curBiddedItems[i].percentageRaised);
	                var expirationDate = new Date(curBiddedItems[i].expirationDate);
	                var date = new Date();
	                curBiddedItems[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
	            
	                var hours = DateDiff.inHours(date, expirationDate)
	                var days = DateDiff.inDays(date, expirationDate)

	                if (curBiddedItems[i].expired) {
	                    curBiddedItems[i].expirationDate = "Lottery has expired!";                     
	                }
	                else if (curBiddedItems[i].sold) {
	                    curBiddedItems[i].expirationDate =  curBiddedItems[i].winnerName;
	                }
	                else if (hours < 0 || days < 0) {
	                     curBiddedItems[i].expirationDate = "Negative days remaining (not expired yet)";   
	                }
	                else {
	                    curBiddedItems[i].expirationDate =  hours + " Hours " + days + " Days left";
	                }
	               // curBiddedItems[i]["src"] = 'data:image/jpeg;base64,' + btoa(curBiddedItems[i].data.data)

	                var image = curBiddedItems[i].img;
	                if (image == null) {
	                    curBiddedItems[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
	                } 
	                else if (curBiddedItems[i].img.compressed != null) {
	                    curBiddedItems[i]["src"] = curBiddedItems[i].img.compressed;
	                }
	                else {
	                    var b64 = base64ArrayBuffer(curBiddedItems[i].img.data.data)
	                    var dataURL = "data:image/jpeg;base64," + b64;
	                    curBiddedItems[i]["src"] = dataURL;
	                }
	            }


	            var curBidsAccounts = allAccountsAndItems.curBidsAccounts;
	            var oldBidsAccounts = allAccountsAndItems.oldBidsAccounts;


	            $scope.curBidsAccounts = curBidsAccounts;
	            $scope.oldBidsAccounts = oldBidsAccounts;
	            $scope.oldBiddedItems = oldBiddedItems;
	            $scope.curBiddedItems = curBiddedItems;
	            	            	            

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
	this.bid = function(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document, page) {
		var handler = StripeCheckout.configure({
	        key: 'pk_test_I1JByOdv34UVHxZhjKYlKGc4',
	        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
	        locale: 'auto',
	        token: function(token) {
	            console.log('attempting stripe payment')
	            var amountToCharge = $scope.amountToCharge;
	            var itemTitle = $scope.itemTitle;
	            var itemID = $scope.itemID;
	            var amountRaised = $scope.amountRaised;
	            var price = $scope.price;

	            if (accessToken != undefined) {
	                data = {
	                    itemID: itemID,
	                    itemTitle: itemTitle,
	                    accessToken: accessToken,
	                    stripeToken: token.id,
	                    amount: Number(amountToCharge)
	                }

	                $.ajax({
	                    url: prodUrl + 'performPaymentAndAddBid',
	                    data: data,
	                    type: 'POST',
	                    statusCode: {
	                    	401: function(response) {
	                    		console.log("Oops, you can't bid on this item anymore!")
	                    		BootstrapDialog.show({
			                        title: "Oops, you can't bid on this item anymore!",
			                        message: 'Your credit card was not charged. This item is either expired or sold.',
			                        buttons: [{
			                            id: 'btn-ok',
			                            icon: 'glyphicon glyphicon-check',
			                            label: 'OK',
			                            cssClass: 'btn-primary',
			                            data: {
			                                js: 'btn-confirm',
			                                'user-id': '3'
			                            },
			                            autospin: false,
			                            action: function(dialogRef) {
			                                dialogRef.close();
			                            }
			                        }]
			                    });
	                    	},
		                    404: function(response) {
		                        var newDoc = document.open("text/html", "replace");
		                        // console.log(response);
		                        newDoc.write(response.responseText);
		                        newDoc.close();
		                    }
		                },
	                    success: function(data) {
	                        console.log('success payment and bid added')
	                        console.log(data);
	                        if (page == "item") {
	                        	post = $scope.post
		                        console.log(itemID)
		                        if (post["_id"] == itemID) {
		                            var newPrice = post.amountRaised + amountToCharge;
		                            post.amountRaised = newPrice;
		                            post.percentageRaised = (newPrice / post.price) * 100;
		                        }
	                        }
	                        else if (page == "index") {
	                        	for (var i = 0; i < $scope.posts.length; i++) {
		                            post = $scope.posts[i]
		                            console.log(itemID)
		                            if (post["_id"] == itemID) {
		                                var newPrice = post.amountRaised + amountToCharge;
		                                post.amountRaised = newPrice;
		                                post.percentageRaised = (newPrice / post.price) * 100;
		                                break;
		                            }
		                        }
	                        }
	                        else if (page == "user") {
		                        for (var i = 0; i < $scope.listedItems.length; i++) {
		                            post = $scope.listedItems[i]
		                            console.log(itemID)
		                            if (post["_id"] == itemID) {
		                                var newPrice = post.amountRaised + amountToCharge;
		                                post.amountRaised = newPrice;
		                                post.percentageRaised = (newPrice / post.price) * 100;
		                                break;
		                            }
		                        }
	                        }
	                        else if (page == "profile") {
		                        for (var i = 0; i < $scope.items.length; i++) {
		                            post = $scope.items[i]
		                            console.log(itemID)
		                            if (post["_id"] == itemID) {
		                                var newPrice = post.amountRaised + amountToCharge;
		                                post.amountRaised = newPrice;
		                                post.percentageRaised = (newPrice / post.price) * 100;
		                                break;
		                            }
		                        }
	                        }

	                        $scope.$apply()

	                    },
	                    error: function(response, error) {
	                        console.log(response)
	                        console.log(error)
	                    }
	                });

	            } else {
	                document.getElementById('loginMessage').innerHTML = 'You must login before you are able to bid on an item!';
	                showLoginPopup();
	                console.log('UserID is undefined')
	            }
	        }
	    });

	    $scope.price = price;
        $scope.amountToCharge = amount;
        $scope.itemID = itemID
        $scope.itemTitle = itemTitle
        $scope.amountRaised = amountRaised
        if (accessToken != undefined) {
            checkIfUser(accessToken, function() {
                if (status == 'true') {
                if (price >= amountRaised + amount) {
                    handler.open({
                        name: 'LottoDeal',
                        description: 'Bid on ' + itemTitle,
                        amount: amount * 100
                    });
                } else {
                    console.log('Bid overpasses item price!');
                    BootstrapDialog.show({
                        title: 'Bid surpasses item price',
                        message: 'Choose a lower bid or search for similar items',
                        buttons: [{
                            id: 'btn-ok',
                            icon: 'glyphicon glyphicon-check',
                            label: 'OK',
                            cssClass: 'btn-primary',
                            data: {
                                js: 'btn-confirm',
                                'user-id': '3'
                            },
                            autospin: false,
                            action: function(dialogRef) {
                                dialogRef.close();
                            }
                        }]
                    });

                }
            }
            });

        }
        else {
            document.getElementById('loginMessage').innerHTML = 'You must login before you are able to bid on an item!';
            showLoginPopup();
            console.log('UserID is undefined')
        }

		// console.log('initiating bid');
  //       $scope.price = price;
  //       $scope.amountToCharge = amount;
  //       $scope.itemID = itemID
  //       $scope.itemTitle = itemTitle
  //       $scope.amountRaised = amountRaised

  //       if (accessToken != undefined) {

  //           if (price >= amountRaised + amount) {
  //               handler.open({
  //                   name: 'LottoDeal',
  //                   description: 'Bid on ' + itemTitle,
  //                   amount: amount * 100
  //               });
  //           } else {
  //               console.log('Bid overpasses item price!');
  //               BootstrapDialog.show({
  //                   title: 'Bid surpasses item price',
  //                   message: 'Choose a lower bid or search for similar items',
  //                   buttons: [{
  //                       id: 'btn-ok',
  //                       icon: 'glyphicon glyphicon-check',
  //                       label: 'OK',
  //                       cssClass: 'btn-primary',
  //                       data: {
  //                           js: 'btn-confirm',
  //                           'user-id': '3'
  //                       },
  //                       autospin: false,
  //                       action: function(dialogRef) {
  //                           dialogRef.close();
  //                       }
  //                   }]
  //               });
  //           }
  //       } else {
  //           document.getElementById('loginMessage').innerHTML = 'You must login before you are able to bid on an item!';
  //           showLoginPopup();
  //           console.log('UserID is undefined')
  //       }
	}

	this.deleteItem = function(id, accessToken, $scope) {
		BootstrapDialog.show({
            title: 'Are you sure you would like to delete this item?',
            message: 'This cannot be undone',
            buttons: [{
                id: 'btn-1',
                label: 'Delete Item',
                action: function(dialog) {
                    var $button = this; // 'this' here is a jQuery object that wrapping the <button> DOM element.
                    $button.disable();
                    $button.spin();
                    dialog.setClosable(false);
                    $.ajax({
                        url: prodUrl + 'deleteItem',
                        data: {
                            accessToken: accessToken,
                            id: id
                        },
                        type: 'DELETE',
                        success: function(data) {
                            console.log('Success deleting item')
                            var $footerButton = dialog.getButton('btn-1');
                            $footerButton.enable();
                            $footerButton.stopSpin();
                            dialog.setClosable(true);
                            dialog.close();
                            window.location.href = 'https://dominicwhyte.github.io/LottoDeal-Frontend/index.html';
                        },
                        error: function(response, error) {
                            console.log('Error deleting item')
                            var $footerButton = dialog.getButton('btn-1');
                            $footerButton.enable();
                            $footerButton.stopSpin();
                            dialog.setClosable(true);
                        }
                    });


                }
            }]
        });
	}

	this.updateSettings = function(accessToken, email) {
		var url = prodUrl + "updateSettings";

        console.log("updating your settings")

        data = {
            email: email,
            accessToken: accessToken,
        }

        // AJAX POST TO SERVER
        $.ajax({
            url: url,
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

	this.testFunction = function() {
		console.log("this function is working")
	}
}
