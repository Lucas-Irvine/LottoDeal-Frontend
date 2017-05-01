/* For notifications */

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
