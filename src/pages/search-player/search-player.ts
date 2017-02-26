import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PlayerService } from '../../app/players/player.service';
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
  selectPlayersMode = false;
  selectedPlayersMap = {};

  constructor(private nav: NavController, 
  navParams: NavParams, 
  private teamPlayersService: PlayerService, 
  private viewCtrl: ViewController) {
    this.teamId = navParams.get('teamId');
    //console.log(this.teamId);
    this.showDetail = navParams.get('showDetail');
    this.showClose = navParams.get('showClose');
    this.selectPlayersMode = navParams.get('selectPlayersMode');
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
    if (this.selectPlayersMode)
      return;

    if (this.showDetail === true)
      this.nav.push(MyPlayerPage, { pId: id });
    else
      this.viewCtrl.dismiss({ playerId: id });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  dismiss() {
    console.log(this.selectedPlayersMap);
  }

  onSelectionChange(playerId, e) {
    this.selectedPlayersMap[playerId] = e.checked;
  }
}
