import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, NavParams } from 'ionic-angular';
import { EditTeamNamePage } from './edit-team-name'
import { SearchPlayerPage } from '../search-player/search-player';
import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'
import { PlayerService } from '../../app/players/player.service'
import { FirebaseManager } from '../../providers/firebase-manager'
import { Localization } from '../../providers/localization'

@Component({
  selector: 'page-edit-team',
  templateUrl: 'edit-team.html'
})
export class EditTeamPage {
  teamId: string;
  team: Team;
  onTeamReady;
  busy = false;

  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, 
    private toastCtrl: ToastController, private navParams: NavParams,
    private playerService: PlayerService, private teamService: TeamService, 
    private fm : FirebaseManager, private loc : Localization) {
  }

  ionViewDidLoad() {
    this.teamId = this.navParams.get('teamId');
    this.addEventListeners();
    this.teamService.getTeamAsync(this.teamId);
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceteamready', this.onTeamReady);
  }

  addEventListeners() {
    this.onTeamReady = e => {
      let teamId = e['detail'];
      if (teamId === this.teamId) {
        this.team = this.teamService.getTeam(teamId);
      }
    };

    document.addEventListener('serviceteamready', this.onTeamReady);
  }

  changeLogo() {
    let self = this;
    self.busy = true;

    let success = logoUrl => {
      self.busy = false;
      this.teamService.updateTeamLogo(this.teamId, logoUrl);
    }

    let error = err => {
      console.log(err);
      self.busy = false;
    }

    this.fm.selectImgUploadGetUrl(this.teamId, this.fm.smallImageSize, this.fm.smallImageSize, success, error);
  }

  editName() {
    this.modalCtrl.create(EditTeamNamePage, {
      teamId: this.teamId,
      name: this.team.name
    }).present();
  }

  choosePlayer() {
    let modal = this.modalCtrl.create(SearchPlayerPage, {
      teamId: this.teamId,
      showClose: true
    });

    modal.onDidDismiss(data => {
      if (!data)
        return;
      let player = this.playerService.getPlayer(data['playerId']);

      if (player.id == this.playerService.selfId()) {
        this.toastCtrl.create({
          message: this.loc.getString('youarecaptain'),
          duration: 2000,
          position: 'top'
        }).present();
      }
      else {
        this.alertCtrl.create({
          title: `Promote ${player.name} to captain?`,
          message: `You cannot undo this action.`,
          buttons: ['Cancel',
            {
              text: "Confirm",
              handler: () => {
                this.teamService.promoteNewCaptain(this.teamId, player.id);
                this.navCtrl.pop();
              }
            }]
        }).present();
      }
    });

    modal.present();
  }
}


