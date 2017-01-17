// This is a JavaScript file
var appKey = "13a9bb7225f0fb61bf255af50dd17c33eb6c4f79b9b4569a96b41602d8a85dc4";
var clientKey = "a17cca33a9df771372b0891b9c09c0dfa32a6c6e105a65321c172c0ed3e7e90f";
$(function()
{
    //起動時にmobile backend APIキーを設定
    $.getJSON("setting.json", function(data)
    {
        
    });
});
var ncmb = new NCMB.initialize(appKey, clientKey);
//位置情報取得に成功した場合のコールバック
var onSuccess = function(position)
{
    var current = new CurrentPoint();
    current.distance = CurrentPoint.distance; //検索範囲の半径を保持する    
    current.geopoint = position.coords; //位置情報を保存する
    search(current);
};
//位置情報取得に失敗した場合のコールバック
var onError = function(error)
{
    console.log("現在位置を取得できませんでした");
};
//位置情報取得時に設定するオプション
var option = {
    timeout: 60000 //タイムアウト値(ミリ秒)
};
//現在地を取得する
function find()
{
    CurrentPoint.distance = 100; //検索距離を5kmに設定
    navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
}
//現在地を保持するクラスを作成
function CurrentPoint()
{
    geopoint = null; //端末の位置情報を保持する
    distance = 0; //位置情報検索に利用するための検索距離を指定する
}
//mobile backendから位置情報を検索するメソッド
function search(current)
{
    //位置情報を検索するクラスのNCMB.Objectを作成する
    var SpotClass = NCMB.Object.extend("Spot");
    //NCMB.Queryを作成
    var query = new NCMB.Query(SpotClass);
    //位置情報をもとに検索する条件を設定
    var geoPoint = new NCMB.GeoPoint(current.geopoint.latitude, current.geopoint.longitude);
    query.withinKilometers("geo", geoPoint, current.distance);
    //mobile backend上のデータ検索を実行する
    query.find(
    {
        success: function(points)
        {
            ///////////////// ここから変更部分 ////////////////////
            // 検索が成功した場合の処理
            //Google mapの設定
            var mapOptions = {
                //中心地設定
                center: new google.maps.LatLng(current.geopoint.latitude, current.geopoint.longitude),
                //ズーム設定
                zoom: 15,
                //地図のタイプを指定
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            //idがmap_canvasのところにGoogle mapを表示
            var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
            for (var i = 0; i < points.length; i++)
            {
                var point = points[i];
                var detail = "";
                console.log("<p>店名：" + point.get("name") + "</p>");
                //位置情報オブジェクトを作成            
                var location = point.get("geo");
                var pointName = point.get("name");
                detail += "<h3>" + pointName + "</h3>";
                var myLatlng = new google.maps.LatLng(location.latitude, location.longitude);
                detail += '<button onclick = "showSpot(\'' + point.objectId + '\');">detail</button>';
                //店舗名、位置情報、Google mapオブジェクトを指定してマーカー作成メソッドを呼び出し
                markToMap(detail, myLatlng, map);
            }

            function markToMap(name, position, map, icon)
            {
                var marker = new google.maps.Marker(
                {
                    position: position,
                    title: name,
                    icon: icon
                });
                marker.setMap(map);
                google.maps.event.addListener(marker, 'click', function()
                {
                    var infowindow = new google.maps.InfoWindow(
                    {
                        content: marker.title
                    });
                    infowindow.open(map, marker);
                });
            }
            ///////////////// ここまで変更部分 ////////////////////
        },
        error: function(error)
        {
            // 検索に失敗した場合の処理
            console.log(error.message);
        }
    });
}
//スポットを登録する
function saveSpot()
{
    //位置情報が取得できたときの処理
    var onSuccess = function(location)
    {
        //記事内容を取得
        var title = $("#name")
            .val();
        //位置情報オブジェクトを作成
        var geoPoint = new NCMB.GeoPoint(location.coords.latitude, location.coords.longitude);
        //Spotクラスのインスタンスを作成★
        //値を設定★
        //保存を実行★
        //前のページに戻る
        myNavigator.popPage();
    };
    //位置情報取得に失敗した場合の処理
    var onError = function(error)
    {
        console.log("error:" + error.message);
    };
    var option = {
        timeout: 60000 //タイムアウト値(ミリ秒)
    };
    //位置情報を取得
    navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
}
//「利用する」ボタンをクリックした際に
//このメソッドを呼び出す
//SpotIdには詳細を呼び出したいSpotのObjectIdを入れる
function getSpotDetail(IpD3g4Y3lay6deGc)
{
    var SpotClass = ncmb.DataStore("Spot");
    SpotClass.fetchAll()
        .then(function(results)
        {
            $("#spotName") //spotNameという名前のlabelを作る
                .text(spot.get("name"));
            $("#spotCapacity") //spotCapacityという名前のlabelを作る 
                .text("人数：" + spot.get("capacity") + "人");
            //NiftyCloudのデータストアのSpotの列にcapacityという列を作って
            //そこに人数を入れる
            $("#spotImage") //spotImageという名前のImage?を作る
                .attr("src", "https://mb.api.cloud.nifty.com/2013-09-01/applications/QHiUQm7q0pedkRKI/publicFiles/" + spot.get("image"));
            //ファイルストアに画像を入れる
            //NiftyCloudのデータストアのSpotの列にimageという列を作って
            //そこに表示したい画像の名前を入れる
            SpotClass.equalTo("spot", IpD3g4Y3lay6deGc)
                .fetchAll()
                .then(function(results) {})
                .catch(function(error) {});
        })
        .catch(function(error)
        {
            alert(error.message);
        });
}

function showSpot(IpD3g4Y3lay6deGc)
{
    currentShopId = IpD3g4Y3lay6deGc;
    getSpotDetail(IpD3g4Y3lay6deGc);
    $.mobile.changePage('#spotName');
}