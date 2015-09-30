Leaf-angular
---
#一个基于angularjs的框架

- 作者: maple-leaf
- 邮箱: tjfdfs@gmail.com

---

#A framework based on angularjs

- Author: maple-leaf
- Email: tjfdfs@gmail.com

# 使用到的第三方js或者css
- [angularjs](https://github.com/angular/angular)
- [iscroll](https://github.com/cubiq/iscroll)
- [swiper.js](https://github.com/nolimits4web/Swiper)
- [bourbon](https://github.com/thoughtbot/bourbon)
- [fontawesome](http://fontawesome.io/)

# Docs
### 1. Basic template

    <!DOCTYPE HTML>
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Template</title>
            <link href="path/to/leaf.min.css" rel="stylesheet" type="text/css" media="all">
            <link href="path/to/yourApp.css" rel="stylesheet" type="text/css" media="all">
        </head>
        <body ng-app="todoDemo" ng-cloak>
            <leaf-wrapper ng-controller="todoCtrl">
            	<leaf-header>This is fixed header, optional</leaf-header>
                <leaf-content>
                  This is the main content area
                </leaf-content>
                <leaf-footer>This is fixed footer, optional</leaf-footer>
                <leaf-sidebar right>This is sidebar on the right side, optional</leaf-sidebar>
            </leaf-wrapper>
            <script src="path/to/leaf.min.js" type="text/javascript"></script>
            <script src="path/to/yourApp.js" type="text/javascript"></script>
        </body>
    </html>

### 2. <leaf-content>  --- use Iscroll to implement the scroll effect
- Attribute `pull-load`

        // has four configurable option
                attrs.pullLoad = {
                    pullText, // String, default is "pull up to load more", Optional
                    releaseText, // String, default is "release to load more", Optional
                    distance, // Number, default is "-40", the distance being pulled up after reaching bottom of `leaf-content`. when reached, pullText will be hidden and releaseText will be visible, Optional
                    load // Function, the function will be called to load more data from server after you release, Required
                 }
                 /* example */
                 <leaf-content pull-load='{"load": "loadMore"}'>
                    .... more code ....
                 </leaf-content>
        // control `pullLoad` at controller
        todoDemo.controller('todoCtrl', function($scope) {
            $scope.$leafContent.pullLoad.disable();
            $scope.$leafContent.pullLoad.enable();
        }
- refresh manually

        todoDemo.controller('todoCtrl', function($scope, $rootScope) {
            $scope.$leafContent.refresh(); // call from scope of `leaf-content`
            $rootScope.$refresh(); // call from rootScope
        }
- get iscroll instance of `leaf-scroll`

        todoDemo.controller('todoCtrl', function($scope, $rootScope, leafScroll) {
            var scrollInstanceOfLeafContent;
            scrollInstanceOfLeafContent= $scope.$leafContent.scroll; // from scope of `leaf-content`
            scrollInstanceOfLeafContent = $rootScope.$contentScroll; // from rootScope
            scrollInstanceOfLeafContent = leafScroll.get('leafContentScroll'); // from `get` method of factory `leafScroll` by passing id of scroll
        }

### 3.<leaf-scroll> --- like <leaf-content> but doesn't have `pull-load` while has `horizontal` attribute
- Attribute `horizontal`

        /* example */
        <leaf-scroll id="verticalScroller">...more code or text...</leaf-scroll> // vertical scroller
        <leaf-scroll horizontal id="horizontalScroller">...more code or text...</leaf-scroll> // horizontal scroller
- get iscroll instance of `leaf-scroll`

        todoDemo.controller('todoCtrl', function(leafScroll) {
            var scrollInstance;
            scrollInstance = leafScroll.get('verticalScroller'); // from `get` method of factory `leafScroll` by passing id of scroll
            scrollInstance = leafScroll.get('horizontalScroller');
        }
- <leaf-scroll> can be placed inside <leaf-content> and <leaf-scroll>, but <leaf-content> can't be placed inside <leaf-side> which may cause unknown problem

### 4. <leaf-select> --- implement <select> using popup
- Attributes
    * options --> json array of options of select, Required
    * default-text --> the text showed at initial state, default is "---", Optional
    * checked-icon-class --> classes string seperated by space, Optional
    * ng-change --> the function to process changes, Optional
    * relate-to --> create relationship of self's model and specified model, when specified model change, this will be reset. Optional


        /* example */
            <leaf-select options="{{ myOptions }}" ng-model="selectedOption" default-text="choose one option" checked-icon-class="iconfont iconfont-myCheckedIcon"></leaf-select>
            <leaf-select options="{{ relativeOptions }}" ng-model="selectedOption2" default-text="choose one option" checked-icon-class="iconfont iconfont-myCheckedIcon" relate-to="selectedOption"></leaf-select>
        /* js */
        todoDemo.controller('todoCtrl', function($scope) {
            $scope.myOptions = [
                {
                    text: 'option 1',
                    value: '1'
                },
                {
                    text: 'option 2',
                    value: '2'
                }
            ];
            $scope.relativeOptions = [
                {
                    text: 'option 1',
                    value: '1'
                },
                {
                    text: 'option 2',
                    value: '2'
                }
            ];
        }
        
### 5. <leaf-datepicker>
- Attributes
    * text --> JSON string, {year,month,day}

            /* example */
            <leaf-datepicker ng-model="birthday"></leaf-datepicker>
    
### 6. <leaf-toggle>
    /* example */
    <leaf-toggle ng-model="myState" label="This is a Toggler"></leaf-toggle>
    
### 7. <leaf-radio>
- Attributes
    * radios --> json array, Required
    * horizontal --> layout the options horizontal
    

     /* example */
     <leaf-radio radios="countries" ng-model="country"></leaf-radio>
     
     /* js */
     
     todoDemo.controller('todoCtrl', function($scope) {
        $scope.countries = [
        {
          text: "中国/china",
          value: "china"
        },
        {
          text: "其他/others",
          value: "others"
        }
      ];
      $scope.country = "china"; // assign initial value, Optional
    
### 8. <leaf-checkbox>
- Attributes
    * checkboxes --> json array
    * horizontal --> layout the options horizontal


     /* example */
     <leaf-checkbox checkboxes="colors" ng-model="color"></leaf-checkbox>
     
     /* js */
     
     todoDemo.controller('todoCtrl', function($scope) {
          $scope.colors = [
            {
              text: "红/red",
              value: "red"
            },
            {
              text: "蓝/blue",
              value: "blue"
            },
            {
              text: "黄/yellow",
              value: "yellow"
            }
          ];
          $scope.color = ["red"]; // Notice here, This should be a array when init
          
### 9. <leaf-tab-nav> and <leaf-tab>
- Attribute
  * on-tab-switched --> Function, a attribute of <leaf-tab-nav>, which will be called when switch tab, Optional


     /* example */
     <leaf-wrapper ng-controller="todoCtrl">
        <leaf-header>
            <leaf-tabs-nav on-tab-switched="onTabSwitched">
                <a href="#tab1">tab1</a>
                <a href="#tab2">tab2</a>
            </leaf-tabs-nav>
        </leaf-header>
        <leaf-content>
          <leaf-tab id="tab1" current>Tab 1</leaf-tab>
          <leaf-tab id="tab2">Tab 2</leaf-tab>
        </leaf-content>
        <leaf-footer>You switch to: {{ currentTab }}</leaf-footer>
    </leaf-wrapper>
    
    /* js */
    todoDemo.controller('todoCtrl', function($scope) {
      $scope.onTabSwitched = function() {
        $scope.currentTab = $scope.$currentTab;
      };
    });
    
### 10. <leaf-sidebar> and Attribute `leaf-sidebar-toggle`
     /* example */
     <leaf-wrapper>
        <leaf-content>
              <div leaf-sidebar-toggle="left" class="btn"><span class="fa fa-leaf"></span>Show sidebar at left side<span class="fa fa-leaf"></span></div>
              <div leaf-sidebar-toggle="right" class="btn"><span class="fa fa-leaf"></span>Show sidebar at right side<span class="fa fa-leaf"></span></div>
              <div leaf-sidebar-toggle class="btn"><span class="fa fa-leaf"></span>Show sidebar at both side<span class="fa fa-leaf"></span></div>
        </leaf-content>
        <leaf-sidebar id="left"><h2>Sidebar at left side</h2></leaf-sidebar>
        <leaf-sidebar id="right" right><h2>Sidebar at right side</h2></leaf-sidebar>
    </leaf-wrapper>
    
    /* control sidebar from js */
    todoDemo.controller('todoCtrl', function(leafSidebar) {
        leafSidebar.toggle('left'); // pass id of target sidebar
    });
    
### 11. <leaf-slider> and <leaf-slide>
     /* example */
     <leaf-slider id="slider1">
         <img ng-src="{{ b.img }}">
         <img ng-src="{{ a.img }}">
     </leaf-slider>
     /* if using ng-repeat, you should use <leaf-slide> */
     <leaf-slider id="slider2">
         <leaf-slide ng-repeat="img in imgs track by $index">
             <img ng-src="{{ img }}">
         </leaf-slide>
     </leaf-slider>
     
     /* get instance of slider from js */
     todoDemo.controller('todoCtrl', function(leafSlider) {
        var slider1 = leafSlider.getSlider('slider1'); // Object, pass id of target slider
        leafSlider.getSliders(); // Object array, get all slider
    });
    

# Changelog

- 0.1版本于2015-8-10发布，demo完成

# TODO

- ~~提供api文档~~
- 提供一套基础样式