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

  approvedGrid: number[][];
  oldTotal: number;

  constructor(private nav: NavController,
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private cheerleaderService: CheerleaderService) {
    if (this.playerService.isAuthenticated())
      this.afPendingSelf = this.cheerleaderService.afPendingCheerleaderSelf();
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

  shuffle(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }

  addEventListeners() {
    this.onPendingCheerleadersReady = e => {
      this.pendingCheerleaders = this.cheerleaderService.getPendingCheerleaders();
    };

    this.onApprovedCheerleadersReady = e => {
      this.approvedCheerleaders = this.cheerleaderService.getApprovedCheerleaders();
      this.shuffle(this.approvedCheerleaders);
      this.buildGrid(this.approvedCheerleaders.length)
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

  buildGrid(total: number) {
    if (total == this.oldTotal)
      return
    this.oldTotal = total;
    this.approvedGrid = [];

    let row = [];
    for (let i = 0; i < total; ++i) {
      row.push(i);

      if ((i + 1) % 2 == 0) {
        this.approvedGrid.push(row)
        row = [];
      }
    }
    if (row.length > 0) {
      this.approvedGrid.push(row);
    }
  }
}
