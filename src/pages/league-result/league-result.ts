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
  league: any;
  matchStandings;
  onTournamentTableReady;
  leagueResults = "schedule";

  constructor(private viewCtrl: ViewController, private navParams: NavParams, 
              private toastCtrl: ToastController, private alertCtrl: AlertController,
              private playerService: PlayerService, private teamService: TeamService, private matchService: MatchService) {
  }

  ionViewDidLoad() {
    this.league = this.navParams.get('league');
    if (this.league.status == 'end')
      this.leagueResults = "standings"

    
    this.addEventListeners();
    this.matchService.getTournamentTableAsync(this.league.$key);
  }

  ionViewWillUnload() {
    document.removeEventListener('servicetournamenttableready', this.onTournamentTableReady);
  }

  addEventListeners() {
    this.onTournamentTableReady = e => {
      let tournamentId = e['detail'];
      if (tournamentId === this.league.$key)
        this.matchStandings = this.matchService.getTournamentTable(tournamentId);
    };

    document.addEventListener('servicetournamenttableready', this.onTournamentTableReady);
  }
}
