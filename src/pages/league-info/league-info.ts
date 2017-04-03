import { Component } from "@angular/core";
import { ViewController, ToastController, AlertController, NavParams } from 'ionic-angular';
import { Localization } from '../../providers/localization'
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'
import { MatchService } from '../../app/matches/match.service'

@Component({
  selector: 'page-league-info',
  templateUrl: 'league-info.html'
})
export class LeagueInfoPage {
  league: any;
  selfId: string;
  selfPlayer: Player;
  selfTeam: Team;
  registerTeams: Team[];
  leagueInfo = "info";
  onPlayerReady;
  onTeamReady;
  onRegisteredTeamsReady;

  teamsGrid: number[][];
  oldTotal: number;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, 
              private toastCtrl: ToastController, private alertCtrl: AlertController,
              private playerService: PlayerService, private teamService: TeamService, 
              private matchService: MatchService, private loc : Localization) {
  }

  ionViewDidLoad() {
    this.league = this.navParams.get('league');
    
    this.addEventListeners();
    this.selfId = this.playerService.selfId();
    this.playerService.getPlayerAsync(this.selfId);
    this.matchService.getRegisteredTeamsAsync(this.league.$key);
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
    document.removeEventListener('serviceteamready', this.onTeamReady );
    document.removeEventListener('serviceregisteredteamsready', this.onRegisteredTeamsReady);
  }

  addEventListeners() {
    this.onPlayerReady = e => {
      let pId = e['detail'];
      if (pId === this.selfId) {
        this.selfPlayer = this.playerService.getPlayer(pId);
        if (!this.selfTeam && this.selfPlayer)
          this.teamService.getTeamAsync(this.selfPlayer.teamId);
      }
    };

    this.onTeamReady = e => {
      let tId = e['detail'];
      if (this.selfPlayer && tId === this.selfPlayer.teamId)
        this.selfTeam = this.teamService.getTeam(tId);
    };

    this.onRegisteredTeamsReady = e => {
      let lId = e['detail'];
      if (lId = this.league.$key) {
        this.registerTeams = this.matchService.getRegisteredTeams(lId);
        this.buildGrid(this.registerTeams.length);
      }
    }

    document.addEventListener('serviceplayerready', this.onPlayerReady);
    document.addEventListener('serviceteamready', this.onTeamReady );
    document.addEventListener('serviceregisteredteamsready', this.onRegisteredTeamsReady);
  }
  
  registerTeam() {
    if (this.selfId == this.selfTeam.captain) {
      let confirm = this.alertCtrl.create({
        title: this.loc.getString('enroll'),
        subTitle: this.selfTeam.name,
        //message: 'You will be able to message her once unlocked.',
        buttons: [
          {
            text: this.loc.getString('Cancel'),
            handler: () => {
            }
          },
          {
            text: this.loc.getString('OK'),
            handler: () => {
              this.matchService.registerLeague(this.selfTeam.id, this.league.$key);
            }
          }
        ]
      });
    confirm.present();

    }
    else {
      this.toastCtrl.create({
        message: this.loc.getString('youarenotcaptain'),
        duration: 2000,
        position: 'top'
      }).present();
    }
  }

  isRegistered() {
    if (this.registerTeams)
      return this.registerTeams.indexOf(this.selfTeam);
  }

  buildGrid(total: number) {
    if (total == this.oldTotal)
      return
    this.oldTotal = total;
    this.teamsGrid = [];

    let row = [];
    for (let i = 0; i < total; ++i) {
      row.push(i);
      
      if ((i+1)%3 == 0) {
        this.teamsGrid.push(row)
        row = [];
      }
    }
    if (row.length > 0) {
      this.teamsGrid.push(row);
    }
  }
}
