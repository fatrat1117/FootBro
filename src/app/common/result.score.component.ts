import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Match } from '../../app/matches/match.model'
import { PlayerService } from '../../app/players/player.service';
import { UpdateGamePage } from '../../pages/update-game/update-game';
import { OneSignalManager } from '../../providers/onesignal-manager'
import * as moment from 'moment';
declare var sprintf: any;

@Component({
  selector: 'result-score',
  template: `
    <button disabled ion-button class="game-time" ngClass="{{hostPageName}}">
      {{upcomingMatch?.time | date:'yyyy-MM-dd h:mma'}}
    </button>
  <!--对战信息-->
  <ion-row class="game-info" ngClass="{{hostPageName}}" center justify-content-center>
    <!--左边队伍信息-->
    <ion-col text-center width-33>
      <img [src]="upcomingMatch?.home?.logo" class="team-logo">
      <!--p class="team-left-text">{{match?.home?.name}}</p-->
    </ion-col>
    <!--中间比分-->
    <ion-col width-33 class="game-score">
      <ion-row *ngIf="canShowScores()" center justify-content-center>
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
      <ion-row *ngIf="canShowInputScores()" center justify-content-center>
      <button ion-button color="gYellow" class="input-score" (click)="openUpdateMatchPage($event)">{{'inputscores' | trans}}
      </button>
      </ion-row>
      <ion-row *ngIf="!canShowScores() && !canShowInputScores()">
          <ion-label *ngIf="!canShowInformAll()" no-margin>{{versusLabel | trans}}</ion-label>
          <div *ngIf="canShowInformAll()" full color="dark" class="group-message flex-direction-column"
             (click)="informAllClick($event)" >
             <ion-icon name="md-megaphone" class="inline-flex-center"></ion-icon>
            <p class="inline-flex-center">{{'informAll' | trans}}</p>
          </div>
      </ion-row>
    </ion-col>
    <!--右边队伍信息-->
    <ion-col text-center width-33>
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
  @Input() upcomingMatch: Match;
  @Input() hostPageName: String;
  versusLabel = "versus";

  constructor(private playerService: PlayerService,
    private modal: ModalController, private osm: OneSignalManager) {

  }
  informAllClick(e){
    //alert("Cheers!Love, the cavalry is here!");
    let enMsg = sprintf('A new match is waiting for you to join: %s vs %s',
      this.upcomingMatch.home.name,
      this.upcomingMatch.away.name,
    );

    let chMsg = sprintf('一场新球赛等待你的加入: %s vs %s',
      this.upcomingMatch.home.name,
      this.upcomingMatch.away.name,
    );
    this.osm.matchNotification_team('joinMatch', this.playerService.myself().teamId, this.upcomingMatch.id, enMsg, chMsg);
    e.stopPropagation();
    e.preventDefault();
  }
  //调用此函数之前必须检查比赛是否开始，比赛还没开始才能调用!
  canShowInformAll(){
    if (this.upcomingMatch && !this.upcomingMatch.isStarted()){
      //already informed
      if (this.upcomingMatch.informed && this.upcomingMatch.informed[this.playerService.myself().teamId])
        return false;
      if ((this.playerService.amICaptainOrAdmin(this.upcomingMatch.homeId) ||
        this.playerService.amICaptainOrAdmin(this.upcomingMatch.awayId))){
        return true;
      }else{
        return false;
      }
    }
    return false;
  }

  canShowScores() {
    if (!this.upcomingMatch)
      return false;
    //console.log(this.upcomingMatch);

    if ('homeScore' in this.upcomingMatch
      && 'awayScore' in this.upcomingMatch &&
      this.upcomingMatch.homeScore >= 0 &&
      this.upcomingMatch.awayScore >= 0)
      return true;

    return false;
  }

  canShowInputScores() {
    if (!this.playerService.isAuthenticated())
      return false;

    if (!this.upcomingMatch)
      return false;

    //only input matches after April 2
    //console.log(this.upcomingMatch, this.upcomingMatch.isStarted(), this.playerService.selfId());
    let april2 = moment("20170402", "YYYYMMDD").unix() * 1000;
    if (this.upcomingMatch.date < april2)
      return false;

    if (this.upcomingMatch.isStarted() &&
      ((this.playerService.amIMemberCaptainOrAdmin(this.upcomingMatch.homeId) && !this.upcomingMatch.isHomeUpdated)
        || (this.playerService.amIMemberCaptainOrAdmin(this.upcomingMatch.awayId) && !this.upcomingMatch.isAwayUpdated))
    ) {
      return true;
    }

    //If I am tournament admin
    return this.upcomingMatch.isStarted() && this.amITournamentAdmin();
  }

  amITournamentAdmin() {
    if (this.upcomingMatch.tournamentId != null && this.playerService.amITournamentAdmin(this.upcomingMatch.tournamentId))
      return true;

    return false;
  }

  openUpdateMatchPage(e) {
    //console.log('openUpdateMatchPage', e);
    e.stopPropagation();
    e.preventDefault();
    //let teamId = this.playerService.isCaptain(this.playerService.selfId(), this.upcomingMatch.homeId) ? this.upcomingMatch.homeId : this.upcomingMatch.awayId;
    if (this.playerService.myself().teamId === this.upcomingMatch.homeId ||
      this.playerService.myself().teamId === this.upcomingMatch.awayId)
      this.modal.create(UpdateGamePage, { id: this.upcomingMatch.id, teamId: this.playerService.myself().teamId }).present();
    else if (this.amITournamentAdmin())
      this.modal.create(UpdateGamePage, { id: this.upcomingMatch.id, 
        teamId: this.playerService.myself().teamId,
      adminMode: true }).present();
  }
}
