import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular'
import { CheeringTeamStatsPage } from './cheering-team-stats'
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { CheerleaderService } from '../../app/cheerleaders/cheerleader.service'

@Component({
  selector: 'page-cheering-team',
  templateUrl: 'cheering-team.html',
})
export class CheeringTeamPage {
  selfId: string;
  who = "baby";
  colorArray = [-1, -1, -1, -1];
  pendingCheerleaders;
  approvedCheerleaders;
  amICheerleader = true;
  afPendingSelf;

  constructor(private nav: NavController,
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private cheerleaderService: CheerleaderService) {
    this.afPendingSelf = this.cheerleaderService.afPendingCheerleaderSelf();
    //this.afPendingSelf.subscribe(s =>{console.log(s);})
  }

  ionViewDidLoad() {
    this.addEventListeners();
    if (this.playerService.isAdmin())
      this.cheerleaderService.getPendingCheerleadersAsync();
    this.cheerleaderService.getApprovedCheerleadersAsync();
  }

  addEventListeners() {
    document.addEventListener('servicependingcheerleadersready', e => {
      this.pendingCheerleaders = this.cheerleaderService.getPendingCheerleaders();
      //console.log(this.pendingCheerleaders, this.pendingCheerleaders[this.selfId]);
    });

    document.addEventListener('serviceapprovedcheerleadersready', e => {
      this.approvedCheerleaders = this.cheerleaderService.getApprovedCheerleaders();
      if (this.cheerleaderService.isCheerleader(this.selfId))
        this.amICheerleader = true;
      else
        this.amICheerleader = false;
    })
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

  unlockBaby() {
    // if (this.playerService.isAuthenticated()) {
    //   this.modalCtrl.create(CheeringTeamStatsPage, {
    //     player: this.playerService.getSelfPlayer(),
    //   }).present();
    // }
    // else
    //   this.playerService.checkLogin();
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
}

