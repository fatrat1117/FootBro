import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {FirebaseManager} from '../../providers/firebase-manager';
import {TeamService} from '../../app/teams/team.service';

@Component({
  selector: 'page-search-team',
  templateUrl: 'search-team.html',
})
export class SearchTeamPage {
  totalTeams: any[];
  filteredTeams: any[];
  constructor(private viewCtrl: ViewController, 
  private fm : FirebaseManager,
  private service : TeamService) {
    this.totalTeams = [];
  }

  ionViewDidLoad() {
    document.addEventListener('serviceallteamsready', e => {
      this.totalTeams = this.service.getAllTeams();
      this.resetFilter();
    });

    this.service.getAllTeamsAsync();
    // firebase
    // let sub = this.fm.getAllPublicTeams().subscribe(snapshots => {
    //   sub.unsubscribe();
    //   snapshots.forEach(snapshot => {
    //     let team: any = {};
    //     let id = snapshot.$key;
    //     this.service.getTeamAsync(id);
    //     // let subs = this.fm.getTeamBasic(snapshot.$key).subscribe(s => {
    //     //   team.id = snapshot.$key;
    //     //   team.name = s.name;
    //     //   team.logo = s.logo;
    //     // });
    //     this.totalTeams.push(team);
    //   });
    //  this.resetFilter();
    //});
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
}
