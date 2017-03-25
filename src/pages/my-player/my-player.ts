import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { TeamService } from '../../app/teams/team.service'
import { Team } from '../../app/teams/team.model'
import { ChatPage } from '../chat/chat'

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
  NumOfLikes: number;
  NumOfUnLikes: number;
  PercentOfLikes: number;
  PercentOfUnLikes: number;
  onPlayerReady;
  onTeamReady;

  constructor(private navCtrl: NavController, 
  private service: PlayerService, 
  params: NavParams,
  private teamService: TeamService) {
    this.id = params.get('id');

    var fromDBLikes = 213;
    var fromDBUnLikes = 67;
    this.NumOfLikes = fromDBLikes;
    this.NumOfUnLikes = fromDBUnLikes;
    this.PercentOfLikes = fromDBLikes / (fromDBLikes + fromDBUnLikes) * 100;
    this.PercentOfUnLikes = fromDBUnLikes / (fromDBLikes + fromDBUnLikes) * 100;
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
        if (this.player.teamId)
          this.teamService.getTeamAsync(this.player.teamId);
      }
    };

    document.addEventListener('serviceteamready', this.onTeamReady);
    document.addEventListener('serviceplayerready', this.onPlayerReady);
    this.service.getPlayerAsync(this.id, true);
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
      this.service.like(this.id, true);
    else
      this.service.checkLogin();
  }

  dislikeHim() {
    if (this.service.isAuthenticated())
      this.service.like(this.id, false);
    else
      this.service.checkLogin();
  }
}
