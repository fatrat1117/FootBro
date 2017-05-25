import { Component, ElementRef } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
import { Localization } from '../../providers/localization';
// import { LocalStorage } from '../../providers/local-storage';
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
import { MatchService } from '../../app/matches/match.service'
import { TeamPlayersPage } from '../team-players/team-players'
import { SearchMatchPage } from '../search-match/search-match'
import { MatchDetailPage } from '../match-detail/match-detail'
declare var sprintf: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  slides: any[];
  selfPlayer: Player;
  selfTeam: Team;
  showLogin: boolean;
  showBanner = false;
  showJoinTeam: boolean;
  upcomingMatch;
  matches;
  onPlayerReady;
  onTeamReady;
  onTeamMatchesReady;

  constructor(public navCtrl: NavController, private local: Localization, private elRef: ElementRef, public modalCtrl: ModalController,
    private playerService: PlayerService, private teamService: TeamService, private alertCtrl: AlertController,
    private matchService: MatchService) {
    this.slides = [];
    //this.loadSlides(local.langCode, 4);
    this.loadSlides(local.langCode, 2);
    this.selfPlayer = null;
    this.selfTeam = null;
    this.showLogin = false;
    this.showJoinTeam = false;
  }

  ionViewDidLoad() {
    document.addEventListener('userlogin', e => {
      document.addEventListener('serviceplayerready', this.onPlayerReady);
      document.addEventListener('serviceteamready', this.onTeamReady);
      document.addEventListener('serviceteammatchesready', this.onTeamMatchesReady);
      this.showLogin = false;
      this.playerService.getPlayerAsync(this.playerService.selfId());
    });

    document.addEventListener('userlogout', e => {
      this.showLogin = true;
      this.showBanner = false;
      this.selfPlayer = null;
      this.selfTeam = null;
      document.removeEventListener('serviceteamready', this.onTeamReady);
      document.removeEventListener('serviceplayerready', this.onPlayerReady);
      document.removeEventListener('serviceteammatchesready', this.onTeamMatchesReady);
    });

    this.onTeamReady = e => {
      let teamId = e['detail'];
      if (this.playerService.myself() && this.playerService.myself().teamId === teamId) {
        this.selfTeam = this.teamService.getTeam(e['detail']);
      }
    }

    this.onTeamMatchesReady = e => {
      let teamId = e['detail'];
      if (this.playerService.myself() && this.playerService.myself().teamId === teamId) {
        this.matches = this.matchService.getTeamMatches(teamId);
        this.upcomingMatch = this.matchService.getUpcomingMatch(teamId);
        //console.log('onTeamMatchesReady', this.upcomingMatch);
      }
    };

    this.onPlayerReady = e => {
      if (this.playerService.selfId() && e['detail'] == this.playerService.selfId()) {
        this.selfPlayer = this.playerService.getPlayer(e['detail']);
        if ("cheerleader" === this.selfPlayer.role) 
          this.showBanner = true;

        if (this.selfPlayer.teamId) {
          this.teamService.getTeamAsync(this.selfPlayer.teamId);
          this.matchService.getTeamMatchesAsync(this.selfPlayer.teamId);
          this.showJoinTeam = false;
        }
        else {
          this.showJoinTeam = true;
        }
      }
    };
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

  openModal(characterNum: number) {

    let modal = this.modalCtrl.create(ModalContentPage, characterNum);
    modal.present();
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
        this.alertCtrl.create({
          title: sprintf(this.local.getString("confirmJoinTeam"), data.team.name),
          buttons: [
            {
              text: this.local.getString('Cancel'),
              handler: () => {
              }
            },
            {
              text: this.local.getString('OK'),
              handler: () => {
                this.teamService.joinTeam(data.team.id, true);
              }
            }]
        }).present();
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
        this.navCtrl.push(ManageSquadPage, { teamId: this.selfTeam.id });
      else
        this.joinTeam();
    } else
      this.playerService.checkLogin();
  }

  amIPlayer() {
    //all guest should see
    if (!this.playerService.isAuthenticated())
      return true;
    return this.playerService.amIPlayer();
  }

  canShowMainPageBanner() {
    var isCurrentLoggedIn = this.playerService.isAuthenticated();
    if (!isCurrentLoggedIn) {
      return true;
    } else {
      if (this.selfPlayer && !this.selfPlayer.teamId) {
        return true;
      } else {
        return false;
      }
    }
  }

  openTeamPlayersPage() {
    this.navCtrl.push(TeamPlayersPage, { teamId: this.selfTeam.id });
  }

  canShowBanner() {
    if (this.playerService.isAuthenticated() && this.playerService.myself() && this.playerService.myself().teamId && this.upcomingMatch)
      return false;

    return true;
  }

  seeMoreTeamGamePlan() {
    this.navCtrl.push(SearchMatchPage, { matches: this.matches, showDate: true });
  }

  showMatch(match) {
    if (match) {
      this.modalCtrl.create(MatchDetailPage, { match: match }).present();
    }
  }
}

