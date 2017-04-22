import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, PopoverController } from 'ionic-angular';
import { PlayerService } from '../../app/players/player.service';
import {ManagePlayerPopover} from './manage-players-menu';

@Component({
  templateUrl: 'team-players.html',
  selector: 'team-players',
})
export class TeamPlayersPage {
  //showDetail: boolean;
  teamId: string;
  players: any[];
  // filteredPlayers: any[];
  // showClose: boolean;
  // selectPlayersMode = false;
  // selectedPlayersMap = {};
  // addedPlayerMap = {};
  onTeamPlayersReady;

  constructor(private nav: NavController,
    navParams: NavParams,
    private playersService: PlayerService,
    private viewCtrl: ViewController,
    private popoverCtrl: PopoverController) {
    this.teamId = navParams.get('teamId');
    this.players = this.playersService.getTeamPlayers2(this.teamId);
    //console.log(this.players);
  }

  ionViewDidLoad() {
    // this.onTeamPlayersReady = e => {
    //   let id = e['detail'];
    //   if (id === this.teamId)
    //     this.totalPlayers = this.teamPlayersService.getTeamPlayers(id);
    //   //this.resetFilter();
    // };

    // document.addEventListener('serviceteamplayersready', this.onTeamPlayersReady);

    // this.teamPlayersService.getTeamPlayersAsync(this.teamId);
  }

  ionViewWillUnload() {
    //document.removeEventListener('serviceteamplayersready', this.onTeamPlayersReady);
  }

  popupManageMenu(myEvent) {
    let popover = this.popoverCtrl.create(ManagePlayerPopover);
    popover.present({ ev: myEvent});
  }

  // trackByName(player) {
  //   return player.id;
  // }

  // filterPlayers(ev: any) {
  //   // Reset items back to all of the items
  //   this.resetFilter();

  //   // set val to the value of the searchbar
  //   let val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != '') {
  //     this.filteredPlayers = this.filteredPlayers.filter((player) => {
  //       return (player.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }

  // selectPlayer(id: string) {
  //   if (this.selectPlayersMode)
  //     return;

  //   if (this.showDetail === true)
  //     this.nav.push(MyPlayerPage, { id: id });
  //   else
  //     this.viewCtrl.dismiss({ playerId: id });
  // }

  // close() {
  //   this.viewCtrl.dismiss();
  // }

  // dismiss() {
  //   // let playerIds = [];
  //   // for (let key in this.selectedPlayersMap) {
  //   //   if (this.selectedPlayersMap[key])
  //   //     playerIds.push(key);
  //   // }
  //   this.viewCtrl.dismiss({ selectedIds: this.selectedPlayersMap });
  // }

  // onSelectionChange(playerId, e) {
  //   this.selectedPlayersMap[playerId] = e.checked;
  // }
}
