(function(IScroll, Swiper, window) {
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
        *      ] || false,  // when set to false and footerHtml not being specified, footer will disapper
        *      autoClose, // Integer
        *
        * })
        *
        * @return {undefined}
    */
    leafUi.factory('leafPopup', function($document, $compile, $rootScope, $http, $q, $timeout) {
        return {
            init: function(options) {
                var _defaultOptions, _options, popup, proto;
                _defaultOptions = {
                };
                _options = angular.extend(_defaultOptions, options || {});
                proto = {
                    close: function() {
                        if (this.ele.remove) {
                            this.ele.remove();
                        } else {
                            // old android dont support childNode.remove
                            this.ele.parentElement.removeChild(this.ele);
                        }
                    },
                    hide: function() {
                        this.ele.setAttribute('style', 'display:none');
                    },
                    show: function() {
                        this.ele.setAttribute('style', 'display:table');
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
                        if (_options.btns === false || _options.autoClose) {
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
                        var html = '<div class="' + wrapperClass + '" id="' + id + '"><div class="leaf-popup-overlay"></div><div class="leaf-popup"><div class="leaf-popup-inner">'
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
                        _options.afterPopup && $timeout(function() {
                            // Run in $timeout to make sure that everything done
                            _options.afterPopup.call(_this, ele);
                        });
                        _options.autoClose && angular.isNumber(_options.autoClose) && $timeout(function() { _this.close(); }, _options.autoClose);
                    }, function() {
                    });
                };

                angular.extend(popup.prototype, proto);

                return new popup();
            }
        };
    });

    leafUi.factory('leafActionSheet', function(leafPopup) {
        return {
            init: function(options) {
                var _defaultOptions, _options;
                _defaultOptions = {
                    className: 'leaf-action-sheet',
                    btns: [
                        {
                            name: 'cancel',
                            text: 'cancel',
                            className: 'btn btn-danger',
                            onTap: function() {
                                this.close();
                            }
                        }
                    ]
                };
                _options = angular.extend(_defaultOptions, options || {});
                if (_options.className.indexOf("leaf-action-sheet") === -1) {
                  // when custom className dont have 'leaf-action-sheet', fix it
                  _options.className += "leaf-action-sheet";
                }
                leafPopup.init(_options);
            }
        };
    });

    leafUi.factory('leafScroll', function() {
        var scrolls = {};
        return {
            init: function(ele, options) {
                var _defaultOptions, _options, scroll, id;
                _defaultOptions = {};
                _options = angular.extend(_defaultOptions, options || {});
                id = _options.id || ('leafScroll' + Date.now() + parseInt(Math.random() * 1000, 10));

                if (!scrolls.hasOwnProperty(id)) {
                    scroll = new IScroll(ele, _options);
                    scrolls[id] = scroll;
                } else {
                    throw 'The scroller with id ' + id + ' is already exist';
                }

                return scroll;
            },
            get: function(id) {
                return scrolls[id];
            },
            destroy: function(id) {
                scrolls[id].destroy();
                delete scrolls[id];
            }
        };
    });

    leafUi.directive('leafScroll', function($timeout, leafScroll) {
        return {
            restrict: 'E',
            transclude: true,
            link: function(scope, ele, attrs, ctrl, transclude) {
                var options, wrapper;
                // http://angular-tips.com/blog/2014/03/transclusion-and-scopes/
                // make content in leafScroll has same scope with leafScroll
                transclude(scope, function(clone, scope) {
                    var wrapper = angular.element('<div class="leaf-scroll-wrapper"></div>');
                    wrapper.append(clone);
                    ele.append(wrapper);
                });
                options = {
                    id: attrs.id,
                    probeType: 3,
                    click: true
                };
                if (angular.isDefined(attrs.horizontal)) {
                    ele.addClass('leaf-scroll-horizontal');
                    wrapper = ele.children()[0];
                    wrapper.setAttribute('style', 'width:' + wrapper.clientWidth + 'px');
                    options.scrollY = false;
                    options.scrollX = true;
                }
                var scroll = leafScroll.init(ele[0], options);
                scroll.on('beforeScrollStart', function() {
                    // disable leafContentScroll when scroll inner scroller
                    leafScroll.get('leafContentScroll').disable();
                });
            }
        };
    });

    leafUi.directive('leafContent', function($rootScope, $timeout, leafScroll) {
        return {
            restrict: 'E',
            transclude: true,
            link: function(scope, ele, attrs, ctrl, transclude) {
                // http://angular-tips.com/blog/2014/03/transclusion-and-scopes/
                // make content in leafContent has same scope with leafContent
                transclude(scope, function(clone, scope) {
                    var wrapper = angular.element('<div class="leaf-content-wrapper"></div>');
                    wrapper.append(clone);
                    ele.append(wrapper);
                });
                // add a empty block which height equal footer's height to make IScroll can reach bottom when init
                var footer = ele.parent().find('leaf-footer'), div = document.createElement('div'), height, rootRem, loadMoreHtml, exceedHeight, loadingIcon, pullLoadOptions = {}, pullLoadDistance = -40;
                rootRem = parseFloat(getComputedStyle(document.getElementsByTagName('html')[0]).fontSize.replace('px', ''));
                if (footer.length || angular.isDefined(attrs.offset)) {
                    div.text = "&nbsp;";
                    height = footer[0] ? footer[0].clientHeight : 0;
                    if (angular.isDefined(attrs.offset) && !isNaN(parseFloat(attrs.offset))) {
                        if (attrs.offset.indexOf('rem') !== -1) {
                            height += (parseFloat(attrs.offset.replace('rem', '')) * rootRem);
                        } else {
                            height += parseFloat(attrs.offset.replace('px', ''));
                        }
                    }
                    height = height / rootRem;
                    div.setAttribute('style', 'height: ' + height + 'rem');
                    ele.children().append(div);
                }
                var scroll = leafScroll.init(ele[0], {
                    id: 'leafContentScroll',
                    probeType: 3,
                    click: true
                });
                scope.$leafContent = {};
                ele.bind('touchstart', function() {
                    // when has a nested iscroll, reenable outer scroll when touch
                    if (!scroll.enabled) {
                        scroll.enable();
                    }
                });
                $rootScope.$contentScroll = scope.$leafContent.scroll = scroll;
                $rootScope.$refresh = scope.$leafContent.refresh = function() {
                    // TODO: not always work properly after removed
                    //div.remove();
                    $timeout(function() {
                        scroll.refresh();
                        if(angular.isDefined(attrs.pullLoad)) {
                            exceedHeight = ele.children()[0].clientHeight - ele[0].clientHeight;
                        }
                    });
                };
                $timeout(function() {
                  //TODO: should detect auto, the magic number can't work always
                    scope.$leafContent.scroll.refresh();
                }, 500);
                if(angular.isDefined(attrs.pullLoad)) {
                    /*
                     * attrs.pullLoad = {
                     *      pullText,
                     *      releaseText,
                     *      distance,
                     *      load
                     * }
                     */
                    if (attrs.pullLoad !== "") {
                        pullLoadOptions = JSON.parse(attrs.pullLoad);
                    }
                    loadingIcon = '<svg version="1.1" class="leaf-loading-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"> <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/> <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z"> <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite"/> </path> </svg>';
                    loadMoreHtml = document.createElement('div');
                    loadMoreHtml.innerHTML = loadingIcon + "<span class='fa fa-arrow-up'></span><span class='pull-load-text'>" + (pullLoadOptions.pullText || "Pull up to load more") + "</span><span class='release-load-text'>" + (pullLoadOptions.releaseText || "Release to load more") + "</span>";
                    loadMoreHtml.setAttribute('class', 'leaf-load-more');
                    if (angular.isNumber(pullLoadOptions.distance)) {
                        pullLoadDistance = -(pullLoadOptions.distance);
                        loadMoreHtml.setAttribute('style', 'bottom:' + (pullLoadDistance / 2) + 'px');
                        loadMoreHtml.children[0].setAttribute('style', 'top:' + (pullLoadDistance / 2) + 'px');
                    }
                    ele.children().append(loadMoreHtml);
                    scope.$leafContent.pullLoad = {
                        enabled: true,
                        disable: function() {
                            this.enabled = false;
                            loadMoreHtml.classList.add('disabled');
                        },
                        enable: function() {
                            this.enabled = true;
                            loadMoreHtml.classList.remove('disabled');
                        }
                    };
                    scroll.on('scroll', function() {
                        if (scope.$leafContent.pullLoad.enabled) {
                            if ((exceedHeight + this.y) < pullLoadDistance) {
                                loadMoreHtml.classList.add('ready-to-load');
                            } else {
                                loadMoreHtml.classList.remove('ready-to-load');
                            }
                        }
                    });
                    /* TODO: if desktop support required, can detect env to decide to use 'touched' or 'mouseup' */
                    ele.bind('touchend', function() {
                        if (loadMoreHtml.classList.contains('ready-to-load')) {
                            loadMoreHtml.classList.remove('ready-to-load');
                            loadMoreHtml.classList.add('start-loading');
                            scope[pullLoadOptions.load].call(ele, function() {
                                loadMoreHtml.classList.remove('start-loading');
                                $timeout(function() {
                                    scroll.refresh();
                                    exceedHeight = ele.children()[0].clientHeight - ele[0].clientHeight;
                                });
                            });
                        }
                    });
                    $timeout(function() {
                        exceedHeight = ele.children()[0].clientHeight - ele[0].clientHeight;
                    });
                }
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
        + "</div>";
        return {
            restrict: 'E',
            template: tpl,
            scope: {
                options: "@",
                ngModel: "=",
                ngChange: "&",
                relateTo: "=" // TODO: why @ not working
            },
            controller: function($scope) {
                $scope.$showSelect = function() {
                    var optionTpl = "<div class='list'>"
                        +     "<div  ng-class='{\"item checked\": option.checked, \"item\" :!options.checked}' ng-repeat='option in copiedOptions track by $index' ng-click='$changeSelectValue(option);'>{{ option.text }}"
                        +       "<span ng-class='{\"" + $scope.checkedIconClass + "\": option.checked, \"\" :!options.checked}'></span>"
                        +     "</div>"
                        + "</div>";
                    $scope.optionsPopup = leafPopup.init({
                        template: optionTpl,
                        scope: $scope,
                        className: 'leaf-select-popup',
                        btns: false
                    });
                };
                $scope.$changeSelectValue = function(option) {
                    var oldValue, newValue;
                    oldValue = angular.copy($scope.ngModel, oldValue);
                    newValue = $scope.ngModel = option.value;
                    $scope.selected = option.text;
                    $scope.copiedOptions.forEach(function(option) {
                        option.checked = false;
                    });
                    option.checked = true;
                    $scope.optionsPopup.close();
                    $scope.ngChange({'newValue': newValue, 'oldValue': oldValue});
                };
            },
            link: function(scope, ele, attrs) {
                if(!attrs.ngModel) throw "ng-model must specified to leaf-select";
                scope.checkedIconClass = attrs.checkedIconClass || "fa fa-check";
                scope.selected = attrs.defaultText || "---";
                function copyOptions() {
                    scope.copiedOptions = JSON.parse(scope.options);
                    scope.copiedOptions.forEach(function(option) {
                        option.checked = angular.equals(option.value, scope.ngModel);
                        if (option.checked) scope.selected = option.text;
                    });
                }
                scope.$watch('options', function() {
                    copyOptions();
                }, true);
                if (!!attrs.relateTo) {
                    scope.$watch('relateTo', function() {
                        scope.selected = attrs.defaultText || "---";
                        scope.ngModel = null;
                    });
                }
                copyOptions();
            }
        };
    });

    leafUi.directive('leafDatepicker', function(leafPopup, leafScroll, $document) {
        var tpl = "<div class='leaf-datepicker-wrapper'>"
        +   "<div class='leaf-datepicker-picked' ng-click='$showDatepicker()'>{{ $pickedYear }} - {{ $pickedMonth }} - {{ $pickedDay }}</div>"
        + "</div>";
        return {
            restrict: 'E',
            template: tpl,
            scope: {
                ngModel: "=",
                ngChange: "&",
            },
            controller: function($scope) {
                $scope.$showDatepicker = function() {
                    $scope.$pickedYearTemp = $scope.$pickedYear;
                    $scope.$pickedMonthTemp = $scope.$pickedMonth;
                    $scope.$pickedDayTemp = $scope.$pickedDay;
                    var optionTpl = "<leaf-scroll class='list' id='yearScroll'>"
                        +     "<div ng-class='{\"item picked\": year===$pickedYearTemp, \"item\" :!options.checked}' ng-repeat='year in $years track by $index' ng-click='pickYear(year)'>{{ year }}</div>"
                        +     "</leaf-scroll>"
                        + "<div class='list text'>{{ $text.year }}</div>"
                        + "<leaf-scroll class='list' id='monthScroll'>"
                        +     "<div ng-class='{\"item picked\": month===$pickedMonthTemp, \"item\" :!options.checked}' ng-repeat='month in $monthes track by $index' ng-click='pickMonth(month)'>{{ month }}</div>"
                        +     "</leaf-scroll>"
                        + "<div class='list text'>{{ $text.month }}</div>"
                        + "<leaf-scroll class='list' id='dayScroll'>"
                        +     "<div ng-class='{\"item picked\": day===$pickedDayTemp, \"item\" :!options.checked}' ng-repeat='day in $days track by $index' ng-click='pickDay(day)'>{{ day }}</div>"
                        +     "</leaf-scroll>"
                        + "<div class='list text'>{{ $text.day }}</div>";
                    var yearScroller, monthScroller, dayScroller;
                    $scope.optionsPopup = leafPopup.init({
                        template: optionTpl,
                        scope: $scope,
                        className: 'leaf-datepicker-popup',
                        btns: [
                            {
                                name: "cancel",
                                text: "Cancel",
                                onTap: function() {
                                    leafScroll.destroy('yearScroll');
                                    leafScroll.destroy('monthScroll');
                                    leafScroll.destroy('dayScroll');
                                    this.close();
                                }
                            },
                            {
                                name: "ok",
                                text: "Ok",
                                onTap: function() {
                                    leafScroll.destroy('yearScroll');
                                    leafScroll.destroy('monthScroll');
                                    leafScroll.destroy('dayScroll');
                                    this.close();
                                    $scope.$pickedYear = $scope.$pickedYearTemp;
                                    $scope.$pickedMonth = $scope.$pickedMonthTemp;
                                    $scope.$pickedDay = $scope.$pickedDayTemp;
                                    $scope.ngModel = {
                                        year: $scope.$pickedYear,
                                        month: $scope.$pickedMonth,
                                        day: $scope.$pickedDay,
                                        timestamp: new Date($scope.$pickedYear + '-' + $scope.$pickedMonth + '-' + $scope.$pickedDay).getTime()
                                    };
                                }
                            }
                        ],
                        afterPopup: function(ele) {
                            var itemHeight = ele[0].querySelector('.item').clientHeight;
                            yearScroller  = leafScroll.get('yearScroll');
                            monthScroller  = leafScroll.get('monthScroll');
                            dayScroller  = leafScroll.get('dayScroll');
                            yearScroller.refresh();
                            yearScroller.scrollTo(0, -itemHeight * ($scope.$yearRange[1] - 2));
                            monthScroller.refresh();
                            monthScroller.scrollTo(0, -itemHeight * ($scope.$pickedMonth - 3));
                            dayScroller.refresh();
                            dayScroller.scrollTo(0, -itemHeight * ($scope.$pickedDay - 3));
                            yearScroller.on('scroll', function() {
                                var times = this.y / itemHeight, flooredTimes = Math.floor(times);
                                if (times + flooredTimes > 0.1 || times + flooredTimes < -0.1) {
                                    $scope.$apply(function() {
                                        $scope.$pickedYearTemp = $scope.$years[Math.abs(flooredTimes)];
                                    });

                                }
                            });
                            yearScroller.on('scrollEnd', function() {
                                var times = this.y / itemHeight;
                                if (times.toString().indexOf('.') !== -1) {
                                    yearScroller.scrollTo(0, Math.floor(times) * itemHeight, 300);
                                }
                            });
                            monthScroller.on('scroll', function() {
                                var times = this.y / itemHeight, flooredTimes = Math.floor(times);
                                if (times + flooredTimes > 0.1 || times + flooredTimes < -0.1) {
                                    $scope.$apply(function() {
                                        $scope.$pickedMonthTemp = $scope.$monthes[Math.abs(flooredTimes)];
                                    });
                                }
                            });
                            monthScroller.on('scrollEnd', function() {
                                var times = this.y / itemHeight;
                                if (times.toString().indexOf('.') !== -1) {
                                    monthScroller.scrollTo(0, Math.floor(times) * itemHeight, 300);
                                }
                            });
                            dayScroller.on('scroll', function() {
                                var times = this.y / itemHeight, flooredTimes = Math.floor(times);
                                if (times + flooredTimes > 0.1 || times + flooredTimes < -0.1) {
                                    $scope.$apply(function() {
                                        $scope.$pickedDayTemp = $scope.$days[Math.abs(flooredTimes)];
                                    });
                                }
                            });
                            dayScroller.on('scrollEnd', function() {
                                var times = this.y / itemHeight;
                                if (times.toString().indexOf('.') !== -1) {
                                    dayScroller.scrollTo(0, Math.floor(times) * itemHeight, 300);
                                }
                            });
                        }
                    });
                };
                $scope.pickYear = function(year) {
                    $scope.$pickedYearTemp = year;
                };
                $scope.pickMonth = function(month) {
                    $scope.$pickedMonthTemp = month;
                };
                $scope.pickDay = function(day) {
                    $scope.$pickedDayTemp = day;
                };
            },
            link: function(scope, ele, attrs) {
                if(!attrs.ngModel) throw "ng-model must specified to leaf-datepicker";
                scope.$text = {
                    year: (attrs.text && attrs.text.year) || "year",
                    month: (attrs.text && attrs.text.month) || "month",
                    day: (attrs.text && attrs.text.day) || "day",
                };
                scope.$yearRange = [-5, 5];
                scope.$currentDate = {
                    date: new Date()
                };
                scope.$currentDate.year = scope.$currentDate.date.getYear() + 1900;
                scope.$currentDate.month = scope.$currentDate.date.getMonth() + 1;
                scope.$currentDate.day = scope.$currentDate.date.getDate();
                scope.$pickedYear = scope.$currentDate.year;
                scope.$pickedMonth = scope.$currentDate.month;
                scope.$pickedDay = scope.$currentDate.day;
                scope.$years = generateYears();
                scope.$monthes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                scope.$watch('$pickedYear', function() {
                    scope.$days = generateDays();
                });
                scope.$watch('$pickedMonth', function() {
                    scope.$days = generateDays();
                });

                function generateYears() {
                    var years = [];
                    for (var i = scope.$currentDate.year + scope.$yearRange[0]; i <= scope.$currentDate.year + scope.$yearRange[1]; i++) {
                        years.push(i);
                    }
                    return years;
                }
                function generateDays() {
                    var dayCount = 0, days = [], month = scope.$pickedMonth, year = scope.$pickedYear;

                    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 9 || month == 10 || month == 12)  {
                        dayCount = 31;
                    } else if (month == 4 || month == 6 || month == 8 || month == 11)  {
                        dayCount = 30;
                    } else  { // 2月份，闰年29天、平年28天
                        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)  {
                            dayCount = 29;
                        }  else {
                            dayCount = 28;
                        }
                    }
                    for(var i = 1; i <= dayCount; i++) {
                        days.push(i);
                    }

                    return days;
                }
            }
        };
    });

    leafUi.directive('leafToggle', function() {
        var tpl = "<div class='leaf-toggle-wrapper'>"
                +   "<span class='leaf-toggle-label'>{{ label }}</span>"
                +   "<span ng-class='{\"leaf-toggle-toggler actived\": ngModel, \"leaf-toggle-toggler\": !ngModel}' ng-click='$toggleState()'><span class='leaf-toggle-spinner'></span></span>"
                + "</div>";
        return {
            template: tpl,
            restrict: 'E',
            transclude: true,
            scope: {
                ngModel: "=",
                label: "@"
            },
            controller: function($scope) {
                $scope.$toggleState = function() {
                    $scope.ngModel = !$scope.ngModel;
                };
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
                        html += '<label class="' + (scope.ngModel === radio.value ? "radio checked" : "radio") + '"><input type="radio" ng-model="ngModel" value="' + radio.value + '">'
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
                } else {
                    scope.ngModel.forEach(function(v) {
                        if (!angular.isString(v)) {
                            throw 'value in ng-model must be a string';
                            return;
                        }
                    })
                }
                if (scope.checkboxes) {
                    var html = "";
                    scope.checkboxes.forEach(function(checkbox) {
                        html += '<label class="' + (scope.ngModel[0] === checkbox.value.toString() ? "checkbox checked" : "checkbox") + '"><input type="checkbox" ng-model="ngModel" value="' + checkbox.value + '">'
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
                } else {
                    scope.$currentTab = '#' + attrs.id;
                }
                scope.$on('tabSwitching', function(e, tab) {
                    scope.$currentTab = tab;
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
            scope: {
                onTabSwitched: "="
            },
            link: function(scope, ele, attrs) {
                var switchedTab = 0, tabs = ele.children().length;
                ele.children()[0].classList.add('current');
                function bindClick() {
                    switchedTab = 0;
                    angular.forEach(ele.children(), function(nav) {
                        nav.onclick = function() {
                            nav.parentElement.querySelector('.current').classList.remove('current');
                            nav.classList.add('current');
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
                        // when tabSwitching loop of leafTab done
                        bindClick();
                        $rootScope.$refresh();
                        $rootScope.$contentScroll.scrollTo(0, 0);
                        scope.onTabSwitched && scope.onTabSwitched();
                    }
                });
                bindClick();
            }
        };
    });

    leafUi.factory('leafSidebar', function($rootScope, $timeout) {
        return {
            toggle: function(sidebarId) {
                // prevent 'inprog' caused by 'ng-click' function call
                $timeout(function() { $rootScope.$broadcast('toggleLeafSidebar', sidebarId); });
            }
        };
    });

    /* @usage: <anythhing leaf-sidebar-toggle=""/"sidebarId"> (when value is empty, toggle all sidebar)*/
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

    leafUi.directive('leafSidebar', function($timeout) {
        // http://angular-tips.com/blog/2014/03/transclusion-and-scopes/
        return {
            restrict: 'E',
            scope: true,
            transclude: true,
            link: function(scope, ele, attrs, ctrl, transclude) {
                var toggler;
                if (angular.isDefined(attrs.right)) {
                    // hide the right sidebar to prevent seeing animation when add 'right-side' class
                    ele.attr('style', 'display: none');
                    ele.addClass('right-side');
                    $timeout(function() {
                        ele.attr('style', 'display: block');
                    }, 50);
                }
                scope.$on('toggleLeafSidebar', function(e, sidebar) {
                    scope.$apply(function() {
                        if (sidebar === "") {
                            ele.toggleClass('show-sidebar');
                        } else if (attrs.id === sidebar) {
                            ele.toggleClass('show-sidebar');
                        }
                    });
                });
                toggler = angular.element('<div class="leaf-sidebar-toggler"></div>');
                toggler.bind('click', function() {
                    ele.removeClass('show-sidebar');
                });
                ele.append(toggler);
                scope.$hideSidebar = function() {
                    ele.removeClass('show-sidebar');
                };
                // make transcludedHtml and directive has same scope
                transclude(scope, function(clone, scope) {
                    var wrapper = angular.element('<div class="leaf-sidebar-wrapper"></div>');
                    wrapper.append(clone);
                    ele.append(wrapper);
                });
            }
        };
    });

    leafUi.directive('leafSlider', function($timeout) {
        var tpl = "<div class='swiper-wrapper' ng-transclude></div>";
        return {
            template: tpl,
            restrict: 'E',
            transclude: true,
            link: function(scope, ele, attrs) {
                var swiper;
                ele.attr('class', 'swiper-container');
                angular.forEach(ele.children().children(), function(child) {
                    angular.element(child).wrap('<div class="swiper-slide"></div>');
                });
                ele.append('<div class="swiper-pagination"></div>');
                swiper = new Swiper(ele[0], {
                    autoplay: 1000,
                    speed: 400,
                    spaceBetween: 100,
                    pagination: '.swiper-pagination'
                });
            }
        };
    });

    leafUi.factory('leafSlider', function($timeout, $q) {
        return {
            getSlider: function(id) {
                var deferred = $q.defer(), ele;
                $timeout(function() {
                    ele = id ? document.getElementById(id) : document.getElementsByTagName('leaf-slider')[0];
                    deferred.resolve(angular.extend(ele.swiper, {
                        resume: function() {
                            // manully autoplay the swiper
                            // when swiper is in the hidden tab, autoplay will not work. This can be useful.
                            this.stopAutoplay();
                            this.startAutoplay();
                        }
                    }));
                });
                return deferred.promise;
            },
            getSliders: function() {
                var deferred = $q.defer(), swipers = [];
                $timeout(function() {
                    angular.forEach(document.getElementsByTagName('leaf-slider'), function(slider) {
                        swipers.push(angular.extend(slider.swiper, {
                            resume: function() {
                                // manully resume autoplay the swiper
                                // when swiper is in the hidden tab, autoplay will not work. This can be useful.
                                this.stopAutoplay();
                                this.startAutoplay();
                            }
                        }));
                    });
                    deferred.resolve(swipers);
                });
                return deferred.promise;
            }
        };
    });

    leafUi.factory('leafPageload', function($document) {
        var loadingELe = $document.find('leaf-page-loading');
        return {
            start: function() {
              loadingELe.removeClass('ng-hide');
            },
            done: function() {
              loadingELe.addClass('ng-hide');
            }
        };
    });
})(IScroll, Swiper, window);
