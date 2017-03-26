import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams, ModalController, Events } from 'ionic-angular';
import { Match } from '../../app/matches/match.model';
import { EditSquadPage } from '../edit-squad/edit-squad';
import { SharePage } from '../share/share';
import { PlayerService } from '../../app/players/player.service'
import { TeamService } from '../../app/teams/team.service'
import { UpdateGamePage } from '../../pages/update-game/update-game'
import { NewGamePage } from '../../pages/new-game/new-game'
import { EditGameRatingPage } from '../edit-game-rating/edit-game-rating';

@Component({
  selector: 'page-match-detail',
  templateUrl: 'match-detail.html'
})
export class MatchDetailPage {
  @ViewChild('pageHeader') pageHeader;

  map;
  match: Match;
  matchSegments = 'info';
  squadSettings: any;
  onMatchSquadReady;
  squad;
  homeSquad;
  awaySquad;
  homePlayerStats = {};
  awayPlayerStats = {};
  allPlayersStats = {};
  statCategories = [];
  selectedStats;
  selectedCat;
  geo = "geo:?q=0,0";
  currPageName = "match-detail";

  constructor(private viewCtrl: ViewController,
    private modal: ModalController,
    navParams: NavParams,
    private playerService: PlayerService,
    private events: Events,
    private teamService: TeamService) {
    this.match = navParams.get('match');
    if ('lat' in this.match.location && 'lng' in this.match.location)
      this.geo = "geo:?q=" + this.match.location.lat + ',' + this.match.location.lng;
    console.log(this.geo);

    this.squadSettings = {};
    this.squadSettings.matchId = this.match.id;

    //only show captain's team
    if (this.playerService.isAuthenticated()) {
      if (this.playerService.isCaptain(this.playerService.selfId(), this.match.homeId)) {
        this.squadSettings.teamId = this.match.homeId;
      }
      else if (this.playerService.isCaptain(this.playerService.selfId(), this.match.awayId))
        this.squadSettings.teamId = this.match.awayId;
    }
    this.initializePlayerStats(this.homePlayerStats);
    this.initializePlayerStats(this.awayPlayerStats);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.onMatchSquadReady = (teamId, matchId) => {
      if ('teamId' in this.squadSettings && matchId === this.match.id) {
        if (teamId === this.squadSettings.teamId)
          this.squad = this.teamService.getMatchSquad(teamId, matchId);

        if (teamId === this.match.homeId) {
          this.homeSquad = this.teamService.getMatchSquad(this.match.homeId, matchId);
          this.updatePlayerStats(this.homePlayerStats, this.homeSquad, this.match.home);
        }
        else if (teamId === this.match.awayId) {
          this.awaySquad = this.teamService.getMatchSquad(this.match.awayId, matchId);
          this.updatePlayerStats(this.awayPlayerStats, this.awaySquad, this.match.away);
        }
      }
    }

    this.events.subscribe('servicematchsquadready', this.onMatchSquadReady);
    this.teamService.getMatchSquadAsync(this.match.homeId, this.match.id);
    this.teamService.getMatchSquadAsync(this.match.awayId, this.match.id);
    this.squadSettings.offsetY = this.pageHeader.nativeElement.clientHeight;
  }

  ionViewWillUnload() {
    this.events.unsubscribe('servicematchsquadready', this.onMatchSquadReady);
  }

  initializePlayerStats(stats) {
    stats['goals'] = [];
    stats['assists'] = [];
    stats['redcards'] = [];
    stats['yellowcards'] = [];
    stats['owngoals'] = [];
    stats['rating'] = [];
  }

  updatePlayerStats(stats, squad, team) {
    stats['goals'] = [];
    stats['assists'] = [];
    stats['redcards'] = [];
    stats['yellowcards'] = [];
    stats['owngoals'] = [];
    stats['rating'] = [];

    if (squad) {
      if ('participants' in squad) {
        squad.participants.forEach(p => {
          if (p.goals) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.goals;
            stats['goals'].push(stat);
          }

          if (p.assists) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.assists;
            stats['assists'].push(stat);
          }

          if (p.redcards) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.redcards;
            stats['redcards'].push(stat);
          }

          if (p.yellowcards) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.yellowcards;
            stats['yellowcards'].push(stat);
          }

          if (p.owngoals) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.owngoals;
            stats['owngoals'].push(stat);
          }
        });
      }

      if ('ratings' in squad) {
        let playerRatingsMap: any = {};
        for (let key in squad.ratings) {
          let ratingObj = squad.ratings[key];
          for (let playerId in ratingObj) {
            let playerRating = ratingObj[playerId];
            //console.log(playerRating);
            playerRatingsMap[playerId] ? playerRatingsMap[playerId].push(playerRating) : playerRatingsMap[playerId] = [playerRating];
          }
        }

        for (let key in playerRatingsMap) {
          let playerRatings = playerRatingsMap[key];
          if (playerRatings.length) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(key);
            stat.teamName = team.name;
            let sum = 0;
            playerRatings.forEach(r => {
              sum += r;
            })
            stat.val = (sum / playerRatings.length).toFixed(1);
            stats['rating'].push(stat);
          }
        }
        //console.log(playerRatingsMap);
      }
    }

    console.log(stats);
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
    else if ('players' === e)
      this.getCombinedStats();
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

  canShowSquadSegment() {
    if (!this.playerService.isAuthenticated())
      return false;

    if (this.playerService.isCaptain(this.playerService.selfId(), this.match.homeId) ||
      this.playerService.isCaptain(this.playerService.selfId(), this.match.awayId))
      return true;

    return false;
  }

  edit() {
    switch (this.matchSegments) {
      case 'info':
        this.goUpdateMatchPage();
        break;
      case 'squad':
        this.modal.create(EditSquadPage, { match: this.match, teamId: this.squadSettings.teamId }).present();
        break;
      case 'players':
        this.modal.create(EditGameRatingPage, { squad: this.squad, teamId: this.squadSettings.teamId, matchId: this.match.id }).present();
        break;
    }
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
      case 'players':
        {
          //captain can update stats
          if (this.squad)
            return true;
        }
        break;
      // case 'rating':
      //   break;
    }

    return false;
  }

  goUpdateMatchPage() {
    if (this.match.isStarted())
      this.modal.create(UpdateGamePage, { id: this.match.id, teamId: this.squadSettings.teamId }).present();
    else
      this.modal.create(NewGamePage, { id: this.match.id }).present();
  }

  canShowPlayersSegment() {
    return true;
  }

  getCombinedStats() {
    this.statCategories.splice(0);
    for (let key in this.homePlayerStats) {
      let allStats = this.homePlayerStats[key].concat(this.awayPlayerStats[key]);
      //console.log(allStats);
      this.allPlayersStats[key] = allStats;
      if (allStats.length > 0)
        this.statCategories.push(key);
    }
    if (this.statCategories.length && !this.selectedCat) {
      this.selectedCat = this.statCategories[0];
      this.selectedStats = this.allPlayersStats[this.selectedCat];
    }
  }

  showStat(cat) {
    this.selectedCat = cat;
    this.selectedStats = this.allPlayersStats[cat];
  }
}
