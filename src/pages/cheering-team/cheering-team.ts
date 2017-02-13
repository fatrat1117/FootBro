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
  watchListMap: {};
  who = "baby";
  colorArray = [-1, -1, -1, -1];
  pendingCheerleaders;
  approvedCheerleaders;

  constructor(private nav: NavController,
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private cheerleaderService : CheerleaderService) {
    this.selfId = this.playerService.selfId()
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.playerService.getPlayerAsync(this.selfId);
    if (this.playerService.isAdmin())
      this.cheerleaderService.getPendingCheerleadersAsync();
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
    });
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

