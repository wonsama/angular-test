var url = "http://localhost:8080/common/user/list/json";
var app = angular.module('app', ['ui.grid', 'ngMaterial', 'ngMdIcons', 'ngMessages']);

//
app.controller('MainCtrl', function($scope, $http, i18nService, $mdToast, $animate, $mdDialog) {




    //set grid options
    $scope.gridOptions = {};

    //set default searchData
    $scope.searchData = {
        rnk: "",
        nm: ""
    };

    //set search count
    $scope.resultCount = 0;

    //set post header
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    //set language
    i18nService.setCurrentLang('ko');

    //set toast position
    $scope.toastPosition = {
        bottom: true,
        top: false,
        left: true,
        right: true
    };
    $scope.getToastPosition = function() {
        return Object.keys($scope.toastPosition)
            .filter(function(pos) {
                return $scope.toastPosition[pos];
            })
            .join(' ');
    };

    //function register
    $scope.register = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'angular-grid-2.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
        }).then(function(response) {
            $scope.regResult = "응답 : " + JSON.stringify(response);
        }, function() {
            $scope.regResult = "취소 버튼을 누르셨습니다.";
        });
    };

    function DialogController($scope, $mdDialog) {

        $scope.formData = undefined;

        $scope.grade = "";
        $scope.grades = [{
            key: "10",
            value: "초급"
        }, {
            key: "20",
            value: "중급"
        }, {
            key: "30",
            value: "고급"
        }, {
            key: "40",
            value: "특급"
        }];

        //clear
        $scope.clear = function() {
            $scope.formData = undefined;
        };

        //register
        $scope.register = function() {
            //hide 인 경우 부모 창에 값을 전달 할 수 있다.
            $mdDialog.hide($scope.formData);
        };

        //close
        $scope.close = function() {
            //cancel 인 경우 함수에 값이 없는(void) 형태로 전달된다
            $mdDialog.cancel();
        };
    }

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
    (function() {
        $scope.search();
    })();

});


app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('cyan');
});
