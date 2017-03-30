import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams, PopoverController, AlertController, ModalController } from 'ionic-angular';
import { Match, PREDEFINEDSQUAD } from '../../app/matches/match.model';
import { PlayerService } from '../../app/players/player.service';
import { UIHelper } from '../../providers/uihelper';
import { TeamService } from '../../app/teams/team.service';
import { SquadSelectPage } from '../../pages/squad-select/squad-select';
import { Localization } from '../../providers/localization'
import { ManageSquadPage } from '../../pages/manage-squad/manage-squad'

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
  teamMode = false;
  squadId;
  teamSquad;

  constructor(private viewCtrl: ViewController,
    private playerService: PlayerService,
    private uiHelper: UIHelper,
    navParams: NavParams,
    private teamService: TeamService,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private loc: Localization,
    private modal: ModalController) {
    this.match = navParams.get('match');
    this.teamId = navParams.get('teamId');
    this.teamMode = navParams.get('teamMode');
    this.squadId = navParams.get('squadId');
    if (this.teamMode && this.squadId) {
      let squads = this.teamService.getTeam(this.teamId).squads;
      for (let i = 0; i < squads.length; ++i) {
        let squad = squads[i];
        if (squad.$key === this.squadId) {
          this.teamSquad = squad;
          this.currentSquadForm = squad.formation;
          break;
        }
      }
    }
    this.squadSettings = {};
    if (this.teamSquad && this.teamSquad.creator !== this.playerService.selfId()) {
      this.squadSettings.editMode = false;
    }
    else
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
    if (this.teamSquad) {
      setTimeout(() => {
        this.squadCtrl.setSquad(this.teamSquad);
      }, 500)
    }
  }

  loadPredefinedSquad() {
    let predefinedSquadId;
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
    if (predefinedSquadId)
      this.squadCtrl.setLineup(PREDEFINEDSQUAD[predefinedSquadId]);
  }

  saveSquad() {
    let squad = this.squadCtrl.getSquad();
    if (this.teamMode)
      this.saveTeamSquad(squad);
    else {
      this.teamService.saveMatchSquad(this.teamId, this.match.id, squad);
      this.dismiss();
    }
  }

  saveTeamSquad(squad: any) {
    let prompt = this.alertCtrl.create({
      title: this.loc.getString('squaddescription'),
      inputs: [
        {
          name: 'name',
          value: this.teamSquad ? this.teamSquad.name : null,
          placeholder: this.loc.getString('entersquaddescription')
        },
      ],
      buttons: [
        {
          text: this.loc.getString('Cancel'),
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.loc.getString('Save'),
          handler: data => {
            squad.name = data.name;
            squad.creator = this.playerService.selfId();
            squad.formation = this.currentSquadForm;
            this.teamService.saveTeamSquad(this.teamId, squad, this.squadId);
            this.dismiss();
          }
        }
      ]
    });
    prompt.present();
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
      if (data) {
        this.currentSquadForm = data;
        this.loadPredefinedSquad();
      }
    });
  }

  selectSquads() {
    let modal = this.modal.create(ManageSquadPage, { teamId: this.teamId, selectMode: true });
    modal.onDidDismiss(e => {
      if (e) {
        this.teamSquad = e;
        this.squadCtrl.setSquad(this.teamSquad);
      }
    });
    modal.present();
  }
}
