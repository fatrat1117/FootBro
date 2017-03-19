import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, NavParams } from 'ionic-angular';

import { EditTeamNamePage } from './edit-team-name'
import { SearchPlayerPage } from '../search-player/search-player';
/*
import { EditPlayerHeightPage } from './edit-player-height'
import { EditPlayerWeightPage } from './edit-player-weight'
import { EditPlayerPositionPage } from './edit-player-position'
import { EditPlayerFootPage } from './edit-player-foot'
import { EditPlayerDescriptionPage } from './edit-player-description'
*/

import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'
import { PlayerService } from '../../app/players/player.service'


@Component({
  selector: 'page-edit-team',
  templateUrl: 'edit-team.html'
})
export class EditTeamPage {
  teamId: string;
  team: Team;
  onTeamReady;

  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, 
    private toastCtrl: ToastController, private navParams: NavParams,
    private playerService: PlayerService, private teamService: TeamService, ) {
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
          message: 'You are already the captain.',
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

  /*
    editHeight() {
      this.modalCtrl.create(EditPlayerHeightPage, {
        height: this.player.height
      }).present();
    }
  
    editWeight() {
      this.modalCtrl.create(EditPlayerWeightPage, {
        weight: this.player.weight
      }).present();
    }
  
    editPosition() {
     this.modalCtrl.create(EditPlayerPositionPage, {
       position: this.player.position
     }).present();
    }
  
    editFoot() {
      this.modalCtrl.create(EditPlayerFootPage, {
        foot: this.player.foot
      }).present();
    }
  
    editDescription() {
      this.modalCtrl.create(EditPlayerDescriptionPage, {
        description: this.player.description
      }).present();
    }
  
    setDefaultTeam(id: string, slidingItem) {
      slidingItem.close();
      this.playerService.setDefaultTeam(id);
      this.updatePlayerTeams();
    }
  
    quitTeam(id: string, slidingItem) {
      slidingItem.close();
      this.playerService.quitTeam(id);
      this.teamService.getPlayerTeamsAsync(this.playerService.selfId());
    }
    */
}


