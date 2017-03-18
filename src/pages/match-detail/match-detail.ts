import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams, ModalController } from 'ionic-angular';
import { Match } from '../../app/matches/match.model';
import { EditSquadPage } from '../edit-squad/edit-squad';
import { SharePage } from '../share/share';
import { PlayerService } from '../../app/players/player.service'
import { UpdateGamePage } from '../../pages/update-game/update-game'
import { NewGamePage } from '../../pages/new-game/new-game'

@Component({
  selector: 'page-match-detail',
  templateUrl: 'match-detail.html'
})
export class MatchDetailPage {
  @ViewChild('pageHeader') pageHeader;
  //@ViewChild('squadCtrl') squadCtrl;

  map;
  match: Match;
  matchSegments = 'info';
  squadSettings: any;

  constructor(private viewCtrl: ViewController,
    private modal: ModalController,
    navParams: NavParams,
    private playerService: PlayerService) {
    this.match = navParams.get('match');
    this.squadSettings = {};
    this.squadSettings.matchId = this.match.id;

    //only show captain's team
    if (this.playerService.isAuthenticated()) {
      if (this.playerService.isCaptain(this.playerService.selfId(), this.match.homeId))
        this.squadSettings.teamId = this.match.homeId;
      else if (this.playerService.isCaptain(this.playerService.selfId(), this.match.awayId))
        this.squadSettings.teamId = this.match.awayId;
    }
    //this.squadSettings.teamId = this.match.homeId;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.squadSettings.offsetY = this.pageHeader.nativeElement.clientHeight;
  }

  segmentChange(e) {
    //console.log(e);
    this.matchSegments = e;
    if ('info' === e) {
      //  this.showCurrentPositionInGoogleMap();
    }
    else if ('squad' === e) {
      // let self = this;
      // setTimeout(function() {
      //   console.log(self.squadCtrl);
      // }, 2000);
    }
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
    switch (this.matchSegments) {
      case 'info':
        this.goUpdateMatchPage();
        break;
      case 'squad':
        this.modal.create(EditSquadPage, { match: this.match, teamId: this.squadSettings.teamId }).present();
        break;
    }
  }

  canShowSquadSegment() {
    if (!this.playerService.isAuthenticated())
      return false;

    if (this.playerService.isCaptain(this.playerService.selfId(), this.match.homeId) ||
      this.playerService.isCaptain(this.playerService.selfId(), this.match.awayId))
      return true;

    return false;
  }

  canShowEdit() {
    if (!this.playerService.isAuthenticated())
      return false;

    switch (this.matchSegments) {
      case 'info':
        {
          //captain can update matchInfo
          if (this.playerService.isCaptain(this.playerService.selfId(), this.match.homeId) ||
            this.playerService.isCaptain(this.playerService.selfId(), this.match.awayId))
            return true;
        }
        break;
      case 'squad':
        {
          //captain can update squad
          if (this.playerService.isCaptain(this.playerService.selfId(), this.match.homeId) ||
            this.playerService.isCaptain(this.playerService.selfId(), this.match.awayId))
            return true;
        }
        break;
      // case 'stats':
      //   {
      //     //captain can update stats
      //     if (this.playerService.isCaptain(me, this.match.homeId) ||
      //       this.playerService.isCaptain(me, this.match.awayId))
      //       return true;
      //   }
      //   break;
      // case 'rating':
      //   break;
    }

    return false;
  }

  goUpdateMatchPage() {
    if (this.match.isStarted())
      this.modal.create(UpdateGamePage, { id: this.match.id }).present();
    else
      this.modal.create(NewGamePage, { id: this.match.id, teamId: this.squadSettings.teamId }).present();
  }
}
