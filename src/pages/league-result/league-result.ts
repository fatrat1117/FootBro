import { Component } from "@angular/core";
import { ViewController, ToastController, AlertController, NavParams } from 'ionic-angular';

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'
import { MatchService } from '../../app/matches/match.service'

@Component({
  selector: 'page-league-result',
  templateUrl: 'league-result.html'
})
export class LeagueResultPage {
  leagueId: string;
  matchStandings;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, 
              private toastCtrl: ToastController, private alertCtrl: AlertController,
              private playerService: PlayerService, private teamService: TeamService, private matchService: MatchService) {
  }

  ionViewDidLoad() {
    this.leagueId = this.navParams.get('leagueId');
    this.addEventListener()
    this.matchService.getTournamentTableAsync(this.leagueId);
  }

  addEventListener() {
    document.addEventListener('servicetournamenttableready', e => {
      let tournamentId = e['detail'];
      if (tournamentId === this.leagueId)
        this.matchStandings = this.matchService.getTournamentTable(tournamentId);
    });
  }
}
