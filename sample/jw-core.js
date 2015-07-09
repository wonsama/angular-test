var jw = {

    /**
     * 보내려는 데이터를 직렬화 처리하여 반환한다
     * ref : https://gist.github.com/bennadel/11212050
     * @param data 직렬화 하려는 데이터 
     * @return 직렬화 된 값
     * @since 2015.07.09
     */
    "serializeData": function(data) {

        // console.log( data );

        //오브젝트가 아닌 경우, 직렬화 처리 하지 않고 반환
        if (!angular.isObject(data)) {
            return ((data == null) ? "" : data.toString());
        }

        var buffer = [];

        //객체으 키값을 돌면서 직렬화 처리를 수행한다
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

        //전송 전 데이터를 가공한다
        var source = buffer.join("&").replace(/%20/g, "+");

        return (source);
    }
};
