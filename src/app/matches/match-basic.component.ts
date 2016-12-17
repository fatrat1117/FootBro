import { Component, Input } from '@angular/core';

import {MatchBasic} from './shared/match.model'

@Component({
  selector: 'sb-match-basic',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col class="matches-info" no-padding>
          <ion-item class="team-bar">
            <ion-thumbnail item-left>
              <ion-img src="assets/team-logo/team_logo.jpg"></ion-img>
            </ion-thumbnail>
            <ion-grid no-padding>
              <ion-row no-padding>
                <ion-col no-padding class="team-name">
                  {{ matchBasic.homeId }}
                </ion-col>
                <ion-col no-padding width-10 class="team-score">
                  {{ matchBasic.homeScore }}
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
          <ion-item class="team-bar">
            <ion-thumbnail item-left>
              <ion-img src="assets/team-logo/team_logo.jpg"></ion-img>
            </ion-thumbnail>
            <ion-grid no-padding>
              <ion-row no-padding>
                <ion-col no-padding class="team-name">
                  {{ matchBasic.awayId }}
                </ion-col>
                <ion-col no-padding width-20 class="team-score">
                  {{matchBasic.awayScore}}
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
        </ion-col>
        <ion-col class="matches-time">
          <div class="matches-time-wrapper">
            <ion-item>
              <p>{{ matchBasic.time }}</p>
            </ion-item>
            <ion-item>
              <button class="detail-button" text-center clear>Details</button>
            <!-->
              <button class="detail-button" text-center (click)="popupMatchResult(match,$event)" clear>{{'Details' | trans}}</button>
              <button class="update-button" *ngIf="(match.homeId | teamBasicPipe | async)?.captain === selfId ||
            (match.awayId | teamBasicPipe | async)?.captain === selfId ||
            (afTournamentAdmin | async)?.$value" text-center (click)="popupUpdateSchedulePage(match,$event)" clear>{{'Update' | trans}}</button>
            <-->
            </ion-item>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styleUrls: ['/app/matches/match-basic.component.scss']
})

export class SbMatchBasicComponent {
  @Input()
  matchBasic: MatchBasic;
}