import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TeamBasic } from '../../app/teams/shared/team.model'
import { TeamService } from '../../app/teams/shared/team.service'


@Component({
  selector: 'page-edit-team',
  templateUrl: 'edit-team.html',
  providers: [TeamService]
})
export class EditTeamPage {
  teamBasic: TeamBasic;
  constructor(private navCtrl: NavController, private teamService: TeamService) {

  }

  ionViewDidLoad() {
    this.teamService.getSelfBasic().then(teamBasic => {
      this.teamBasic = teamBasic;
    });
  }
}
