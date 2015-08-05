/*
 * app.js     >2015<
 * Author: maple-leaf
 * Email: tjfdfs@gmail.com / tangjf.88@163.com
 */

var baseWidthOfSite = 720;
var leafDemo = angular.module('leafDemo', ['leaf', 'formUpload']);

leafDemo.directive('icon', function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            // scale icon image
            var rate = window.innerWidth / baseWidthOfSite;
            ele.attr('style', "width:" + (ele[0].clientWidth * rate) + "px;height:" + (ele[0].clientHeight * rate) + "px");
        }
    }
})
.directive('historyBack', function() {
    var template = '<div class="back" ng-click="back()"><span class="fa fa-angle-left"></span><span class="text">返回</span></div>';
    return {
        template: template,
        replace: true,
        controller: function($scope) {
            $scope.back = function() {
                window.history.back();
            }
        }
    }
})
.directive('stars', function($compile) {
    /* 如果没有changeHandler字段则不能更改
     *<span class="stars large" stars='{"total":5,"score": "{{ guideAssess.score }}","changeHandler":"changeGuideScore"}' ng-model="guideAssess.score"></span>
     */
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            function renderHtml() {
                var html = "", stars = JSON.parse(attrs.stars);
                for(var i = 0; i < stars.total; i++) {
                    if (i <= (stars.score - 1)) {
                        html += '<span class="iconfont iconfont-star"' + (stars.changeHandler ? ' ng-click="' + stars.changeHandler + '(' + (i+1) + ')"' : '') + '></span>';
                    } else {
                        html += '<span class="iconfont iconfont-emptyStar"' + (stars.changeHandler ? ' ng-click="' + stars.changeHandler + '(' + (i+1) + ')"' : '') + '></span>';
                    }
                }
                ele[0].innerHTML = html;
                $compile(ele.contents())(scope);
            }
            renderHtml();
            scope.$watch(attrs.ngModel, function(newValue) {
                renderHtml();
            });
        }
    }
});

angular.module('formUpload', [], function($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});

leafDemo.factory('demo', function($http, leafPopup, leafPageload) {
    var methods;
    leafPageload.start();
    window.onload = function() {
        calculateRootFontSize();
    };

    window.onresize = function() {
        calculateRootFontSize();
    };

    function calculateRootFontSize() {
        var fontSize = (window.innerWidth / baseWidthOfSite) * 40;
        if (fontSize > 40) fontSize = 40;
        document.getElementsByTagName('html')[0].setAttribute('style', 'font-size: ' + fontSize + 'px;');
        methods.onRemChanged();
        leafPageload.done();
    }

    methods = {
        ajax: function(config, successFn, errorFn) {
            var _this = this;
            $http(config).success(function(data) {
                angular.isFunction(successFn) && successFn.call(config, data);
            }).error(function(data) {
                if (angular.isFunction(errorFn)) {
                    errorFn.call(config, data);
                } else {
                    _this.messagePopup();
                }
            });
        },
        messagePopup: function(options) {
            var _defaultOptions = {
                className: "ptwx-message-popup",
                template: "错误!"
            };
            leafPopup.init(options || _defaultOptions);
        },
        onRemChanged: function() {}
    };

    return methods;
});
