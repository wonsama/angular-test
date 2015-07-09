var app = angular.module('app', ['ui.grid', 'ngMaterial']);
app.controller('AppCtrl', ['$scope', function($scope) {
    $scope.show = function(){
        alert("조회되었습니다.");
    };
}]);