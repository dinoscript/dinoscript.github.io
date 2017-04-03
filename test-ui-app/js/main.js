(function () {
    'use strict';
    angular
        .module('test-ui-app', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/main', {
                    templateUrl: 'views/main.view.html'
                })
                .when('/main/last-items', {
                    templateUrl: 'views/last-items.view.html'
                })
                .when('/main/best-comments', {
                    templateUrl: 'views/best-comments.view.html'
                })
                .when('/main/overview', {
                    templateUrl: 'views/overview.view.html',
                    controller: 'OverviewCtrl',
                    controllerAs: 'overviewCtrl',
                    resolve: {
                        getData: getData
                    }
                })
                .otherwise({
                    redirectTo: '/main/overview'
                });
        }]);
    getData.$inject = ['DataService'];
    function getData(DataService) {
        return DataService.promise;
    }
})();

(function () {
    'use strict';
    angular
        .module('test-ui-app')
        .directive('comments', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/comments.directive.html'
            }
        })
})();
(function () {
    'use strict';
    angular
        .module('test-ui-app')
        .directive('items', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/items.directive.html'
            }
        })
})();
(function () {
    'use strict';
    angular
        .module('test-ui-app')
        .directive('navigation', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/navigation.directive.html'
            }
        })
})();
(function () {
    'use strict';
    angular
        .module('test-ui-app')
        .controller('CommentsCtrl', CommentsCtrl);
    CommentsCtrl.$inject = ['DataService'];
    function CommentsCtrl(DataService) {// Comments section controller
        var comments = this;
        comments.createItemComment = DataService.createItemComment;
        comments.saveToLocalStorage = DataService.saveToLocalStorage;
    }
})();

(function () {
    'use strict';
    angular
        .module('test-ui-app')
        .controller('ItemsCtrl', ItemsCtrl);
    ItemsCtrl.$inject = ['DataService'];
    function ItemsCtrl(DataService) {// Items section controller
        var items = this;
        items.itemsArray = DataService.getAllItems();
        items.createItem = DataService.createItem;
        items.deleteItem = DataService.deleteItem;
        items.saveToLocalStorage = DataService.saveToLocalStorage;
    }
})();

(function () {
    'use strict';
    angular
        .module('test-ui-app')
        .controller('NavCtrl', NavCtrl);
    function NavCtrl() {// Navigation section controller
        var nav = this;
        nav.navItems = [{// Array of navbar elements
            navItemName: 'Main',
            navItemHref: '#!main',
            navSubItems: [{navSubItemName: 'Overview', navSubItemHref: '#!main/overview'},
                {navSubItemName: 'Last items', navSubItemHref: '#!main/last-items'},
                {navSubItemName: 'Best comments', navSubItemHref: '#!main/best-comments'}]
        }];
        nav.activeNavItem = nav.navItems[0].navSubItems[0];// Selecting the default menu item
        nav.setActive = function (navItem) {// Set the selected default menu item
            nav.activeNavItem = navItem
        }
    }
})();


(function () {
    'use strict';
    angular
        .module('test-ui-app')
        .controller('OverviewCtrl', OverviewCtrl);
    OverviewCtrl.$inject = ['DataService'];
    function OverviewCtrl(DataService) {// Overview section controller
        var overview = this;
        overview.items = DataService.getAllItems();
        overview.selectedItem = overview.items[0];// Set the selected default item
    }
})();

(function () {
    'use strict';
    angular
        .module('test-ui-app')
        .factory('DataService', DataService);
    DataService.$inject = ['$http'];
    function DataService($http) {// Factory for data manage
        var data = {}, promise;
        if (localStorage.getItem('data')) {// Downloading data from LocalStorage
            data.items = JSON.parse(localStorage.getItem("data")).items;
        } else {// Downloading default data from server
            promise = $http.get('data/items.json').then(function (response) {
                data.items = response.data;
            });
        }
        return {
            promise: promise,
            saveToLocalStorage: function (key, obj) {// Save data to the LocalStorage
                localStorage.setItem(key, JSON.stringify(obj))
            },
            getAllItems: function () {// Return all items
                return data.items;
            },
            createItem: function (newItem) {// Add new item to the Items section
                for (var i = 0; i < data.items.length; i++) {
                    if (data.items[i].itemName == newItem.itemName) {
                        return;
                    }
                }
                newItem.comments = [];
                data.items.push(newItem);
                this.saveToLocalStorage('data', data);
            },
            deleteItem: function (item) {// Delete item from the Items section
                var index = data.items.indexOf(item);
                data.items.splice(index, 1);
                this.saveToLocalStorage('data', data);
            },
            createItemComment: function (selectedItem, newComment) {// Add new comment to the Comments section
                selectedItem.comments.push(newComment);
                this.saveToLocalStorage('data', data);
            }
        };
    }
})();


