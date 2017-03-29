import { Component } from '@angular/core';
import { NavParams, ModalController} from 'ionic-angular'
import { EditSquadPage } from '../edit-squad/edit-squad';
import { Match } from '../../app/matches/match.model';

@Component({
  selector: 'page-manage-squad',
  templateUrl: 'manage-squad.html'
})
export class ManageSquadPage {
  teamId;
  match = new Match();
  constructor(params: NavParams,
  private modal: ModalController) {
    this.teamId = params.get('teamId');
    this.match.id = "nonexists";
  }

  ionViewDidLoad() {

  }

  ionViewWillUnload() {

  }  

  openEditSquadPage() {
    this.modal.create(EditSquadPage, { match: this.match, teamId: this.teamId }).present();
  }
}
