(function() {
    var leafUltis = angular.module('leafUltis', []);

    leafUltis.factory('leafUltisTest', function() {
        return {
            test: function() {
                alert('test in leafUltis');
            }
        };
    });
})();
