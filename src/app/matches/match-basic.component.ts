import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController } from "ionic-angular";
import { MatchService } from '../matches/match.service';
import { Match } from '../matches/match.model';
import { UpdateGamePage } from '../../pages/update-game/update-game'
import { NewGamePage } from '../../pages/new-game/new-game'
import { MatchDetailPage } from '../../pages/match-detail/match-detail'
import { PlayerService } from '../players/player.service'

@Component({
  selector: 'sb-match-basic',
  templateUrl: 'match-basic.component.html',
  styleUrls: ['/app/matches/match-basic.component.scss']
})

export class SbMatchBasicComponent implements OnInit {
  @Input() showDate: boolean;
  @Input()
  matchObj;
  // home;
  // away;
  match: Match;

  constructor(private navCtrl: NavController,
    private matchService: MatchService,
    private modalCtrl: ModalController,
    private PlayerService: PlayerService) {
  }

  ngOnInit() {
    document.addEventListener('servicematchready', e => {
      let id = e['detail'];
      if (id === this.matchObj.$key) {
        this.match = this.matchService.getMatch(id);
        //console.log(this.match);
      }
    })

    this.matchService.getMatchAsync(this.matchObj.$key);
  }

  goUpdateMatchPage(e) {
    e.stopPropagation();
    if (this.match.isStarted())
      this.modalCtrl.create(UpdateGamePage, { id: this.match.id }).present();
    else
      this.modalCtrl.create(NewGamePage, { id: this.match.id }).present();
  }

  goMatchDetailPage() {
    this.modalCtrl.create(MatchDetailPage, { match: this.match }).present();
  }

  canUpdate() {
    return this.PlayerService.isCaptain(this.PlayerService.selfId(), this.matchObj.homeId) ||
      this.PlayerService.isCaptain(this.PlayerService.selfId(), this.matchObj.awayId);
  }
}
