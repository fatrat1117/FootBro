import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { TeamService } from '../../app/teams/team.service'

@Component({
  selector: 'page-create-team',
  templateUrl: 'create-team.html',
})
export class CreateTeamPage {
  teamName: any;
  location: any;
  busy: boolean;
  constructor(private viewCtrl: ViewController,
    private service: TeamService) {
    this.busy = false;
    this.location = 'SG';
    this.teamName = '';

    document.addEventListener('createteamsucceeded', e => {
      this.dismiss();
    })

    document.addEventListener('createteamfailed', e => {
      this.busy = false;
      alert(e['detail']);
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  doCancel() {
    this.dismiss();
  }

  doCreateTeam() {
    let teamObj = {
      name: this.teamName.trim(),
      location: this.location,
      isDefault: true
    };

    this.busy = true;
    let self = this;
    // let success = function () {
    //   self.dismiss();
    // }

    // let error = function (e) {
    //   self.busy = false;
    //   alert(e);
    // }
    this.service.createTeam(teamObj);
  }
}
