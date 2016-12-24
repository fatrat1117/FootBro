import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PlayerBasic } from '../../app/players/shared/player.model'
import { TeamBasic } from '../../app/teams/shared/team.model'

import { PlayerService } from '../../app/players/shared/player.service'
import { TeamService } from '../../app/teams/shared/team.service'

import { EditPlayerPage } from "../edit-player/edit-player";
import { EditTeamPage } from "../edit-team/edit-team";
import { MyPlayerPage } from "../my-player/my-player";
import { FeedbackPage } from "../feedback/feedback";

@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
  providers: [PlayerService, TeamService]
})
export class MePage {
  playerBasic: PlayerBasic;
  teamBasic: TeamBasic;
  constructor(private navCtrl: NavController, private playerService: PlayerService, private teamService: TeamService) {

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

  goEditTeamPage() {
    this.navCtrl.push(EditTeamPage);
  }

  goPlayerPage() {
    this.navCtrl.push(MyPlayerPage);
  }

  goFeedbackPage() {
    this.navCtrl.push(FeedbackPage);
  }
}
