import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular'
import { CheeringTeamStatsPage } from './cheering-team-stats'
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { CheerleaderService } from '../../app/cheerleaders/cheerleader.service'
import { MessageService } from '../../app/messages/message.service'
import { ChatPage } from '../chat/chat'
import { Localization } from '../../providers/localization'

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
  afPendingSelf;
  onPendingCheerleadersReady;
  onApprovedCheerleadersReady;
  onPlayerReady;
  onBlacklistReady;

  approvedGrid: number[][];
  oldTotal: number;
  blacklist: string[];
  pendingGrid: number[][];
  oldPendingTotal: number;

  constructor(private nav: NavController,
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private cheerleaderService: CheerleaderService,
    private messageService: MessageService,
    private alertCtrl: AlertController,
    private loc: Localization) {
    if (this.playerService.isAuthenticated())
      this.afPendingSelf = this.cheerleaderService.afPendingCheerleaderSelf();
  }

  ionViewDidLoad() {
    //this.selfPlayer = this.playerService.getSelfPlayer();
    this.blacklist = [];
    this.addEventListeners();
    if (this.playerService.isAdmin())
      this.cheerleaderService.getPendingCheerleadersAsync();
    this.cheerleaderService.getApprovedCheerleadersAsync();
    if (this.playerService.isAuthenticated()) {
      this.playerService.getPlayerAsync(this.playerService.selfId());
      this.messageService.prepareBlacklist();
    }
  }

  ionViewWillUnload() {
    document.removeEventListener('servicependingcheerleadersready', this.onPendingCheerleadersReady);
    document.removeEventListener('serviceapprovedcheerleadersready', this.onApprovedCheerleadersReady);
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
    document.removeEventListener('serviceblacklistready', this.onBlacklistReady);
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
      this.pendingGrid = this.buildGrid(this.pendingCheerleaders.length, this.oldPendingTotal);
    };

    this.onApprovedCheerleadersReady = e => {
      this.approvedCheerleaders = this.cheerleaderService.getApprovedCheerleaders();
      this.shuffle(this.approvedCheerleaders);
      this.approvedGrid = this.buildGrid(this.approvedCheerleaders.length, this.oldTotal);
    };

    this.onPlayerReady = e => {
      let playerId = e['detail'];
      if (playerId === this.playerService.selfId()) {
        this.selfPlayer = this.playerService.getPlayer(playerId);
      }
    };

    this.onBlacklistReady = e => {
      this.blacklist = this.messageService.getBlackList();
    }

    document.addEventListener('servicependingcheerleadersready', this.onPendingCheerleadersReady);
    document.addEventListener('serviceapprovedcheerleadersready', this.onApprovedCheerleadersReady);
    document.addEventListener('serviceplayerready', this.onPlayerReady);
    document.addEventListener('serviceblacklistready', this.onBlacklistReady);
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
    let confirm = this.alertCtrl.create({
      title: 'Approve?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
             this.cheerleaderService.approve(id);
          }
        }
      ]
    });
    confirm.present();
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

  buildGrid(total: number, old: number) {
    if (total == old)
      return
    old = total;
    let grid = [];

    let row = [];
    for (let i = 0; i < total; ++i) {
      row.push(i);

      if ((i + 1) % 2 == 0) {
        grid.push(row)
        row = [];
      }
    }
    if (row.length > 0) {
      grid.push(row);
    }

    return grid;
  }

/*
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

  buildPendingGrid(total: number) {
    if (total == this.oldPendingTotal)
      return
    this.oldPendingTotal = total;
    this.pendingGrid = [];

    let row = [];
    for (let i = 0; i < total; ++i) {
      row.push(i);

      if ((i + 1) % 2 == 0) {
        this.pendingGrid.push(row)
        row = [];
      }
    }
    if (row.length > 0) {
      this.pendingGrid.push(row);
    }
  }
  */

  onReport(id) {
    let confirm = this.alertCtrl.create({
      subTitle: this.loc.getString('reportobjectionalbecontent'),
      message: this.loc.getString('systemadminsdealwithreport'),
      buttons: [
        {
          text: this.loc.getString('Cancel'),
          handler: () => {
          }
        },
        {
          text: this.loc.getString('OK'),
          handler: () => {
            this.cheerleaderService.report(id);
          }
        }
      ]
    });
    confirm.present();
  }

  isBlocking(id) {
    return this.blacklist.indexOf(id) > -1;
  }

  block(id) {
    this.cheerleaderService.blockUser(id);
  }
  unblock(id) {
    this.cheerleaderService.unblockUser(id);
  }
}
