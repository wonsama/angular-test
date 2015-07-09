var url = "http://localhost:8080/common/user/list/json";
var app = angular.module('app', ['ui.grid']);
app.controller('MainCtrl', ['$scope', '$http', 'i18nService', function($scope, $http, i18nService) {

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    var data = {
        rnk: "초급",
        nm: "김"
    };
    
    var res = $http.post(url, serializeData(data));
    i18nService.setCurrentLang('ko');

    console.log(serializeData(data));

    $scope.gridOptions = {};
    res.success(function(data, status, headers, config) {
        $scope.gridOptions.data = data;
    });
    res.error(function(data, status, headers, config) {
        alert("error");
    });

}]);

function serializeData(data) {

    // If this is not an object, defer to native stringification.
    if (!angular.isObject(data)) {

        return ((data == null) ? "" : data.toString());

    }

    var buffer = [];

    // Serialize each key in the object.
    for (var name in data) {

        if (!data.hasOwnProperty(name)) {

            continue;

        }

        var value = data[name];

        buffer.push(
            encodeURIComponent(name) +
            "=" +
            encodeURIComponent((value == null) ? "" : value)
        );

    }

    // Serialize the buffer and clean it up for transportation.
    var source = buffer
        .join("&")
        .replace(/%20/g, "+");

    return (source);

}
