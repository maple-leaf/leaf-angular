(function(IScroll, window) {
    var leafUi = angular.module('leafUi', []);

    /**
        * Function module: leafPopup
        * @usage
        * leafPopup.init({
        *      title,
        *      className,
        *      template/templateUrl, // templateUrl has high priority
        *      title/headerHtml,   // headerHtml has high priority
        *      footerHtml,
        *      btns: [
        *          {
        *              name,   // required
        *              className,
        *              onTap: function() {
        *                  this.close();
        *                  //this.remove();
        *              }
        *          }
        *      ] || false  // when set to false and footerHtml not being specified, footer will disapper
        *
        * })
        *
        * @return {undefined}
    */
    leafUi.factory('leafPopup', function($document, $compile, $rootScope, $http, $q) {
        return {
            init: function(options) {
                var _defaultOptions, _options, popup, proto;
                _defaultOptions = {
                };
                _options = angular.extend(_defaultOptions, options || {});
                proto = {
                    show: function() {
                        angular.element(this.ele).removeClass('ng-hide');
                    },
                    close: function() {
                        angular.element(this.ele).addClass('ng-hide');
                    },
                    remove: function() {
                        this.ele.remove();
                    }
                };
                popup = function() {
                    if (document.getElementsByTagName('leaf-popup').length) return;
                    var _this, time, id, headerHtml, footerHtml, wrapperClass, scope, ele, deferred;
                    _this = this;
                    angular.extend(_this, proto);
                    _this.options = _options;
                    time = Date.now();
                    id = 'leafPopup' + time  + parseInt(Math.random() * 1000, 10);
                    wrapperClass = "leaf-popup-wrapper" + (_options.className ? (" " + _options.className) : "");
                    scope = _options.scope || $rootScope.$new();
                    scope.close = function() {
                        _this.close();
                    };
                    scope.remove = function() {
                        _this.remove();
                    };
                    if (_options.headerHtml) {
                        headerHtml = _options.headerHtml;
                        wrapperClass += " has-header";
                    } else if (_options.title) {
                        headerHtml = '<div class="leaf-popup-header">'
                        +   '<h5>' + _options.title + '</h5>'
                        + '</div>';
                        wrapperClass += " has-header";
                    } else {
                        headerHtml = '';
                    }
                    if (_options.footerHtml) {
                        footerHtml = _options.footerHtml;
                    } else {
                        if (_options.btns === false) {
                            footerHtml = "";
                        } else {
                            footerHtml = '<div class="leaf-popup-footer">';
                            if (_options.btns) {
                                if (Array.isArray(_options.btns)) {
                                    _options.btns.forEach(function(btn, i) {
                                        var className = btn.className || "leaf-btn btn-clean"
                                        footerHtml += '<span class="' + className + '" ng-click="' + btn.name + '()">' + btn.text + '</span>'
                                        scope[btn.name] = btn.onTap;
                                    });
                                }
                            } else {
                                footerHtml += '<span class="leaf-btn btn-positive" ng-click="close()">Ok</span>'
                            }
                            footerHtml += '</div>';
                        }
                    }
                    deferred = $q.defer();
                    var promise = (function() {
                        var html = '<div class="leaf-popup-wrapper" id="' + id + '"><div class="leaf-popup-overlay"></div><div class="leaf-popup"><div class="leaf-popup-inner">'
                            + headerHtml
                            + '<div class="leaf-popup-content">';
                        if (_options.templateUrl) {
                            $http.get(_options.templateUrl)
                            .success(function(data) {
                                html = html + data
                                + '</div>'
                                + footerHtml
                                + '</div></div></div>';
                                deferred.resolve(html);
                            });
                        } else {
                            html = html + (_options.template || "")
                            + '</div>'
                            + footerHtml
                            + '</div></div></div>';
                            deferred.resolve(html);
                        }
                        return deferred.promise;
                    })();
                    promise.then(function(html) {
                        ele = angular.element(html);
                        $document.find('leaf-wrapper').append(ele);
                        $compile(ele)(scope);
                        _this.ele = document.getElementById(id);
                    }, function() {
                    });
                };

                angular.extend(popup.prototype, proto);

                return new popup();
            }
        };
    });

    leafUi.factory('leafScroll', function($document) {
        return {
            init: function(ele, options) {
                var _defaultOptions, _options;
                _defaultOptions = { };
                _options = angular.extend(_defaultOptions, options || {});

                return new IScroll(ele, _options);
            }
        };
    });

    leafUi.directive('leafContent', function($rootScope, $timeout, leafScroll) {
        var tpl = '<div class="leaf-content-wrapper" ng-transclude>'
                + '</div>';
        return {
            restrict: 'E',
            template: tpl,
            transclude: true,
            link: function(scope, ele, attrs) {
                // add a empty block which height equal footer's height to make IScroll can reach bottom when init
                var div = document.createElement('div'), height;
                div.text = "&nbsp;";
                height = ele.parent().find('leaf-footer')[0].clientHeight;
                if (angular.isDefined(attrs.offset) && !isNaN(parseFloat(attrs.offset))) {
                    height += parseFloat(attrs.offset);
                }
                div.setAttribute('style', 'height: ' + height + 'px');
                ele.children().append(div);
                var scroll = leafScroll.init(ele[0], {
                    click: true
                });
                $timeout(function() {
                    scroll.refresh();
                }, 30);
                $rootScope.$refresh = scope.$refresh = function() {
                    // not always work properly after removed
                    //div.remove();
                    scroll.refresh();
                };
            }
        };
    });

    leafUi.directive('leafHeader', function($document, leafScroll) {
        var tpl = '<div class="leaf-header-wrapper" ng-transclude>'
                + '</div>';
        return {
            restrict: 'E',
            template: tpl,
            transclude: true,
            link: function(scope, ele, attrs) {
                $document.find('leaf-wrapper').addClass('has-header');
            }
        };
    });

    leafUi.directive('leafFooter', function(leafScroll, $document) {
        var tpl = '<div class="leaf-footer-wrapper" ng-transclude>'
                + '</div>';
        return {
            restrict: 'E',
            template: tpl,
            transclude: true,
            link: function(scope, ele, attrs) {
                $document.find('leaf-wrapper').addClass('has-footer');
            }
        };
    });

    leafUi.directive('leafSelect', function(leafPopup, $document) {
        var tpl = "<div class='leaf-select-wrapper'>"
        +   "<div class='leaf-select-selected' ng-click='$showSelect()'>{{ selected }}</div>"
        + "</div>",
        optionTpl = "<div class='list'>"
        +     "<div class='item' ng-repeat='option in copiedOptions track by $index' ng-click='$changeSelectValue(option)'>{{ option.text }}"
        +       "<span ng-class='{\"fa fa-check\": option.checked, \"\" :!options.checked}'></span>"
        +     "</div>"
        + "</div>";
        return {
            restrict: 'E',
            template: tpl,
            scope: {
                options: "=",
                ngModel: "="
            },
            controller: function($scope) {
                $scope.$showSelect = function() {
                    $scope.optionsPopup = leafPopup.init({
                        template: optionTpl,
                        scope: $scope,
                        btns: false
                    });
                };
                $scope.$changeSelectValue = function(option) {
                    $scope.ngModel = option.value;
                    $scope.selected = option.text;
                    $scope.copiedOptions.forEach(function(option) {
                        option.checked = false;
                    });
                    option.checked = true;
                    $scope.optionsPopup.close();
                };
            },
            link: function(scope, ele, attrs) {
                scope.selected = "---";
                function copyOptions() {
                    scope.copiedOptions = angular.copy(scope.options);
                    scope.copiedOptions.forEach(function(option) {
                        option.checked = angular.equals(option.value, scope.ngModel);
                        if (option.checked) scope.selected = option.text;
                    });
                }
                scope.$watch('options', function() {
                    copyOptions();
                }, true);
                copyOptions();
            }
        };
    });

    leafUi.directive('leafToggle', function() {
        var tpl = "<div class='leaf-toggle-wrapper'>"
                +   "<span class='leaf-toggle-label'></span>"
                +   "<span ng-class='{\"leaf-toggle-toggler actived\": ngModel, \"leaf-toggle-toggler\": !ngModel}' ng-click='$toggleState()'><span class='leaf-toggle-spinner'></span></span>"
                + "</div>";
        return {
            template: tpl,
            restrict: 'E',
            transclude: true,
            scope: {
                ngModel: "="
            },
            controller: function($scope) {
                $scope.$toggleState = function() {
                    $scope.ngModel = !$scope.ngModel;
                };
            },
            link: function(scope, ele, attrs) {
                ele.find('span')[0].textContent = attrs.label;
            }
        };
    });

    leafUi.directive('leafRadio', function() {
        var tpl = "<div ng-class='{\"leaf-radio-wrapper horizontal\": horizontal, \"leaf-radio-wrapper\": !horizontal}' ng-transclude>"
                + "</div>";
        return {
            template: tpl,
            restrict: 'E',
            transclude: true,
            scope: {
                radios: "=",
                ngModel: "="
            },
            link: function(scope, ele, attrs) {
                var iconsHtml;
                if (angular.isDefined(attrs.horizontal) && attrs.horizontal !== false) {
                    ele.children().addClass('horizontal');
                    iconsHtml = '<span class="fa fa-circle-o"></span><span class="fa fa-check-circle-o"></span>';
                } else {
                    iconsHtml = '<span class="fa fa-check"></span>';
                }
                if (!angular.isDefined(attrs.ngModel)) {
                    throw "ng-model must be specified";
                }
                if (scope.radios) {
                    var html = "";
                    scope.radios.forEach(function(radio) {
                        html += '<label class="radio"><input type="radio" ng-model="ngModel" value="' + radio.value + '">'
                             +  iconsHtml
                             +  '<span class="radio-text">' + radio.text + '</span>'
                             +  '</label>';
                    });
                    ele.children().html(html);
                } else {
                    angular.forEach(ele.find('input'), function(input) {
                        var $input = angular.element(input);
                        if(input.nextSibling && input.nextSibling.nodeType === 3) {
                            angular.element(input.nextSibling).wrap('<span class="radio-text"></span>');
                        } else if (input.previousSibling && input.previousSibling.nodeType === 3) {
                            angular.element(input.previousSibling).wrap('<span class="radio-text"></span>');
                        }
                        $input.after(iconsHtml);
                        if (angular.equals($input.val(), scope.ngModel)) {
                            $input.parent().addClass('checked');
                        }
                    });
                }
                angular.element(ele[0].querySelectorAll('.radio')).bind('click', function() {
                    var _this = this, checkedEle;
                    if (_this.classList.contains('checked')) return;
                    checkedEle = _this.parentElement.querySelector('.checked');
                    if (checkedEle) {
                        checkedEle.classList.remove('checked');
                    }
                    scope.$apply(function() {
                        scope.ngModel = _this.querySelector('input').value;
                        _this.classList.add('checked');
                    });
                });
            }
        };
    });

    leafUi.directive('leafCheckbox', function() {
        var tpl = "<div ng-class='{\"leaf-checkbox-wrapper horizontal\": horizontal, \"leaf-checkbox-wrapper\": !horizontal}' ng-transclude>"
                + "</div>";
        return {
            template: tpl,
            restrict: 'E',
            transclude: true,
            require: 'ngModel',
            scope: {
                checkboxes: "=",
                ngModel: "="
            },
            link: function(scope, ele, attrs, ctrl) {
                var iconsHtml;
                ctrl.$validators.required = function() {
                    if (angular.isDefined(scope.ngModel) && scope.ngModel.length) {
                        return true;
                    } else {
                        return false;
                    }
                };
                // http://docs.angularjs.cn/api/ng/type/ngModel.NgModelController/#$validate
                /* https://github.com/angular/angular.js/blob/master/src/ng/directive/ngModel.js#L1028
                 * var ngModelDirective = ['$rootScope', function($rootScope) {...
                 *  modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options);
                 */
                ctrl.$$setOptions({
                    allowInvalid: true
                });
                if (angular.isDefined(attrs.horizontal) && attrs.horizontal !== false) {
                    ele.children().addClass('horizontal');
                    iconsHtml = '<span class="fa fa-square-o"></span><span class="fa fa-check-square-o"></span>';
                } else {
                    iconsHtml = '<span class="fa fa-check"></span>';
                }
                if (!angular.isDefined(attrs.ngModel)) {
                    throw "ng-model must be specified";
                    return;
                }
                if (!angular.isDefined(scope.ngModel)) {
                    scope.ngModel = [];
                } else if (!angular.isArray(scope.ngModel)) {
                    throw "ng-model must be a Array";
                    return;
                }
                if (scope.checkboxes) {
                    var html = "";
                    scope.checkboxes.forEach(function(checkbox) {
                        html += '<label class="checkbox"><input type="checkbox" ng-model="ngModel" value="' + checkbox.value + '">'
                             +  iconsHtml
                             +  '<span class="checkbox-text">' + checkbox.text + '</span>'
                             +  '</label>';
                    });
                    ele.children().html(html);
                } else {
                    angular.forEach(ele.find('input'), function(input) {
                        var $input = angular.element(input);
                        if(input.nextSibling && input.nextSibling.nodeType === 3) {
                            angular.element(input.nextSibling).wrap('<span class="checkbox-text"></span>');
                        } else if (input.previousSibling && input.previousSibling.nodeType === 3) {
                            angular.element(input.previousSibling).wrap('<span class="checkbox-text"></span>');
                        }
                        $input.after(iconsHtml);
                        if (scope.ngModel.indexOf($input.val()) !== -1) {
                            $input.parent().addClass('checked');
                        }
                    });
                }
                angular.element(ele[0].querySelectorAll('.checkbox')).bind('click', function() {
                    var _this = this, value = _this.querySelector('input').value;
                    scope.$apply(function() {
                        var index = scope.ngModel.indexOf(value);
                        if (index !== -1) {
                            scope.ngModel.splice(index, 1);
                            _this.classList.remove('checked');
                        } else {
                            scope.ngModel.push(value);
                            _this.classList.add('checked');
                        }
                        ctrl.$validate();
                    });
                });
            }
        };
    });

    leafUi.directive('leafTab', function($rootScope, $compile) {
        return {
            restrict: 'E',
            link: function(scope, ele, attrs) {
                if (!attrs.hasOwnProperty('current')) {
                    ele.addClass('ng-hide');
                }
                scope.$on('tabSwitching', function(e, tab) {
                    if (angular.equals('#' + attrs.id, tab)) {
                        ele.removeClass('ng-hide');
                    } else {
                        ele.addClass('ng-hide');
                    }
                    $rootScope.$broadcast('tabSwitched');
                });
            }
        };
    });

    leafUi.directive('leafTabsNav', function($rootScope, $compile) {
        return {
            restrict: 'E',
            link: function(scope, ele, attrs) {
                var switchedTab = 0, tabs = ele.children().length;
                function bindClick() {
                    switchedTab = 0;
                    angular.forEach(ele.children(), function(nav) {
                        nav.onclick = function() {
                            var target = this.getAttribute('href') || this.getAttribute('data-href');
                            $rootScope.$broadcast('tabSwitching', target);
                            unBindClick();
                        }
                    });
                }
                function unBindClick() {
                    ele.children().unbind('click');
                }
                scope.$on('tabSwitched', function() {
                    switchedTab++;
                    if (switchedTab === tabs) {
                        bindClick();
                        $rootScope.$refresh();
                    }
                });
                bindClick();
            }
        };
    });

    leafUi.directive('leafSidebarToggle', function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                ele.bind('click', function() {
                    $rootScope.$broadcast('toggleLeafSidebar', attrs.leafSidebarToggle);
                });
            }
        };
    });

    leafUi.directive('leafSidebar', function() {
        return {
            restrict: 'E',
            link: function(scope, ele, attrs) {
                scope.$on('toggleLeafSidebar', function(e, sidebar) {
                    if (sidebar === "") {
                        ele.toggleClass('show-sidebar');
                    } else if (attrs.id === sidebar) {
                        ele.toggleClass('show-sidebar');
                    }
                });
            }
        };
    });
})(IScroll, window);
