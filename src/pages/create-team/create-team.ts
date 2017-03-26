import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { TeamService } from '../../app/teams/team.service';
import { Localization} from '../../providers/localization'
import { FirebaseManager} from '../../providers/firebase-manager'

@Component({
  selector: 'page-create-team',
  templateUrl: 'create-team.html',
})
export class CreateTeamPage {
  teamName: any;
  location: any;
  busy: boolean;
  isDefault = false;
  onSuccess;
  onFail;
  logoData: any;
  logoUrl = 'assets/img/none.png';

  constructor(private viewCtrl: ViewController,
    private service: TeamService,
    private loc : Localization,
    private fm : FirebaseManager) {
    this.busy = false;
    this.location = 'SG';
    this.teamName = '';
  }

  ionViewDidLoad() {
    this.onSuccess = e => {
      this.dismiss();
    };
    this.onFail = e => {
      this.busy = false;
      alert(this.loc.getString(e['detail']));
    };

    
    document.addEventListener('createteamsucceeded', this.onSuccess);
    document.addEventListener('createteamfailed', this.onFail);
  }

  ionViewWillUnload() {
    document.removeEventListener('createteamsucceeded', this.onSuccess);
    document.removeEventListener('createteamfailed', this.onFail);
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
    this.service.createTeam(teamObj, this.isDefault);
  }

  changePhoto() {
    let self = this;
    self.busy = true;

    let success = data => {
      self.logoData = data;
      self.busy = false;
      self.logoUrl = "data:image/jpeg;base64," + data;
    }
    let error = err => {
      alert(err);
      self.busy = false;
    }
    this.fm.selectImgGetData(256, 256, success, error);
  }
}
