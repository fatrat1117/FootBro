import { Component, Input } from '@angular/core';
import { Match } from '../../app/matches/match.model'

@Component({
  selector: 'result-score',
  template: `
    <button disabled ion-button class="game-time" ngClass="{{hostPageName}}">
      {{upcomingMatch?.time | date:'yyyy-MM-dd h:mma'}}
    </button>
  <!--对战信息-->
  <ion-row class="game-info" ngClass="{{hostPageName}}" center>
    <!--左边队伍信息-->
    <ion-col width-33>
      <img [src]="upcomingMatch?.home?.logo" class="team-logo">
      <!--p class="team-left-text">{{match?.home?.name}}</p-->
    </ion-col>
    <!--中间比分-->
    <ion-col width-33 class="game-score">
      <ion-row center>
        <ion-col>
          {{upcomingMatch?.homeScore}}
        </ion-col>
        <ion-col>
          :
        </ion-col>
        <ion-col>
          {{upcomingMatch?.awayScore}}
        </ion-col>
      </ion-row>
    </ion-col>
    <!--右边队伍信息-->
    <ion-col width-33>
      <img [src]="upcomingMatch?.away?.logo" class="team-logo">
      <!--p class="team-right-text">{{match?.away?.name}}</p-->
    </ion-col>
  </ion-row>
  <ion-row class="team-name" ngClass="{{hostPageName}}">
    <ion-col width-33>{{upcomingMatch?.home?.name}}</ion-col>
    <ion-col width-33></ion-col>
    <ion-col width-33>{{upcomingMatch?.away?.name}}</ion-col>
  </ion-row>
  `,
  styleUrls: ['/app/common/result.score.component.scss']
})

export class ResultScoreComponent {
  // @Input() title: string;
  // @Input() rate: number

  @Input() upcomingMatch : Match;
  @Input() hostPageName : String;
}
