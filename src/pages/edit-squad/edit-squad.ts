import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams, PopoverController } from 'ionic-angular';
import { Match, PREDEFINEDSQUAD } from '../../app/matches/match.model';
import { PlayerService } from '../../app/players/player.service';
import { UIHelper } from '../../providers/uihelper';
import { TeamService } from '../../app/teams/team.service';
import { SquadSelectPage } from '../../pages/squad-select/squad-select';

@Component({
  selector: 'page-edit-squad',
  templateUrl: 'edit-squad.html'
})
export class EditSquadPage {
  @ViewChild('pageHeader') pageHeader;
  @ViewChild('squadCtrl') squadCtrl;

  match: Match;
  squadSettings: any;
  teamId;
  selectedSquad = 11; //Default Squad Number set to 11
  popOverPage: any;
  currentSquadForm = '4-4-2';

  constructor(private viewCtrl: ViewController,
    private playerService: PlayerService,
    private uiHelper: UIHelper,
    navParams: NavParams,
    private teamService: TeamService,
    private popoverCtrl: PopoverController) {
    this.match = navParams.get('match');
    this.teamId = navParams.get('teamId');
    this.squadSettings = {};
    this.squadSettings.editMode = true;
    this.squadSettings.matchId = this.match.id;
    this.squadSettings.teamId = this.teamId;
  }

  dismiss() {
    this.viewCtrl.dismiss();
    if (this.popOverPage) {
      this.popOverPage.dismiss();
    }
  }

  ionViewDidLoad() {
    this.squadSettings.offsetY = this.pageHeader.nativeElement.clientHeight;
    console.log('editsquadloaded', this.squadCtrl);
    //this.squadCtrl.loadSquad();
  }

  load7() {

  }

  load11() {
    //console.log(this.squadCtrl);
    this.squadCtrl.setSquad(PREDEFINEDSQUAD['442']);
  }

  loadPredefinedSquad() {
    let predefinedSquadId = '442';
    switch (this.currentSquadForm) {
      case '4-4-2':
        predefinedSquadId = '442';
        break;
      case '3-5-2':
        predefinedSquadId = '352';
        break;
      case '4-5-1':
        predefinedSquadId = '451';
        break;
      case '4-3-3':
        predefinedSquadId = '433';
        break;
      case '4-2-3-1':
        predefinedSquadId = '4231';
        break;
      case '3-2-1':
        predefinedSquadId = '321';
        break;
      case '3-1-2':
        predefinedSquadId = '312';
        break;
      case '2-3-1':
        predefinedSquadId = '231';
        break;
      case '2-0-2':
        predefinedSquadId = '202';
        break;
      case '0-2-2':
        predefinedSquadId = '22';
        break;
      case '1-1-2':
        predefinedSquadId = '112';
        break;
      case '1-2-1':
        predefinedSquadId = '121';
        break;
    }
    this.squadCtrl.setSquad(PREDEFINEDSQUAD[predefinedSquadId]);
  }

  saveSquad() {
    let squad = this.squadCtrl.getSquad();
    this.teamService.saveMatchSquad(this.teamId, this.match.id, squad);
    this.dismiss();

  }

  selectSquadNumber(myEvent, number) {

    if (this.popOverPage) {
      this.popOverPage.dismiss();
    }
    this.selectedSquad = number;
    this.popOverPage = this.popoverCtrl.create(SquadSelectPage, { select: this.selectedSquad }, { cssClass: 'squad-popover' });

    this.popOverPage.present({
      ev: myEvent
    });

    this.popOverPage.onDidDismiss(data => {
      console.log(data);
      this.currentSquadForm = data;
      this.loadPredefinedSquad();
    });
  }
}
