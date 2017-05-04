angular.module('utilsModule', [])
.service('dateFunctions', dateFunctions)

function dateFunctions() {
	this.DateDiff = {
		inHours: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            if (t2 == null || t1 == null) {
                return 0
            }
            return (parseInt((t2 - t1) / (3600 * 1000))) % 24;
        },

        inDays: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            if (t2 == null || t1 == null) {
                return 0
            }
            return parseInt((t2 - t1) / (24 * 3600 * 1000));
        }
	}
}
