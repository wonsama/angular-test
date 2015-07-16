/*
    TODO

    1. validation : 
        조회 목록에 존재하지 않는 항목만 등록할 수 있도록 버튼을 비/활성 처리를 구현
        https://docs.angularjs.org/guide/forms
        http://www.w3schools.com/angular/angular_validation.asp

    2. 2중 팝업
        parent를 잘 설정해야 됨.
        팝업 후 동일 parent로 팝업을 show 하면 기본적으로 이전 팝업은 cancel 처리가 됨.
*/

var URL_PREFIX = "http://localhost:8080";
var URL_CODE_LIST = URL_PREFIX + "/common/code/list";
var URL_GROUP_LIST = URL_PREFIX + "/common/group/list";
var URL_CODE_INS = URL_PREFIX + "/common/code/insert";
var URL_CODE_DEL = URL_PREFIX + "/common/code/delete";

var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.selection', 'ngMaterial', 'ngMdIcons', 'ngMessages']);

/*
 * 설정 : 컨트롤러
 */
app.controller('MainCtrl', function($scope, $http, i18nService, $mdToast, $animate, $mdDialog, $timeout) {

    /*
     * 설정 : 그리드
     */
    $scope.gridOptions = {
        columnDefs: [{
            name: 'NO',
            field: 'no'
        }, {
            name: '그룹 ID',
            field: 'grp_id'
        }, {
            name: '그룹 명',
            field: 'grp_nm'
        }, {
            name: '코드 ID',
            field: 'cd_id'
        }, {
            name: '코드 명',
            field: 'cd_nm'
        }],
        enableRowSelection: true,
        showGridFooter: true,
        multiSelect: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    /*
     * 설정 : 그리드 - 한국어 지원
     */
    i18nService.setCurrentLang('ko');

    /*
     * 설정 : 조회 정보
     */
    $scope.searchData = {
        grp_nm: "",
        cd_nm: ""
    };

    /*
     * 설정 : post 전송 형태 변경 ( json => form-url-encoded )
     */
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    /*
     * 설정 : 토스트
     */
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

    /*
     * 조회 : 공통코드 목록
     */
    $scope.select = function() {


        //공통코드 목록 조회
        var res = $http.post(URL_CODE_LIST, jw.serializeData($scope.searchData));
        res.success(function(data, status, headers, config) {

            //그리드 갱신
            $scope.gridOptions.data = data;

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

        //토스트 : 조회 중 임을 알려준다
        $mdToast.show(
            $mdToast.simple()
            .content('조회 중 입니다 ...')
            .position($scope.getToastPosition())
            .hideDelay(1000)
        );
    };

    /*
    * 변경 : 공통코드
    */
    $scope.update = function(ev) {

        var item = $scope.gridApi.selection.getSelectedGridRows()[0];
        if(item==undefined){
            return;
        }
        
        $mdDialog.show({
            controller: updateController,
            templateUrl: 'angular-code-002.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals : {
                item : item.entity
            }
        })
    };

    /*
    * 컨트롤러 : update - 코드 변경 Dialog
    */
    function updateController($scope, $mdDialog, item){
        /**
         * 버튼 : 닫기 또는 취소 
         */
        $scope.close = function() {
            $mdDialog.cancel();
        };

        $scope.wow = JSON.stringify( item );

        // console.log( item );
    }

    /*
     * 등록 : 공통코드 
     */
    $scope.insert = function(ev) {
        $mdDialog.show({
            controller: insertController,
            templateUrl: 'angular-code-001.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
        }).then(function(response) {
            // console.log( "ok ");
            // console.log( JSON.stringify(response) );            

            //등록 : 공통코드를 등록한다
            $http.post(URL_CODE_INS, jw.serializeData(response))
            .success(function(data) {
                console.log( data );
                $scope.select();
            }).error(function(data) {
                console.log("insert - error");
            });

        }, function() {
            // console.log( "cancel ");
        });
    };

    /**
     * 컨트롤러 : insert - 코드 등록 Dialog
     */
    function insertController($scope, $mdDialog, $timeout) {

        /*
         * 설정 : 그리드 기본 설정 
         */
        $scope.gridOptionsGroup = {
            columnDefs: [{
                name: 'NO',
                field: 'no'
                , width : 50
                , enableSorting: false
                , enableColumnMenu: false
            }, {
                name: '코드 ID',
                field: 'cd_id'
                , enableSorting: false
                , enableColumnMenu: false
            }, {
                name: '코드 명',
                field: 'cd_nm'
                , enableSorting: false
                , enableColumnMenu: false
            }],
            data: []
        };

        /*
         * 조회 : 그룹 코드 목록 조회
         */
        $http.post(URL_GROUP_LIST).success(function(data) {
            $scope.groups = data;

            //폼 기본 값 설정 및 초기 조회
            $scope.formData = {};   //값은 이때 첨으로 설정되어 신규 생성된다.
            $scope.formData.grp_id = "G000";    //테스트 용
            $scope.chgGroup();
        });

        /*
         * 변경 : 그룹코드 목록 선택 변경
         */
        $scope.chgGroup = function() {

            // console.log( "change : " + $scope.formData.grp_id);

            //조회 : 해당 그룹에 기 입력된 목록 조회
            $http.post(URL_CODE_LIST, jw.serializeData({
                grp_id: $scope.formData.grp_id
            })).success(function(data) {
                $scope.gridOptionsGroup.data = data;
            });
        };

        /**
         * 버튼 : 닫기 또는 취소 
         */
        $scope.close = function() {
            $mdDialog.cancel();
        };

        /** 
         * 버튼 : 등록
         */
        $scope.register = function() {
            $mdDialog.hide( $scope.formData );
        }

        /**
         * 버튼 : 지우기
         */
        $scope.clear = function() {
            $scope.gridOptionsGroup.data = [];
            $scope.formData = undefined;
        }

    }

    /*
     * 삭제 : 선택 코드 목록 삭제
     */
    $scope.delete = function() {
        //ref : forEach
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        var items = $scope.gridApi.selection.getSelectedGridRows();
        var data = [];
        items.forEach(function(item) {
            // console.log(item.entity);
            data.push(item.entity.cd_id);
        });

        //선택 정보 점검 및 알림
        if(data.length==0){
            var alert = $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('알림')
            .content('선택 항목이 존재하지 않습니다.')
            .ok('닫기');

            $mdDialog.show(alert);
            $timeout(function(){
                $mdDialog.cancel();
            },2000);
            return;
        }

        //삭제 알림 확인
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('삭제')
            .content('선택한 {{count}}개의 정보를 삭제 하시겠습니까 ?'.replace("{{count}}",data.length))
            .ariaLabel('delete')
            .ok('삭제')
            .cancel('취소');

        //삭제 수행
        $mdDialog.show(confirm).then(function() {
            $http.post(URL_CODE_DEL, jw.serializeData( { data : data.join(',') } ))
            .success(function(data) {
                // console.log( data );
                $scope.select();
            });
        });        

    };

    /*
     * 즉시 수행 : 목록 조회
     */
    (function() {
        $scope.select();
    })();

});

/*
 * application 설정
 */
app.config(function($mdThemingProvider) {

    /*
     * 테마 색상 설정 
     */
    $mdThemingProvider.theme('default')
        .primaryPalette('cyan')
        .accentPalette('green')
        .warnPalette('red');
});
