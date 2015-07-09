var url = "http://localhost:8080/common/user/list/json";
var app = angular.module('app', ['ui.grid', 'ngMaterial']);

//
app.controller('MainCtrl', function($scope, $http, i18nService, $mdToast, $animate) {

    //set grid options
    $scope.gridOptions = {};

    //set default searchData
    $scope.searchData = {
        rnk: "",
        nm: ""
    };

    $scope.resultCount = 0;

    //set post header
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    //set language
    i18nService.setCurrentLang('ko');

    //set toast position
    $scope.toastPosition = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.getToastPosition = function() {
        return Object.keys($scope.toastPosition)
            .filter(function(pos) {
                return $scope.toastPosition[pos];
            })
            .join(' ');
    };

    //function search
    $scope.search = function() {

        var res = $http.post(url, jw.serializeData($scope.searchData));

        res.success(function(data, status, headers, config) {
            $scope.gridOptions.data = data;

            $scope.resultCount = data.length;

            $mdToast.show(
                $mdToast.simple()
                .content('조회가 완료 되었습니다.')
                .position($scope.getToastPosition())
                .hideDelay(1000)
            );
        });
        res.error(function(data, status, headers, config) {
            $mdToast.show(
                $mdToast.simple()
                .content('조회가 실패 했습니다.')
                .position($scope.getToastPosition())
                .hideDelay(1000)
            );
        });

        $mdToast.show(
            $mdToast.simple()
            .content('조회 중 입니다 ...')
            .position($scope.getToastPosition())
            .hideDelay(1000)
        );
    };

    //default search
    (function(){
        $scope.search();
    })();

});
