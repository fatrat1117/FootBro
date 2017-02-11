import {Component} from '@angular/core';
import {ViewController, ModalController} from 'ionic-angular';
import {TeamService} from '../../app/teams/team.service';
import {CreateTeamPage} from '../create-team/create-team'

@Component({
  selector: 'page-search-team',
  templateUrl: 'search-team.html',
})
export class SearchTeamPage {
  totalTeams: any[];
  filteredTeams: any[];
  constructor(private viewCtrl: ViewController,
  private service : TeamService,
  private modalCtrl: ModalController) {
    this.totalTeams = [];
  }

  ionViewDidLoad() {
    document.addEventListener('serviceallteamsready', e => {
      this.totalTeams = this.service.getAllTeams();
      this.resetFilter();
    });

    this.service.getAllTeamsAsync();
  }

  resetFilter() {
    this.filteredTeams = this.totalTeams.slice();
  }

  trackByName(team) {
    return team.id;
  }

  filterTeams(ev: any) {
    // Reset items back to all of the items
    this.resetFilter();

    // set val to the value of the searchbar
    let val = ev.target.value;
    
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredTeams = this.filteredTeams.filter((team) => {
        return (team.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  dismiss(team: any) {
    this.viewCtrl.dismiss({ team: team });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  createTeam() {
    this.modalCtrl.create(CreateTeamPage).present();
  }
}
