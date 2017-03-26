import {Component,ElementRef} from '@angular/core';
import {NavController, ModalController, NavParams, ViewController, Platform} from 'ionic-angular';
import {Localization} from '../../providers/localization';
import {CheeringTeamPage} from '../cheering-team/cheering-team';
import {RankPage} from '../rank/rank';
import {GameSchedulePage} from "../game-schedule/game-schedule";
import {ModalContentPage} from "../home/place-selection";
import {GameRatingPage} from "../game-rating/game-rating";
import { MatchesPage } from '../matches/matches';

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  slides: any[];
  items = ["item1","item2","item3"];
  selfPlayer: Player;
  selfTeam: Team;
  onPlayerReady;
  onTeamReady;

  constructor(public navCtrl: NavController, local: Localization,private elRef: ElementRef, public modalCtrl: ModalController, 
              private playerService: PlayerService, private teamService: TeamService) {
    this.slides = [];
    //this.loadSlides(local.langCode, 4);
    this.loadSlides(local.langCode, 1);
    this.selfPlayer = null;
    this.selfTeam = null;
  }

  ionViewDidLoad() {
    document.addEventListener('userlogin', e => {
      this.playerService.getPlayerAsync(this.playerService.selfId());
      document.addEventListener('serviceplayerready', this.onPlayerReady);
    });

    document.addEventListener('userlogout', e => {
      this.selfPlayer = null;
      this.selfTeam = null
      document.removeEventListener('serviceteamready', this.onTeamReady);
      document.removeEventListener('serviceplayerready', this.onPlayerReady);
    });

    this.onPlayerReady = e => {
      if (this.playerService.selfId() && e['detail'] == this.playerService.selfId()) {
        this.selfPlayer = this.playerService.getPlayer(e['detail']);
        this.teamService.getTeamAsync(this.selfPlayer.teamId);
        document.addEventListener('serviceteamready', this.onTeamReady);
      }
    };

    this.onTeamReady = e => {
      if (this.selfPlayer.teamId && e['detail'] == this.selfPlayer.teamId) {
        this.selfTeam = this.teamService.getTeam(e['detail']);
      }
    }
  }

  loadSlides(langCode: string, total: number) {
    for (let i = 0; i < total; ++i) {
      this.slides.push({
        image: `assets/img/banners/${langCode}/${i}.jpg`
      });
    }
  }

  goLeaguePage() {
    this.modalCtrl.create(GameRatingPage).present();
   // this.navCtrl.push(GameRatingPage);
  }

  enterStandings() {
    return;
  }

  enterCheeringTeam(){
    this.navCtrl.push(CheeringTeamPage);
  }

  enterRankPage(){
    this.navCtrl.push(RankPage);
  }

  enterGameSchedule(){
    this.navCtrl.push(GameSchedulePage);
  }

  selectItems(item:string){
    console.log("Selected Item", item);
  }

  openModal(characterNum:number) {

    let modal = this.modalCtrl.create(ModalContentPage, characterNum);
    modal.present();
    // alert("123");
  }

  testSquad() {
    this.navCtrl.push(MatchesPage);
  }
}

