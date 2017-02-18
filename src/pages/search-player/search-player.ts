import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TeamPlayersService } from '../../app/teams/teamplayers.service';
import { MyPlayerPage } from '../my-player/my-player';

@Component({
  templateUrl: 'search-player.html',
  selector: 'search-player'
})
export class SearchPlayerPage {
  showDetail: boolean;
  teamId: string;
  totalPlayers: any[];
  filteredPlayers: any[];
  showClose: boolean;
  constructor(private nav: NavController, 
  private navParams: NavParams, 
  private teamPlayersService: TeamPlayersService, 
  private viewCtrl: ViewController) {
    this.teamId = this.navParams.get('teamId');
    this.showDetail = this.navParams.get('showDetail');
    this.showClose = this.navParams.get('showClose');
    this.totalPlayers = [];
  }

  ionViewDidLoad() {
    document.addEventListener('serviceteamplayersready', e=>{
      let id = e['detail'];
      if (id === this.teamId)
        this.totalPlayers = this.teamPlayersService.getTeamPlayers(id);
      this.resetFilter();
    })

    this.teamPlayersService.getTeamPlayersAsync(this.teamId);
  }

  resetFilter() {
    this.filteredPlayers = this.totalPlayers.slice();
  }

  trackByName(player) {
    return player.id;
  }

  filterPlayers(ev: any) {
    // Reset items back to all of the items
    this.resetFilter();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredPlayers = this.filteredPlayers.filter((player) => {
        return (player.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  selectPlayer(id: string) {
    if (this.showDetail === true)
      this.nav.push(MyPlayerPage, { pId: id });
    else
      this.viewCtrl.dismiss({ playerId: id });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
