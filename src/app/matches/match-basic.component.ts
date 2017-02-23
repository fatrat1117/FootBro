import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController } from "ionic-angular";
import { MatchService } from '../matches/match.service';
import { Match} from '../matches/match.model';
import { UpdateGamePage } from '../../pages/update-game/update-game'

@Component({
  selector: 'sb-match-basic',
  templateUrl: 'match-basic.component.html',
  styleUrls: ['/app/matches/match-basic.component.scss']
})

export class SbMatchBasicComponent implements OnInit {
  @Input()
  matchObj;
  // home;
  // away;
  match : Match;

  constructor(private navCtrl: NavController,
    private matchService: MatchService,
    private modalCtrl: ModalController) {

  }

  ngOnInit() {
    document.addEventListener('servicematchready', e => {
      let id = e['detail'];
      if (id === this.matchObj.$key) {
        this.match = this.matchService.getMatch(id);
      }
    })

    this.matchService.getMatchAsync(this.matchObj.$key);
  }

  goMatchDetailPage(e) {
    e.stopPropagation();
    this.modalCtrl.create(UpdateGamePage, {id: this.match.id}).present();
  }
}
