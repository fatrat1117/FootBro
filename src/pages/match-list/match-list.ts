import { Component } from '@angular/core';
import { NavController ,ModalController } from 'ionic-angular';
import { Match } from '../../app/matches/match.model'
import { NewGamePage } from "../new-game/new-game";
import { MatchesPage } from '../matches/matches';
import { EditSquadPage } from '../edit-squad/edit-squad';
import { LeagueInfoPage } from "../league-info/league-info";
import * as moment from 'moment';

import { PlayerService } from '../../app/players/player.service'
import { MatchService } from '../../app/matches/match.service'

@Component({
  selector: 'page-match-list',
  templateUrl: 'match-list.html'
})

export class MatchListPage {

  constructor(public navCtrl: NavController, private modal: ModalController, private playerService: PlayerService, private matchService: MatchService) {
  }

  ionViewDidLoad() {
  }

  goMatchesPage() {
    this.navCtrl.push(MatchesPage);
  }

  goLeaguePage() {
    if (this.playerService.isAuthenticated()) {
      this.navCtrl.push(LeagueInfoPage);
    }
    else
      this.playerService.checkLogin();
  }

  goEditSquadPage(){
    var testMatchId = "-KfHbLZ8ON_KHG3LVImp";
    this.matchService.getMatchAsync(testMatchId);
     var testMatch = this.matchService.getMatch(testMatchId);
     if (testMatch){
      this.modal.create(EditSquadPage, { match: testMatch, teamId: testMatch.homeId }).present();
     }

    
   
  }
}
