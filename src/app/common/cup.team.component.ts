import { Component, Input } from '@angular/core';

import { MatchService } from '../../app/matches/match.service';
import { Localization } from '../../providers/localization'

declare var sprintf: any;

@Component({
  selector: 'sb-cup-team',
  template: `
  <div *ngFor="let p of matchPairs">
    <div class="content-left" [ngStyle]="getLeftWidth(p)">
      <div *ngIf="p[0]">
        <button ion-button clear disabled class="content-left-button no-margin">
          {{ p[0].date | date:'yyyy-MM-dd' }}
        </button>
        <ion-list no-lines class="content-left-list no-margin" [ngStyle]="getMargin(p)">
          <ion-item class="content-left-list-item">
            <img [src]="p[0].home?.logo" class="content-left-img" item-left>
            <button ion-button clear disabled class="team-name">{{ p[0].home?.name }}</button>
            <button ion-button clear disabled color="secondary" item-right class="team-score">{{ p[0].homeScore }} 
            <span *ngIf="p[0].homePenalty>=0">&nbsp;({{p[0].homePenalty}})</span></button>
          </ion-item>
          <ion-item class="content-left-list-item">
            <img [src]="p[0].away?.logo" class="content-left-img" item-left>
            <button ion-button clear disabled class="team-name">{{ p[0].away?.name }}</button>
            <button ion-button clear disabled color="secondary" item-right class="team-score">{{ p[0].awayScore }}
            <span *ngIf="p[0].awayPenalty>=0">&nbsp;({{p[0].awayPenalty}})</span></button>
          </ion-item>
        </ion-list>
      </div>

      <div *ngIf="p[1]">
        <button ion-button clear disabled class="content-left-button no-margin">
          {{ p[1].date | date:'yyyy-MM-dd' }}
        </button>
        <ion-list no-lines class="content-left-list no-margin">
          <ion-item class="content-left-list-item">
            <img [src]="p[1].home?.logo" class="content-left-img" item-left>
            <button ion-button clear disabled class="team-name">{{ p[1].home?.name }}</button>
            <button ion-button clear disabled color="secondary" item-right class="team-score">{{ p[1].homeScore }}
            <span *ngIf="p[1].homePenalty>=0">&nbsp;({{p[1].homePenalty}})</span></button>
          </ion-item>
          <ion-item class="content-left-list-item">
            <img [src]="p[1].away?.logo" class="content-left-img" item-left>
            <button ion-button clear disabled class="team-name">{{ p[1].away?.name }}</button>
            <button ion-button clear disabled color="secondary" item-right class="team-score">{{ p[1].awayScore }}
            <span *ngIf="p[1].awayPenalty>=0">&nbsp;({{p[1].awayPenalty}})</span></button>
          </ion-item>
        </ion-list>
      </div>
    </div>

    <div *ngIf="p[1]" class="content-right">
      <div class="right-horizontal-line"></div>
      <div class="right-horizontal-line-center"></div>
      <div class="right-horizontal-line_bottom"></div>
      <div class="right-vertical-line"></div>
      <div class="right-vertical-line-bottom"></div>
      <button ion-button disabled class="right-button no-margin" color="secondary" outline small>{{ title }}</button>
    </div>
  </div>
  `,
  styleUrls: ['/app/common/cup.team.component.scss']
})

export class SbCupTeamComponent {
  //@Input() match1: any;  // team1, team2, round, score1, score2
  //@Input() match2: any;
  //@Input() description: string;
  @Input() title: string;
  @Input() matchPairs: any[];

  constructor(private matchService: MatchService, private loc: Localization) {
  }

  getLeftWidth(pair) {
    let style: any = {};
    style.width = "80%";
    if (pair.length < 2)
      style.width = "100%";

    return style;
  }

  getMargin(pair) {
    let style: any = {};
    style['margin-right'] = "0px";
    if (pair.length < 2)
      style['margin-right'] = "10px";
      
    return style;
  }

/*
  ngOnInit() {
    console.log("init");
    
    let pair = [];
    for (let i = 0; i < this.matchIds.length; ++i) {
      pair.push(this.matchIds[i]);
      if (i % 2 == 1) {
        this.matchPairs.push(pair);
        pair = [];
      }
    }
    if (pair.length != 0)
      this.matchPairs.push(pair);
    
    console.log(this.matchPairs);
    

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
  */


  getRoundString(round: number) {
    return sprintf(this.loc.getString('roundNumber'), round);
  }
}