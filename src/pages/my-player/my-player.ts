import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { TeamService } from '../../app/teams/team.service'
import { Team } from '../../app/teams/team.model'
import { ChatPage } from '../chat/chat'
import { Localization } from '../../providers/localization';
import { FirebaseManager } from '../../providers/firebase-manager';

@Component({
  selector: 'page-my-player',
  templateUrl: 'my-player.html',
})
export class MyPlayerPage {
  selfId: string;
  id;
  player = new Player();
  team = new Team();
  //af
  onPlayerReady;
  onTeamReady;
  socialStats = {};
  radarChartLabels;
  radarChartData;;
  radarOptions;
  colors = [{
    borderColor: '#00ff00',
    backgroundColor: '#b5e61d',
    borderWidth: 1
  }];
  showCharts = false;
  constructor(private navCtrl: NavController,
    private service: PlayerService,
    params: NavParams,
    private teamService: TeamService, private local: Localization,
    private actionSheetCtrl: ActionSheetController,
    private fm: FirebaseManager) {
    this.id = params.get('id');

    this.radarChartLabels = [
      local.getString('technique'),
      local.getString('tactics'),
      local.getString('physical'),];

    this.radarChartData = [[this.service.initStat, this.service.initStat, this.service.initStat]];

    this.radarOptions = {
      legend: { display: false },
      scale: {
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
          stepSize: this.service.initStat
        }
      }
    };
  }

  ionViewDidLoad() {
    this.service.increasePopularity(this.id);
    this.selfId = this.service.selfId();
    this.onTeamReady = e => {
      let teamId = e['detail'];
      if (this.player && 'teamId' in this.player && teamId === this.player.teamId)
        this.team = this.teamService.getTeam(teamId);
    }

    this.onPlayerReady = e => {
      let id = e['detail'];
      if (this.id === id) {
        this.player = this.service.getPlayer(id);
        setTimeout(() => {
          //console.log(this.player);
          this.radarChartData = [[this.player.technique, this.player.tactics, this.player.physical]];
          //console.log(this.radarChartData);
          this.showCharts = true;
          //this.radarChartData[0][0] = this.player.technique;
          //this.radarChartData[0][1] = this.player.tactics;
          //this.radarChartData[0][2] = this.player.physical;
        },
          1000
        );

        //this.radarChartData = [[this.player.physical, this.player.technique, this.player.tactics]];
        if (this.player.teamId)
          this.teamService.getTeamAsync(this.player.teamId);
      }
    };

    document.addEventListener('serviceteamready', this.onTeamReady);
    document.addEventListener('serviceplayerready', this.onPlayerReady);
    this.service.getPlayerAsync(this.id, true, true);
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceteamready', this.onTeamReady);
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
  }

  enterChatPage() {
    if (this.service.isAuthenticated()) {
      this.navCtrl.push(ChatPage, {
        isSystem: false,
        isUnread: false,
        user: this.player
      })
    }
    else
      this.service.checkLogin();
  }

  likeHim() {
    if (this.service.isAuthenticated())
      this.service.like(this.id, true, 'charm');
    else
      this.service.checkLogin();
  }

  dislikeHim() {
    if (this.service.isAuthenticated())
      this.service.like(this.id, false, 'charm');
    else
      this.service.checkLogin();
  }

  likeSkill() {
    if (this.service.isAuthenticated())
      this.service.like(this.id, true, 'skill');
    else
      this.service.checkLogin();
  }

  dislikeSkill() {
    if (this.service.isAuthenticated())
      this.service.like(this.id, false, 'skill');
    else
      this.service.checkLogin();
  }

  likeStyle() {
    if (this.service.isAuthenticated())
      this.service.like(this.id, true, 'style');
    else
      this.service.checkLogin();
  }

  dislikeStyle() {
    if (this.service.isAuthenticated())
      this.service.like(this.id, false, 'style');
    else
      this.service.checkLogin();
  }

  getNumber(key, val) {
    let num = 0;
    if (this.player && this.player.social && this.player.social.votes) {
      let votes = this.player.social.votes;
      for (let k in votes) {
        if (key in votes[k] && val === votes[k][key])
          ++num;
      }
    }
    if (true === val)
      this.socialStats[key] = num;
    else
      this.socialStats['opp' + key] = num;

    return num;
  }

  getPercent(key, flag) {
    let oppKey = 'opp' + key;
    if (flag) {
      this.getNumber(key, flag);
      this.getNumber(key, !flag);
    }
    if (key in this.socialStats && oppKey in this.socialStats) {
      let val = this.socialStats[key];
      let oppVal = this.socialStats[oppKey];
      let total = val + oppVal;
      //console.log(val, oppVal, total);
      if (0 === total)
        return 50;
      //comment: set percent range from 0% ~ 99% in order to to avoid 100% overflow issue.
      return flag ? (val * 99 / total) : (oppVal * 99 / total);
    }
    return 50;
  }

  isLiked(key) {
    if (this.player && this.player.social && this.player.social.votes) {
      let myVote = this.player.social.votes[this.service.selfId()];
      if (myVote && key in myVote) {
        if (myVote[key])
          return true
      }
    }
    return false;
  }

  isUnliked(key) {
    if (this.player && this.player.social && this.player.social.votes) {
      let myVote = this.player.social.votes[this.service.selfId()];
      if (myVote && key in myVote) {
        if (false === myVote[key])
          return true;
      }
    }
    return false;
  }

  getLocalizationClass(suffix) {
    let localCode = this.local.langCode;
    return localCode + "-" + suffix;
  }

  changeCoverPhoto() {
    if (this.id !== this.service.selfId())
      return;

    let actionSheet = this.actionSheetCtrl.create({
      buttons: [{
        text: this.local.getString('changecoverphoto'),
        handler: () => {
          this.doChangeCoverPhoto();
        }
      }, {
        text: this.local.getString('Cancel'),
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
      this.service.updatePlayerPhotoLarge(this.selfId, photoUrl);
    }

    let error = err => {
      console.log(err);
    }

    this.fm.selectImgUploadGetUrl(this.selfId + 'Large', 512, 512, success, error);
  }

  getAvgInfomation(a, b) {
    if (b != 0) {
      return parseFloat((a / b).toFixed(1));
    }
    return 0;
  }
}
