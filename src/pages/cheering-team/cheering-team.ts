import { Component } from '@angular/core';
import { NavController, ModalController} from 'ionic-angular'
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
  player: Player;
  who = "baby";
  colorArray = [-1, -1, -1, -1];
  pendingCheerleaders;
  approvedCheerleaders;
  amICheerleader = true;
  afPendingSelf;

  constructor(private nav: NavController,
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private cheerleaderService : CheerleaderService) {
    this.selfId = this.playerService.selfId();
    this.afPendingSelf = this.cheerleaderService.afPendingCheerleaderSelf();
    //this.afPendingSelf.subscribe(s =>{console.log(s);})
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.playerService.getPlayerAsync(this.selfId);
    if (this.playerService.isAdmin())
      this.cheerleaderService.getPendingCheerleadersAsync();
    this.cheerleaderService.getApprovedCheerleadersAsync();
  }

  addEventListeners() {
    document.addEventListener('serviceplayerready', e => {
      let playerId = e['detail'];
      if (playerId === this.selfId) {
        this.player = this.playerService.getPlayer(playerId);
      }
    });

    document.addEventListener('servicependingcheerleadersready', e => {
      this.pendingCheerleaders = this.cheerleaderService.getPendingCheerleaders();
      //console.log(this.pendingCheerleaders, this.pendingCheerleaders[this.selfId]);
    });

    document.addEventListener('serviceapprovedcheerleadersready', e=> {
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
    this.modalCtrl.create(CheeringTeamStatsPage, {
      player: this.player,
    }).present();
  }

  becomeCheerleader() {
    this.cheerleaderService.submitInfo();
  }

  approve(id) {
    this.cheerleaderService.approve(id);
  }
}

