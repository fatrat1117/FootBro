import {Component} from '@angular/core';
import {ViewController, ModalController, NavParams} from 'ionic-angular';
import {MatchService} from '../../app/matches/match.service';

@Component({
  selector: 'page-search-match',
  templateUrl: 'search-match.html',
})
export class SearchMatchPage {
  matches;
  showDate: boolean;

  constructor(private viewCtrl: ViewController,
  private service : MatchService,
  private modalCtrl: ModalController,
  params : NavParams) {
    this.matches = params.get('matches');
    this.showDate = params.get('showDate');
    console.log(this.showDate);

  }

  ionViewDidLoad() {
    // document.addEventListener('serviceallteamsready', e => {
    //   this.totalTeams = this.service.getAllTeams();
    //   this.resetFilter();
    // });

  }

  resetFilter() {
   // this.filteredTeams = this.totalTeams.slice();
  }

  trackByName(team) {
   // return team.id;
  }

  filterTeams(ev: any) {
    // Reset items back to all of the items
    // this.resetFilter();

    // // set val to the value of the searchbar
    // let val = ev.target.value;

    // // if the value is an empty string don't filter the items
    // if (val && val.trim() != '') {
    //   this.filteredTeams = this.filteredTeams.filter((team) => {
    //     return (team.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
    //   })
    // }
  }


  close() {
    this.viewCtrl.dismiss();
  }

  hasMatches(){
    if (typeof this.matches != 'undefined' || this.matches != null){
      if(this.matches.length == 0){
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }
  }
}
