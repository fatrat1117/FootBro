import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { PlayerBasic } from '../../app/players/shared/player.model'
import { TeamBasic } from '../../app/teams/shared/team.model'

import { PlayerService } from '../../app/players/shared/player.service'
import { TeamService } from '../../app/teams/shared/team.service'
import { MyTeamPage } from "../my-team/my-team";
import { EditPlayerPage } from "../edit-player/edit-player";
import { ManageTeamPage } from "../manage-team/manage-team";
import { MyPlayerPage } from "../my-player/my-player";
import { FeedbackPage } from "../feedback/feedback";
import { MessagesPage } from "../messages/messages";

@Component({
  selector: 'page-me',
  templateUrl: 'me.html'
})
export class MePage {
  playerBasic: PlayerBasic;
  teamBasic: TeamBasic;
  messageCount: number;
  constructor(private navCtrl: NavController, 
  private modalCtrl: ModalController, 
  private playerService: PlayerService, 
  private teamService: TeamService,
  private af: AngularFire) {
    this.messageCount = 1;
  }

  ionViewDidLoad() {
    
    this.playerService.getSelfBasic().then(playerBasic => {
      this.playerBasic = playerBasic;
    });

    this.teamService.getSelfBasic().then(teamBasic => {
      this.teamBasic = teamBasic;
    });
  }

  goEditPlayerPage() {
    this.navCtrl.push(EditPlayerPage);
  }

  goSwitchTeamPage() {
    this.navCtrl.push(ManageTeamPage);
  }

  goPlayerPage() {
    this.navCtrl.push(MyPlayerPage);
  }

  goFeedbackPage() {
    this.navCtrl.push(FeedbackPage);
  }

  goTeamPage() {
    this.navCtrl.push(MyTeamPage);
  }

  goMessagesPage() {
    this.navCtrl.push(MessagesPage);
  }

  onLogout() {
    this.af.auth.logout();
  }
}
