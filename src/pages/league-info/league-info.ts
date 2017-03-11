import { Component } from "@angular/core";
import { ViewController, ToastController, AlertController, NavParams } from 'ionic-angular';

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
  leagueId: string
  selfId: string;
  selfPlayer: Player;
  selfTeam: Team;
  registerTeams: Team[];
  teams: Team[];
  leagueInfo = "info";
  constructor(private viewCtrl: ViewController, private navParams: NavParams, 
              private toastCtrl: ToastController, private alertCtrl: AlertController,
              private playerService: PlayerService, private teamService: TeamService, private matchService: MatchService) {
    // dummy data
    this.teams = [];
    for (let i = 0; i < 10; ++i) {
      let t = new Team();
      t.name = "宇宙第一超级无敌DDDDDDDDDDiao之巴塞罗那"+i;
      this.teams.push(t);
    }
  }

  ionViewDidLoad() {
    this.leagueId = '0';//this.navParams.get('leagueId');
    this.addEventListeners();
    this.selfId = this.playerService.selfId();
    this.playerService.getPlayerAsync(this.selfId);
    this.matchService.getRegisteredTeamsAsync(this.leagueId);
  }

  addEventListeners() {
    document.addEventListener('serviceplayerready', e => {
      let pId = e['detail'];
      if (pId === this.selfId) {
        this.selfPlayer = this.playerService.getPlayer(pId);
        if (!this.selfTeam && this.selfPlayer)
          this.teamService.getTeamAsync(this.selfPlayer.teamId);
      }
    });

    document.addEventListener('serviceteamready', e => {
      let tId = e['detail'];
      if (this.selfPlayer && tId === this.selfPlayer.teamId)
        this.selfTeam = this.teamService.getTeam(tId);
    });

    document.addEventListener('serviceregisteredteamsready', e => {
      let lId = e['detail'];
      if (lId = this.leagueId) {
        this.registerTeams = this.matchService.getRegisteredTeams(lId);
      }
    })
  }
  
  registerTeam() {
    if (this.selfId == this.selfTeam.captain) {
      let confirm = this.alertCtrl.create({
        title: `Register team:`,
        subTitle: this.selfTeam.name,
        //message: 'You will be able to message her once unlocked.',
        buttons: [
          {
            text: 'Confirm',
            handler: () => {
              this.matchService.registerLeague(this.selfTeam.id, this.leagueId);
            }
          },
          {
            text: 'Cancel',
            handler: () => {
            }
          }
        ]
      });
    confirm.present();

    }
    else {
      this.toastCtrl.create({
        message: 'Only captain can register.',
        duration: 2000,
        position: 'top'
      }).present();
    }
  }
}
