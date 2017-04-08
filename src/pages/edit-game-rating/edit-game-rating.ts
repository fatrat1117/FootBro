import { ViewController, NavParams, AlertController } from "ionic-angular";
import { Component } from "@angular/core";
import { PlayerRatingUI } from '../../app/players/player.model';
import { PlayerService } from '../../app/players/player.service';
import { TeamService } from '../../app/teams/team.service';
import { Localization } from '../../providers/localization'
declare var sprintf: any;

@Component({
  selector: 'page-edit-game-rating',
  templateUrl: 'edit-game-rating.html'
})

export class EditGameRatingPage {
  players: PlayerRatingUI[] = [];
  teamId;
  matchId;
  squad;
  playerPoints = 100

  constructor(private viewCtrl: ViewController,
    params: NavParams,
    private playerService: PlayerService,
    private teamService: TeamService,
    private alertCtrl: AlertController,
    private loc: Localization) {
    this.squad = params.get('squad');
    this.teamId = params.get('teamId');
    this.matchId = params.get('matchId');
  }

  ionViewDidLoad() {
    if (this.squad && 'participants' in this.squad) {
      this.squad.participants.forEach(p => {
        //do not rate self
        if (p.id !== this.playerService.selfId()) {
          let player = new PlayerRatingUI();
          player.player = this.playerService.findOrCreatePlayerAndPull(p.id);
          this.players.push(player);
        }
      })
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  doRatePlayers() {
    let ratings = {};
    this.players.forEach(p => {
      if ('player' in p) {
        ratings[p.player.id] = p.rating;
      }
    });
    this.teamService.ratePlayers(this.teamId, this.matchId, ratings);
    this.viewCtrl.dismiss(true);
  }

  ratePlayers() {
    let msg = sprintf(this.loc.getString('rateearnpoints'), this.playerPoints);
    let confirm = this.alertCtrl.create({
      title: this.loc.getString('note'),
      subTitle: msg,
      buttons: [
        {
          text: this.loc.getString('Cancel'),
          handler: () => {
          }
        },
        {
          text: this.loc.getString('OK'),
          handler: () => {
            this.doRatePlayers();
          }
        }
      ]
    });
    confirm.present();
  }
}
