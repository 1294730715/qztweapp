//index.js
//获取应用实例
const common = require('../../utils/util.js');

Page({
  data: {
    Loadinghidden: true
  },
  onLoad: function () {
    var that = this;
    that.loadWeather();
  },
  refresh: function () {
    this.loadWeather();
  },
  loadWeather: function () {
    var that = this;
    that.setData({
      Loadinghidden: false
    });
    var weather = {};
    var typeIcon = {
      "多云": "duoyun.png",
      "霾": "mai.png",
      "晴": "qing.png",
      "雾": "wu.png",
      "雷阵雨": "leizhenyu.png",
      "大雪": "daxue.png",
      "大雨": "dayu.png",
      "暴雪": "baoxue.png",
      "暴雨": "baoyu.png",
      "冰雹": "bingbao.png",
      "小雪": "xiaoxue.png",
      "小雨": "xiaoyu.png",
      "阴": "yin.png",
      "雨夹雪": "yujiaxue.png",
      "阵雨": "zhenyu.png",
      "中雨": "zhongyu.png"
    };
    var background = {
      "大雨": "background-dayu",
      "中雨": "background-dayu",
      "小雨": "background-xiaoyu",
      "暴雨": "background-dayu",
      "雷阵雨": "background-leizhenyu",
      "晴": "background-qing"
    };
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log(latitude + ', ' + longitude);
        common.get('/api/location?latitude=' + latitude + '&longitude=' + longitude).then(res => {
          var city = res.data.result.addressComponent.city;
          weather.city = city;
          console.log('city=' + city);
          common.get('/weather_mini?city=' + city).then(res => {
            var data = res.data;
            if (data.status === 1000) {
              var today = {};
              today.wendu = data.data.wendu;          //温度
              var forecast = data.data.forecast;      //天气特征与未来天气
              var todayWeather = forecast[0];         //今天的天气
              today.low = todayWeather.low.split(' ')[1];    //最低温
              today.high = todayWeather.high.split(' ')[1];  //最高温
              var typeText = todayWeather.type;
              today.typeText = typeText;                     //天气类型说明
              today.week = todayWeather.date.slice(3);       //星期几
              today.typeIcon = typeIcon[typeText];           //天气类型图片
              today.typeBackgorund = "background-default";
              weather.today = today;

              //下周天气、未来天气
              var temp, futureList = [];
              for (var i = 1; i < forecast.length; i++) {
                temp = forecast[i];
                var future = {};
                future.week = temp.date.slice(3);
                future.type = typeIcon[temp.type];
                var wendurange = temp.low.split(' ')[1] + "-" + temp.high.split(' ')[1];
                future.wendu = wendurange;
                future.typeTetx = temp.type;
                futureList.push(future);
              }

              weather.futureList = futureList;
              console.log(weather);
              that.setData({
                weather: weather,
                Loadinghidden: true
              });
            }
          }).catch(res => {
            console.log(res);
          });
        });
      },
    });
  }
})
