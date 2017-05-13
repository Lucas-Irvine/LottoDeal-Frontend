angular.module('serverModule', ['utilsModule'])
.service('serverGet', ["dateFunctions", "arrayBufferFunctions", serverGet])
.service('serverPost', serverPost);

// var prodUrl = "https://162.243.121.223:8000/";
var prodUrl = "http://162.243.121.223:8000/";
var debug = "https://localhost:8000/";

var frontendURL

// serverGet contains all ajax GET calls to the backend (all private GET requests
// use an accessToken instead of FBID)
function serverGet(dateFunctions, base64ArrayBuffer) {
	var DateDiff = dateFunctions.DateDiff; // define dateDiff
	var base64ArrayBuffer = arrayBufferFunctions.base64ArrayBuffer;

	// get all posts from the backend (all items for the frontend)
	this.getPosts = function(loadingIcon, $scope) {
		var url = prodUrl + "getPosts";
	    loadingIcon.show()
	    $.ajax({
	        url: url,
	        type: 'GET',
	        success: function(data) {
	            var items = JSON.parse(data);
	            var soldItems = [];
	            var expiredItems = [];
	            var listedItems = [];
	            for (i = 0; i < items.length; i++) {
	                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
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

	                var image = items[i].img;
	                if (items[i].img.compressed != null) {
	                    items[i]["src"] = items[i].img.compressed;
	                }
	                else {
	                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
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

	            loadingIcon.hide();
	            $scope.$apply()
	        },
	        error: function(response, error) {
	        	console.log("Error in getPosts");
	            console.log(response);
	            console.log(error);
	        }
	    });
	}

	// get notifications for a user
	this.getNotifications = function(accessToken, $scope) {
		var itemIDs = [];

		var notificationUrl = prodUrl + "getNotifications";
	    var dataGET = {
	        accessToken: accessToken
	    }
	    $.ajax({
	        url: notificationUrl,
	        data: dataGET,
	        type: 'GET',
	        success: function(data) {
	            var notifications = JSON.parse(data);

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
	                }
	                if (!notifications[i].read) {
	                    $scope.notificationLength++;
	                }

	                if (notifications[i].sold != undefined && notifications[i].sold != null && notifications[i].sold == true) {

	                }
	                else {
	                	notifications[i].sold = false
	                	notifications[i].winnerName = "null"
	                }

	            }


	            // get the images for the notifications
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
                        $scope.$apply()
                    },
                    error: function(response, error) {
                    	console.log("Error in getImagesforNotificationsURL")
                        console.log(response)
                        console.log(error)
                    }
                });

	            $scope.notifications = notifications;
	            $scope.$apply()
	        },
	        error: function(response, error) {
	        	console.log("Error in getNotitifications")
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	// get the suggested items for a particular user
	this.getSuggestions = function(accessToken, $scope) {
		var suggestionsURL = prodUrl + "getSuggestions";
        if (accessToken != null) {
            $.ajax({
                url: suggestionsURL,
                type: 'GET',
                data: {
                    accessToken: accessToken
                },
                statusCode: {
                    404: function(response) {
                        var newDoc = document.open("text/html", "replace");
                        newDoc.write(response.responseText);
                        newDoc.close();
                    }
                },
                success: function(data) {
                    var parsed = JSON.parse(data)
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

	// get item based on itemID
	this.getItem = function(id, $scope, userID) {
		var url = prodUrl + "getItem"

		$.ajax({
	        url: url,
	        type: 'GET',
	        data: {
	            id: id
	        },
	        statusCode: {
	            404: function(response) {
	                var newDoc = document.open("text/html", "replace");
	                newDoc.write(response.responseText);
	                newDoc.close();
	            }
	        },
	        success: function(data) {
	            var parsed = JSON.parse(data)

	            // amount raised
	            parsed.percentageRaised = (Number(parsed.amountRaised) / Number(parsed.price)) * 100;
	            var expirationDate = new Date(parsed.expirationDate);
	            var date = new Date();
	            parsed.hoursToGo = DateDiff.inHours(date, expirationDate)
	            parsed.daysToGo = DateDiff.inDays(date, expirationDate)
	            parsed.titleUppercase = parsed.title.toUpperCase();
	            sellerID = parsed.sellerID;

	            var image = parsed.img;

	            if (image == null) {
	                parsed["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
	            } else {
	                parsed["src"] = parsed.img.compressed;
	            }

	            if (parsed.sellerID == userID) {
	                $scope.canEdit = true;
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

	// mark notifications read and return new notifications for user
    this.markRead = function(accessToken, $scope) {
    	var itemIDs = [];
    	var readurl = prodUrl + "markRead";
        var data = {
            accessToken: accessToken
        }
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
                    }
                }

                $scope.notifications = notifications;
                $scope.$apply()
            },
            error: function(response, error) {
                console.log(response)
                console.log(error)
            }
        });
    }
	
	// get the average user ratings for all posts
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

	            $scope.listedAccounts = allAccounts.listedAccounts.slice().reverse();
    			$scope.soldAccounts = allAccounts.soldAccounts.slice().reverse();
    			$scope.expiredAccounts = allAccounts.expiredAccounts.slice().reverse();

	            $scope.$apply()
	        },
	        error: function(response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	// get the public account of a user
	this.getPublicAccount = function($scope, id) {
		var url = prodUrl + "getPublicAccount";
	    var dataGET = {
	        userID: id
	    }

	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function (data) {
	            var account = JSON.parse(data)
	            document.getElementById('profileName').innerHTML = account.fullName;
	            document.getElementById('profileImage').src = account.pictureURL;
	            var reviews = account.reviews;
	            var length = reviews.length;
	            var total = 0; 
	            var average = 0;
	            var averageRounded = 0;
	            var rating = ""
	            if (length != 0) {
	                var total = 0; 
	                for (var i = 0; i < length; i++) {
	                    total += parseInt(reviews[i].stars);
	                }

	                var average = total/length;
	                var averageRounded = Math.round(average*10)/10
	                rating = "" + averageRounded + "/5"
	                $scope.ratingAvailable = true;
	            }
	            else {
	            	rating = "No ratings yet"
	            	$scope.ratingAvailable = false;
	            }

	            var account = {
	                averageRating : rating
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

	// get the listed items for a user
	this.getListedItemsForUsers = function(userID, $scope) {
		var url = prodUrl + "getListedItemsForUsers";
	    var dataGET = {
	        userID: userID
	    }
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        statusCode: {
	            404: function(response) {
	                var newDoc = document.open("text/html", "replace");
	                newDoc.write(response.responseText);
	                newDoc.close();
	            }
	        },
	        success: function (data) {
	            var items = JSON.parse(data)
	            for (i = 0; i < items.length; i++) {
	                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
	                var expirationDate = new Date(items[i].expirationDate);
	                var date = new Date();
	                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
	            
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

	                var image = items[i].img;
	                if (items[i].img.compressed != null) {
	                    items[i]["src"] = items[i].img.compressed;
	                }
	                else {
	                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
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
	            $scope.$apply()
	        },
	        error: function (response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	// get the sold items for a user
	this.getSoldItemsForUsers = function(userID, $scope) {
		var url = prodUrl + "getSoldItemsForUsers";
	    var dataGET = {
	        userID: userID
	    }
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function (data) {
	            var items = JSON.parse(data)
	            for (i = 0; i < items.length; i++) {
	                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
	                var expirationDate = new Date(items[i].expirationDate);
	                var date = new Date();
	                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
	            
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

	                var image = items[i].img;
	                if (items[i].img.compressed != null) {
	                    items[i]["src"] = items[i].img.compressed;
	                }
	                else {
	                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
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
	            $scope.$apply()
	        },
	        error: function (response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	// get a user's personal account information
	this.getAccount = function(accessToken, $scope) {
		var url = prodUrl + "getAccount";
		if (accessToken == null || accessToken == undefined) {
			return;
		}

	    var dataGET = {
	        accessToken: accessToken
	    }
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function(data) {
	            var account = JSON.parse(data)
	            document.getElementById('profileName').innerHTML = account.fullName;
	            document.getElementById('profileImage').src = account.pictureURL;
	            
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

	// get the reviews for a user
	this.getReviews = function(id, $scope) {
		var url = prodUrl + "getReviews";
	    var dataGET = {
	        sellerID: id
	    }
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        statusCode: {
	            404: function(response) {
	                var newDoc = document.open("text/html", "replace");
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
	            }

	            $scope.reviews = items;
	            $scope.$apply()
	        },
	        error: function (response, error) {
	            console.log(JSON.stringify(response))
	            console.log(error)
	        }
	    });
	}

	// get the reviews of a seller (of an item for the item page)
    this.getReviewsOfSeller = function(itemID, $scope) {
        var url = prodUrl + "getReviewsOfSeller";
        var dataGET = {
            itemID: itemID
        }
        $.ajax({
            url: url,
            data: dataGET,
            type: 'GET',
            statusCode: {
                404: function(response) {
                    var newDoc = document.open("text/html", "replace");
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
                }

                $scope.itemReviews = items;
                $scope.$apply()
            },
            error: function (response, error) {
                console.log(JSON.stringify(response))
                console.log(error)
            }
        });
    }

    // get the image and name of a reviewer
	this.getReviewerImagesAndNames = function(id, $scope) {
		var url = prodUrl + "getReviewerImagesAndNames";
	    var dataGET = {
	        userID: id
	    }
	    $.ajax({
	        url: url,
	        data: dataGET,
	        type: 'GET',
	        success: function (data) {
	            var items = JSON.parse(data)
	            $scope.reviewers = items;
	            $scope.$apply()
	        },
	        error: function (response, error) {
	            console.log(response)
	            console.log(error)
	        }
	    });
	}

	// get the items that a user has bid on
	this.getBiddedItemsOfUsers = function(accessToken, $scope) {
		var url = prodUrl + "getBiddedItemsofUsers";
	    var dataGET = {
	        accessToken: accessToken
	    }
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

	                var image = oldBiddedItems[i].img;
	                if (oldBiddedItems[i].img.compressed != null) {
	                    oldBiddedItems[i]["src"] = oldBiddedItems[i].img.compressed;
	                }
	                else {
	                    oldBiddedItems[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
	                }
	            }

	           	for (i = 0; i < curBiddedItems.length; i++) {
	                curBiddedItems[i].percentageRaised = (Number(curBiddedItems[i].amountRaised) / Number(curBiddedItems[i].price)) * 100;
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
	                if (curBiddedItems[i].img.compressed != null) {
	                    curBiddedItems[i]["src"] = curBiddedItems[i].img.compressed;
	                }
	                else {
	                    curBiddedItems[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
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

	// debug function
	this.testFunction = function() {
		console.log("this function is working");
	}
}

// serverPost contains all ajax POST calls to the backend (all private POST requests
// use an accessToken instead of FBID)
function serverPost() {
	// bid functionality (differs for different pages) (triggered on bid button press)
	this.bid = function(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document, page) {
		var handler = StripeCheckout.configure({
	        key: 'pk_test_I1JByOdv34UVHxZhjKYlKGc4',
	        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
	        locale: 'auto',
	        token: function(token) {
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
	                    amount: amountToCharge // sends as a string
	                }

	                $.ajax({
	                    url: prodUrl + 'performPaymentAndAddBid',
	                    data: data,
	                    type: 'POST',
	                    statusCode: {
	                    	401: function(response) {
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
		                        newDoc.write(response.responseText);
		                        newDoc.close();
		                    }
		                },
	                    success: function(data) {
	                        if (page == "item") {
	                        	post = $scope.post
		                        if (post["_id"] == itemID) {
		                            var newPrice = post.amountRaised + amountToCharge;
		                            post.amountRaised = newPrice;
		                            post.percentageRaised = (newPrice / post.price) * 100;
		                        }
	                        }
	                        else if (page == "index") {
	                        	for (var i = 0; i < $scope.posts.length; i++) {
		                            post = $scope.posts[i]
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
	                } 
	                else {
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
        }
	}

	// delete item based item id
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
                            var $footerButton = dialog.getButton('btn-1');
                            $footerButton.enable();
                            $footerButton.stopSpin();
                            dialog.setClosable(true);
                            dialog.close();
                            window.location.href = frontendURL + '/index.html';
                        },
                        error: function(response, error) {
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

	// update the settings of a user account
	this.updateSettings = function(accessToken, email) {
		var url = prodUrl + "updateSettings";
        data = {
            email: email,
            accessToken: accessToken,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function(data) {
            	// successfully updated the settings
            },
            error: function(response, error) {
            	console.log("Error in updating settings")
                console.log(response)
                console.log(error)
            }
        });
	}

	// debug function
	this.testFunction = function() {
		console.log("this function is working")
	}
}
