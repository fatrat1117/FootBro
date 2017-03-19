import {ViewController, NavParams} from "ionic-angular";
import {Component, ViewChild} from "@angular/core";
import {PlayerRatingUI} from '../../app/players/player.model';
import {PlayerService} from '../../app/players/player.service';

@Component({
  selector: 'page-edit-game-rating',
  templateUrl: 'edit-game-rating.html'
})

export class EditGameRatingPage {
  @ViewChild('ratingCtrl') ratingCtrl;

  players : PlayerRatingUI[] = [];
  teamId;
  matchId;
  squad;
  
  constructor(private viewCtrl: ViewController,
  params: NavParams,
  private playerService: PlayerService) {
    this.squad = params.get('squad');
    this.teamId = params.get('teamId');
    this.matchId = params.get('matchId');
  }

  ionViewDidLoad() {
    if (this.squad && 'participants' in this.squad) {
      this.squad.participants.forEach(p => {
        let player = new PlayerRatingUI();
        player.player = this.playerService.findOrCreatePlayerAndPull(p.id);
        this.players.push(player);
      })
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
