import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, ModalController, AlertController, ActionSheetController } from 'ionic-angular';
import { Localization } from '../../providers/localization';
import { SearchPlayerPage } from '../search-player/search-player'
import { SearchMatchPage } from '../search-match/search-match'
import { MatchDetailPage } from '../match-detail/match-detail'
import { TeamPlayersPage } from '../team-players/team-players';
import { ChatPage } from '../chat/chat'
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'
import { Match } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'
import { FirebaseManager } from '../../providers/firebase-manager'
import * as moment from 'moment';
declare var sprintf: any;

@Component({
  selector: 'page-my-team',
  templateUrl: 'my-team.html'
})
export class MyTeamPage {
  @ViewChild(Content) content: Content;

  first = [];
  selfId: string;
  selfPlayer: Player;
  id;
  team: Team = new Team();
  currTeamStat;
  selectedStatIndex = 0;
  players;
  matches: Match[] = [];
  upcomingMatch: Match;
  mostGAMatchId;
  mostGFMatchId;
  captain;
  onPlayerReady;
  onTeamStatsDataReady;
  onTeamPlayersReady;
  onTeamMatchesReady;
  //onTeamMatchesChanged;
  currPageName = "my-team";
  lastMatch;

  constructor(public nav: NavController,
    private navParams: NavParams,
    private service: TeamService,
    private playerService: PlayerService,
    private matchService: MatchService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loc: Localization,
    private actionSheetCtrl: ActionSheetController,
    private fm: FirebaseManager) {
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.selfId = this.playerService.selfId();
    this.id = this.navParams.get('id');
    this.service.increasePopularity(this.id);
    this.playerService.getPlayerAsync(this.selfId);
    this.service.getTeamAsync(this.id, true);
    this.matchService.getTeamMatchesAsync(this.id);
  }

  addEventListeners() {
    this.onPlayerReady = e => {
      let id = e['detail'];
      if (id == this.selfId)
        this.selfPlayer = this.playerService.getPlayer(id);
    };

    this.onTeamStatsDataReady = e => {
      //console.log(e);
      let teamId = e['detail'];
      //console.log(teamId, this.id);
      if (teamId === this.id) {
        this.team = this.service.getTeam(teamId);
        if (this.team.overall && this.team.overall.most_GA_match) {
          for (let key in this.team.overall.most_GA_match)
            this.mostGAMatchId = key;
        }
        if (this.team.overall && this.team.overall.most_GF_match) {
          for (let key in this.team.overall.most_GF_match)
            this.mostGFMatchId = key;
        }
        this.playerService.getTeamPlayersAsync(teamId);
        this.setChoosePosition(this.selectedStatIndex);
      }
    };

    this.onTeamPlayersReady = e => {
      let teamId = e['detail'];
      //console.log(teamId, this.id);
      if (teamId === this.id) {
        this.players = this.playerService.getTeamPlayers(teamId);
        this.captain = this.playerService.getPlayer(this.team.captain);
        //console.log(this.players);
        //console.log(this.team.captain, this.captain);
      }
    };

    this.onTeamMatchesReady = e => {
      let teamId = e['detail'];
      if (teamId === this.id) {
        this.matches = this.matchService.getTeamMatches(teamId);
        //console.log(this.matches);
        this.updateUpcomingMatch();
      }
    };

    // this.onTeamMatchesChanged = e => {
    //   let teamId = e['detail'];
    //   if (teamId === this.id) {
    //     this.matchService.getTeamMatchesAsync(teamId);
    //   }
    // }

    document.addEventListener('serviceplayerready', this.onPlayerReady);
    document.addEventListener('serviceteamstatsdataready', this.onTeamStatsDataReady);
    document.addEventListener('serviceteamplayersready', this.onTeamPlayersReady);
    document.addEventListener('serviceteammatchesready', this.onTeamMatchesReady);
    //document.addEventListener('teammatcheschanged', this.onTeamMatchesChanged);
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
    document.removeEventListener('serviceteamstatsdataready', this.onTeamStatsDataReady);
    document.removeEventListener('serviceteamplayersready', this.onTeamPlayersReady);
    document.removeEventListener('serviceteammatchesready', this.onTeamMatchesReady);
    //document.removeEventListener('teammatcheschanged', this.onTeamMatchesChanged);
  }

  updateUpcomingMatch() {
    this.upcomingMatch = this.matchService.getUpcomingMatch(this.id);
    this.lastMatch = this.matchService.getLastMatch(this.id);
    //console.log(this.matches);
    // if (this.matches.length) {
    //   let index = 0;
    //   let now = moment().unix() * 1000;
    //   for (let i = 1; i < this.matches.length; ++i) {
    //     let match = this.matches[i];
    //     //console.log(match.$key, match.date, match.id, now);
    //     if (match.time < now)
    //       break;
    //     index = i;
    //   }
    //   this.upcomingMatch = this.matches[index];
    //   if (index + 1 < this.matches.length)
    //     this.lastMatch = this.matches[index + 1];
    //   console.log('last match', this.lastMatch);
    // }
  }

  isMember() {
    if (this.selfPlayer && this.selfPlayer.teams)
      return this.selfPlayer.teams.indexOf(this.id) >= 0;
    return false;
  }


  //查看更多球队赛程
  seeMoreTeamGamePlan() {
    this.nav.push(SearchMatchPage, { matches: this.matches, showDate: true });
  }

  //查看更多球队成员
  seeMoreTeamMember() {
    this.nav.push(SearchPlayerPage, { teamId: this.id, showDetail: true, showClose: false });
  }

  //切换函数
  //最近15场 最近20场 全部
  setChoosePosition(position) {
    //console.log(this);
    //3个选项页
    var recent15 = document.getElementById("recent15");
    //this page is not shown
    if (!recent15)
      return;
    var recent20 = document.getElementById("recent20");
    var all = document.getElementById("all");
    //三个按钮
    var btnRecent15 = document.getElementById("btn-recent-15");
    var btnRecent20 = document.getElementById("btn-recent-20");
    var btnAll = document.getElementById("btn-all");
    //三条横线
    var firstLine = document.getElementById("firstLine");
    var secondLine = document.getElementById("secondLine");
    var thirdLine = document.getElementById("thirdLine");
    //都设置为默认样式
    recent15.setAttribute("class", "team-all-game-unchoose");
    recent20.setAttribute("class", "team-all-game-unchoose");
    all.setAttribute("class", "team-all-game-unchoose");
    btnRecent15.style.color = "#999999";
    btnRecent20.style.color = "#999999";
    btnAll.style.color = "#999999";
    firstLine.style.backgroundColor = "#555555";
    secondLine.style.backgroundColor = "#555555";
    thirdLine.style.backgroundColor = "#555555";
    //console.log(this.team);

    switch (position) {
      case 0:
        this.currTeamStat = this.team.last_15;
        recent15.setAttribute("class", "team-all-game-choose");
        btnRecent15.style.color = "white";
        firstLine.style.backgroundColor = "yellow";
        break;
      case 1:
        this.currTeamStat = this.team.last_30;
        recent20.setAttribute("class", "team-all-game-choose");
        btnRecent20.style.color = "white";
        secondLine.style.backgroundColor = "yellow";
        break;
      case 2:
        this.currTeamStat = this.team.overall;
        all.setAttribute("class", "team-all-game-choose");
        btnAll.style.color = "white";
        thirdLine.style.backgroundColor = "yellow";
        break;
    }
    //console.log(this.currTeamStat);
    this.selectedStatIndex = position;
    //this.setSuccessRate(Math.round(this.currTeamStat.rate * 100));
  }

  //根据胜率设置图像例如90%
  setSuccessRate(successRate) {
    var backCircle1 = document.getElementById("backCircle1");
    var backCircle2 = document.getElementById("backCircle2");
    if (successRate <= 50) {
      var angle = -360 * successRate / 100;
      backCircle2.style.transform = "rotate(" + angle + "deg)";
      backCircle2.style.backgroundColor = "#a4a4a4";
    } else {
      var angle = 180 - 360 * successRate / 100;
      backCircle2.style.transform = "rotate(" + angle + "deg)";
      backCircle2.style.backgroundColor = "green";
    }
    var successRateText = document.getElementById("success-rate-text");
    successRateText.innerHTML = successRate + "%";
    //显示百分比数字并调整相对位置
    if (this.getByteLen(successRate + "%") > 4) {
      successRateText.style.fontSize = "3.5rem";
      successRateText.style.marginTop = "0px";
    } else {
      successRateText.style.fontSize = "4.5rem";
      successRateText.style.marginTop = "-10px";
    }
  }
  //获取字符串长度
  getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i);
      if (a.match(/[^\x00-\xff]/ig) != null) {
        len += 2;
      }
      else {
        len += 1;
      }
    }
    return len;
  }

  getCircleBkColor(result) {
    let style: any = {};
    switch (result) {
      case 'W':
        style.background = '#00ff00';
        break;
      case 'L':
        style.background = '#8c8c8c';
        break;
      default:
        style.background = '#01c5ff';
        break;
    }
    return style;
  }

  getCircleTextColor(result) {
    let style: any = {};
    switch (result) {
      case 'W':
        style.color = '#00ff00';
        break;
      case 'L':
        style.color = '#8c8c8c';
        break;
      default:
        style.color = '#01c5ff';
        break;
    }
    return style;
  }

  showMatch(match) {
    if (match) {
      this.modalCtrl.create(MatchDetailPage, { match: match }).present();
    }
  }

  openTeamPlayersPage() {
    this.nav.push(TeamPlayersPage, { teamId: this.id });
  }

  changeCoverPhoto() {
    if (!this.playerService.amICaptainOrAdmin(this.id))
      return;

    let actionSheet = this.actionSheetCtrl.create({
      buttons: [{
        text: this.loc.getString('changecoverphoto'),
        handler: () => {
          this.doChangeCoverPhoto();
        }
      }, {
        text: this.loc.getString('Cancel'),
        role: 'cancel',
        handler: () => {
          //console.log('Cancel clicked');
        }
      }
      ]
    });
    actionSheet.present();
  }

  doChangeCoverPhoto() {
    let self = this;

    let success = photoUrl => {
      this.service.updatePhotoLarge(this.id, photoUrl);
    }

    let error = err => {
      console.log(err);
    }

    this.fm.selectImgUploadGetUrl(this.id + 'Large', 512, 512, success, error);
  }

  contactCaptain() {
    if (this.playerService.isAuthenticated()) {
      this.nav.push(ChatPage, {
        isSystem: false,
        isUnread: false,
        user: this.captain
      })
    }
    else
      this.playerService.checkLogin();
  }

  isCaptain() {
    if (this.captain && this.captain.id == this.selfId)
    {
      this.content.resize();
      return true;
    }
    else
    {
      return false;
    }
  }
}
