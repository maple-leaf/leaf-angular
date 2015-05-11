(function() {
    var leaf = angular.module('leaf', ['leafUi', 'leafUltis']);

    leaf.factory('leafTest', function() {
        return {
            test: function() {
                alert('test in leaf');
            }
        };
    });
})();
