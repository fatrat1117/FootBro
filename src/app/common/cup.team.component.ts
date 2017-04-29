import { Component, Input } from '@angular/core';

import { MatchService } from '../../app/matches/match.service';
import { Localization } from '../../providers/localization'

declare var sprintf: any;

@Component({
  selector: 'sb-cup-team',
  template: `
    <div class="content-left">
      <div *ngIf="match1">
        <button ion-button clear icon-left disabled class="content-left-button no-margin">
          <ion-icon name="flag"color="danger"></ion-icon>
          {{ getRoundString(1) }}
        </button>
        <ion-list no-lines class="content-left-list no-margin">
          <ion-item class="content-left-list-item">
            <img src="assets/img/none.png" class="content-left-img" item-left>
            <button ion-button clear class="team-name">Team1</button>
            <button ion-button clear color="secondary" item-right class="team-score">6</button>
          </ion-item>
          <ion-item class="content-left-list-item">
            <img src="assets/img/none.png" class="content-left-img" item-left>
            <button ion-button clear class="team-name">Team2</button>
            <button ion-button clear color="secondary" item-right class="team-score">4</button>
          </ion-item>
        </ion-list>
      </div>

      <div *ngIf="match2">
        <button ion-button clear icon-left disabled class="content-left-button no-margin">
          <ion-icon name="flag"color="danger"></ion-icon>
          {{ getRoundString(2) }}
        </button>
        <ion-list no-lines class="content-left-list no-margin">
          <ion-item class="content-left-list-item">
            <img src="assets/img/none.png" class="content-left-img" item-left>
            <button ion-button clear class="team-name">Team3</button>
            <button ion-button clear color="secondary" item-right class="team-score">6</button>
          </ion-item>
          <ion-item class="content-left-list-item">
            <img src="assets/img/none.png" class="content-left-img" item-left>
            <button ion-button clear class="team-name">Team4</button>
            <button ion-button clear color="secondary" item-right class="team-score">4</button>
          </ion-item>
        </ion-list>
      </div>
    </div>

    <div *ngIf="match2" class="content-right">
      <div class="right-horizontal-line"></div>
      <div class="right-horizontal-line-center"></div>
      <div class="right-horizontal-line_bottom"></div>
      <div class="right-vertical-line"></div>
      <div class="right-vertical-line-bottom"></div>
      <button ion-button disabled class="right-button no-margin" color="secondary" outline small>{{ title }}</button>
    </div>

  `,
  styleUrls: ['/app/common/cup.team.component.scss']
})

export class SbCupTeamComponent {
  //@Input() match1: any;  // team1, team2, round, score1, score2
  //@Input() match2: any;
  //@Input() description: string;
  @Input() title: string;
  @Input() matchIds: string[];
  @Input() matchId1: string;
  @Input() matchId2: string;

  match1;
  match2;
  onMatchReady;

  constructor(private matchService: MatchService, private loc: Localization) {
  }

  ngOnInit() {
    this.addEventListeners();
    if (this.matchId1)
      this.matchService.getMatchAsync(this.matchId1);
    if (this.matchId2)
      this.matchService.getMatchAsync(this.matchId2);
  }

  ngOnDestroy() {
    document.removeEventListener('servicematchready', this.onMatchReady);
  }

  addEventListeners() {
    this.onMatchReady = e => {
      let id = e['detail'];
      if (this.matchId1 === id)
        this.match1 = this.matchService.getMatch(id);
      else if (this.matchId2 === id)
        this.match2 = this.matchService.getMatch(id);
    }
    document.addEventListener('servicematchready', this.onMatchReady);
  }


  getRoundString(round: number) {
    return sprintf(this.loc.getString('roundNumber'), round);
  }
}