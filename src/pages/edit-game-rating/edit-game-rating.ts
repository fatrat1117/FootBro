import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { PlayerRatingUI } from '../../app/players/player.model';
import { PlayerService } from '../../app/players/player.service';
import { TeamService } from '../../app/teams/team.service';

@Component({
  selector: 'page-edit-game-rating',
  templateUrl: 'edit-game-rating.html'
})

export class EditGameRatingPage {
  players: PlayerRatingUI[] = [];
  teamId;
  matchId;
  squad;

  constructor(private viewCtrl: ViewController,
    params: NavParams,
    private playerService: PlayerService,
    private teamService: TeamService) {
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

  ratePlayers() {
    let ratings = {};
    this.players.forEach(p => {
      if ('player' in p) {
        ratings[p.player.id] = p.rating;
      }
    });
    this.teamService.ratePlayers(this.teamId, this.matchId, ratings);
    this.viewCtrl.dismiss();
  }
}
