import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams, ModalController} from 'ionic-angular';
import { Match } from '../../app/matches/match.model';
import { EditSquadPage } from '../edit-squad/edit-squad'

declare var google: any;

@Component({
  selector: 'page-match-detail',
  templateUrl: 'match-detail.html'
})
export class MatchDetailPage {
  @ViewChild('pageHeader') pageHeader;

  map;
  match: Match;
  matchSegments = 'info';
  homeSquadSettings: any;

  constructor(private viewCtrl: ViewController,
    private modal: ModalController,
    navParams: NavParams) {
    this.match = navParams.get('match');
    //this.settings.offsetX = 32;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openHere() {
    alert("here");
  }

  openDelete() {
    alert("delete");
  }

  ionViewDidLoad() {
    this.homeSquadSettings = {};
    this.homeSquadSettings.matchId = this.match.id;
    this.homeSquadSettings.teamId = this.match.homeId;
    this.homeSquadSettings.offsetY = this.pageHeader.nativeElement.clientHeight;
    //console.log(this.pageHeader, this.homeSquadSettings);
    this.showCurrentPositionInGoogleMap();
  }

  segmentChange(e) {
    //console.log(e);
    this.matchSegments = e;
    if ('info' === e)
      this.showCurrentPositionInGoogleMap();
  }

  showCurrentPositionInGoogleMap() {
    //if (navigator.geolocation) {
    //获取当前地理位置
    //navigator.geolocation.getCurrentPosition(function (position) {
    //var coords = position.coords;
    //指定一个google地图上的坐标点，同时指定该坐标点的横坐标和纵坐标
    // var latlng = new google.maps.LatLng(this.match.location.lat, this.match.location.lng);
    // var myOptions = {
    //   zoom: 14, //设定放大倍数
    //   center: latlng, //将地图中心点设定为指定的坐标点
    //   mapTypeId: google.maps.MapTypeId.ROADMAP //指定地图类型
    // };
    // let mapDiv = document.getElementById("map");
    // console.log(mapDiv);

    // //创建地图，并在页面map中显示
    // var map = new google.maps.Map(document.getElementById("map"), myOptions);
    // //在地图上创建标记
    // var marker = new google.maps.Marker({
    //   position: latlng, //将前面设定的坐标标注出来
    //   map: map //将该标注设置在刚才创建的map中
    // });
    //标注提示窗口
    // var infoWindow = new google.maps.InfoWindow({
    //   content: "当前位置：<br/>经度：" + latlng.lat() + "<br/>维度：" + latlng.lng() //提示窗体内的提示信息
    // });
    //打开提示窗口
    //infoWindow.open(map, marker);
    // },
    // function (error) {
    // //处理错误
    //   switch (error.code) {
    //     case 1:
    //       alert("位置服务被拒绝。");
    //       break;
    //     case 2:
    //       alert("暂时获取不到位置信息。");
    //       break;
    //     case 3:
    //       alert("获取信息超时。");
    //       break;
    //     default:
    //       alert("未知错误。");
    //       break;
    //   }
    //   });
    // } else {
    //   alert("你的浏览器不支持HTML5来获取地理位置信息。");
    // }
  }

  edit() {
    if ('squad' === this.matchSegments) {
      this.modal.create(EditSquadPage, {match: this.match}).present();
    }
  }
}
