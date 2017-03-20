import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular'
import { CheeringTeamStatsPage } from './cheering-team-stats'
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { CheerleaderService } from '../../app/cheerleaders/cheerleader.service'
import { ChatPage } from '../chat/chat'

@Component({
  selector: 'page-cheering-team',
  templateUrl: 'cheering-team.html',
})
export class CheeringTeamPage {
  selfPlayer: Player;
  //selfId: string;
  who = "baby";
  colorArray = [-1, -1, -1, -1];
  pendingCheerleaders;
  approvedCheerleaders;
  amICheerleader = true;
  afPendingSelf;
  onPendingCheerleadersReady;
  onApprovedCheerleadersReady;
  onPlayerReady;

  constructor(private nav: NavController,
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private cheerleaderService: CheerleaderService) {
    this.afPendingSelf = this.cheerleaderService.afPendingCheerleaderSelf();
    //this.afPendingSelf.subscribe(s =>{console.log(s);})
  }

  ionViewDidLoad() {
    //this.selfPlayer = this.playerService.getSelfPlayer();
    this.addEventListeners();
    if (this.playerService.isAdmin())
      this.cheerleaderService.getPendingCheerleadersAsync();
    this.cheerleaderService.getApprovedCheerleadersAsync();
    this.playerService.getPlayerAsync(this.playerService.selfId());
  }

  ionViewWillUnload() {
    document.removeEventListener('servicependingcheerleadersready', this.onPendingCheerleadersReady);
    document.removeEventListener('serviceapprovedcheerleadersready', this.onApprovedCheerleadersReady);
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
  }

  addEventListeners() {
    this.onPendingCheerleadersReady = e => {
      this.pendingCheerleaders = this.cheerleaderService.getPendingCheerleaders();
    };

    this.onApprovedCheerleadersReady =  e => {
      this.approvedCheerleaders = this.cheerleaderService.getApprovedCheerleaders();
      if (this.cheerleaderService.isCheerleader(this.playerService.selfId()))
        this.amICheerleader = true;
      else
        this.amICheerleader = false;
    };

    this.onPlayerReady = e => {
      let playerId = e['detail'];
      if (playerId === this.playerService.selfId()) {
        this.selfPlayer = this.playerService.getPlayer(playerId);
      }
    };

    document.addEventListener('servicependingcheerleadersready', this.onPendingCheerleadersReady);
    document.addEventListener('serviceapprovedcheerleadersready', this.onApprovedCheerleadersReady);
    document.addEventListener('serviceplayerready', this.onPlayerReady);
  }

  highLight(index: number) {
    if (index < this.colorArray.length) {
      this.colorArray[index] = this.colorArray[index] * -1;
    }
  }

  getColor(index: number) {
    if (index < this.colorArray.length) {
      if (this.colorArray[index] == 1) {
        return "#00ef00";
      } else {
        return "#999";
      }
    } else {
      return "#999";
    }
  }

  unlockCheerleader(cheerleader: Player) {
    if (this.playerService.isAuthenticated()) {
      this.modalCtrl.create(CheeringTeamStatsPage, {
        cheerleader: cheerleader,
      }).present();
    }
    else
      this.playerService.checkLogin();
  }

  becomeCheerleader() {
    if (this.playerService.isAuthenticated())
      this.cheerleaderService.submitInfo();
    else
      this.playerService.checkLogin();
  }

  approve(id) {
    this.cheerleaderService.approve(id);
  }

  isUnlocked(id) {
    if (this.selfPlayer && this.selfPlayer.cheerleaders)
      return this.selfPlayer.cheerleaders.indexOf(id) >= 0;

     return false;
  }

  enterChatPage(cl) {
    this.nav.push(ChatPage, {
      isSystem: false,
      isUnread: false,
      user: cl
    });
  }

  buildCheerleaderRowArray(appCheerleaders,numPerRow){
        // var numPerRow = 2;
        // var rowArray = [];
        // if (!appCheerleaders){
        //     return rowArray;
        // }
        // for (var i = 0; i < appCheerleaders.length; i+=numPerRow){
        //     var rowItem = [];
        //     for (var j = 0 ; j < numPerRow ;j ++){
        //         var curr = appCheerleaders[i+j];
        //         rowItem.push(curr);
        //     }
        //     rowArray.push(rowItem);
        // }
        var rowArray = [];
        if (appCheerleaders){
           var rowItem = [];
           for (var i = 0; i < appCheerleaders.length ; i++){
             var curr = appCheerleaders[i];
             rowItem.push(curr);
             if ((i + 1) % numPerRow == 0){
                rowArray.push(rowItem);
                rowItem = [];
             }
           }
        }
        return rowArray;
  }
}

