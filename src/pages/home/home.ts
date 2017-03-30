import { Component, ElementRef } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Localization } from '../../providers/localization';
import { CheeringTeamPage } from '../cheering-team/cheering-team';
import { RankPage } from '../rank/rank';
import { GameSchedulePage } from "../game-schedule/game-schedule";
import { ModalContentPage } from "../home/place-selection";
import { GameRatingPage } from "../game-rating/game-rating";
import { MatchesPage } from '../matches/matches';
import { MyPlayerPage } from "../my-player/my-player";
import { MyTeamPage } from "../my-team/my-team";
import { SearchTeamPage } from '../search-team/search-team'
import { ManageSquadPage } from '../manage-squad/manage-squad';
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
  items = ["item1", "item2", "item3"];
  selfPlayer: Player;
  selfTeam: Team;
  showLogin: boolean;
  showJoinTeam: boolean;
  onPlayerReady;
  onTeamReady;

  constructor(public navCtrl: NavController, local: Localization, private elRef: ElementRef, public modalCtrl: ModalController,
    private playerService: PlayerService, private teamService: TeamService) {
    this.slides = [];
    //this.loadSlides(local.langCode, 4);
    this.loadSlides(local.langCode, 1);
    this.selfPlayer = null;
    this.selfTeam = null;
    this.showLogin = false;
    this.showJoinTeam = false;
  }

  ionViewDidLoad() {
    document.addEventListener('userlogin', e => {
      document.addEventListener('serviceplayerready', this.onPlayerReady);
      this.showLogin = false;
      this.playerService.getPlayerAsync(this.playerService.selfId());
    });

    document.addEventListener('userlogout', e => {
      this.showLogin = true;
      this.selfPlayer = null;
      this.selfTeam = null
      document.removeEventListener('serviceteamready', this.onTeamReady);
      document.removeEventListener('serviceplayerready', this.onPlayerReady);
    });

    this.onPlayerReady = e => {
      if (this.playerService.selfId() && e['detail'] == this.playerService.selfId()) {
        this.selfPlayer = this.playerService.getPlayer(e['detail']);
        //console.log(this.selfPlayer);

        if (this.selfPlayer.teamId) {
          document.addEventListener('serviceteamready', this.onTeamReady);
          this.teamService.getTeamAsync(this.selfPlayer.teamId);
          this.showJoinTeam = false;
        }
        else {
          this.showJoinTeam = true;
        }
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

  enterCheeringTeam() {
    this.navCtrl.push(CheeringTeamPage);
  }

  enterRankPage() {
    this.navCtrl.push(RankPage);
  }

  enterGameSchedule() {
    this.navCtrl.push(GameSchedulePage);
  }

  selectItems(item: string) {
    console.log("Selected Item", item);
  }

  openModal(characterNum: number) {

    let modal = this.modalCtrl.create(ModalContentPage, characterNum);
    modal.present();
    // alert("123");
  }

  testSquad() {
    this.navCtrl.push(MatchesPage);
  }

  goPlayerPage() {
    this.navCtrl.push(MyPlayerPage, { id: this.selfPlayer.id });
  }

  goTeamPage() {
    this.navCtrl.push(MyTeamPage, { id: this.selfPlayer.teamId });
  }

  joinTeam() {
    let searchTeamModal = this.modalCtrl.create(SearchTeamPage);
    searchTeamModal.onDidDismiss(data => {
      if (data) {
        this.teamService.joinTeam(data.team.id, true);
      }
    });
    searchTeamModal.present();
  }

  login() {
    this.playerService.checkLogin();
  }

  enterManageSquadPage() {
    if (this.playerService.isAuthenticated()) {
      if (this.selfTeam)
        this.navCtrl.push(ManageSquadPage, { });
      else 
        this.joinTeam();
    } else 
      this.playerService.checkLogin();
  }
}

