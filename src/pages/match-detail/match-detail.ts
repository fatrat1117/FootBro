import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams, ModalController, Events, AlertController, Content } from 'ionic-angular';
import { Match } from '../../app/matches/match.model';
import { EditSquadPage } from '../edit-squad/edit-squad';
import { SharePage } from '../share/share';
import { PlayerService } from '../../app/players/player.service'
import { MatchService } from '../../app/matches/match.service'
import { TeamService } from '../../app/teams/team.service'
import { NewGamePage } from '../../pages/new-game/new-game'
import { EditGameRatingPage } from '../edit-game-rating/edit-game-rating';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Localization } from '../../providers/localization'

@Component({
  selector: 'page-match-detail',
  templateUrl: 'match-detail.html'
})
export class MatchDetailPage {
  @ViewChild(Content) matchDetailContent: Content;
  @ViewChild('pageHeader') pageHeader;

  map;
  match: Match;
  matchSegments = 'info';
  squadSettings: any;
  onMatchSquadReady;
  onMatchReady;
  squad;
  homeSquad;
  awaySquad;
  homePlayerStats = {};
  awayPlayerStats = {};
  allPlayersStats = {};
  statCategories = [];
  selectedStats;
  selectedCat;
  currPageName = "match-detail";
  mapClicked = false;
  attendances = [];
  absences = [];
  TBDs = [];
  matchId;

  constructor(private viewCtrl: ViewController,
    private modal: ModalController,
    navParams: NavParams,
    private playerService: PlayerService,
    private events: Events,
    private teamService: TeamService,
    private launchNavigator: LaunchNavigator,
    private alertCtrl: AlertController,
    private loc: Localization,
    private matchService: MatchService) {
    this.match = navParams.get('match');
    this.matchId = navParams.get('matchId');
    if (navParams.get('selectedValue'))
      this.matchSegments = navParams.get('selectedValue');
    this.squadSettings = {};
    if (this.match) {
      this.squadSettings.matchId = this.match.id;
      this.initialize();
    }
    else
      this.squadSettings.matchId = this.matchId;
  }

  initialize() {
    //only show captain's team
    if (this.playerService.isAuthenticated()) {
      if (this.playerService.amIMemberOfCurrentTeam(this.match.homeId)) {
        this.squadSettings.teamId = this.match.homeId;
      }
      else if (this.playerService.amIMemberOfCurrentTeam(this.match.awayId))
        this.squadSettings.teamId = this.match.awayId;
    }
    this.initializePlayerStats(this.homePlayerStats);
    this.initializePlayerStats(this.awayPlayerStats);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    if (this.match)
      this.addEventListeners();
    else {
      //if only match id is passed
      this.onMatchReady = e => {
        let matchId = e['detail'];
        if (matchId === this.matchId) {
          this.match = this.matchService.getMatch(matchId);
          this.initialize();
          this.addEventListeners();
        }
      }
      document.addEventListener('servicematchready', this.onMatchReady);
      this.matchService.getMatchAsync(this.matchId);
    }
  }

  addEventListeners() {
    this.onMatchSquadReady = (teamId, matchId) => {
      if (matchId === this.match.id) {
        if ('teamId' in this.squadSettings && teamId === this.squadSettings.teamId) {
          this.squad = this.teamService.getMatchSquad(teamId, matchId);
          this.updateEnrollPlayers();
        }

        if (teamId === this.match.homeId) {
          this.homeSquad = this.teamService.getMatchSquad(this.match.homeId, matchId);
          this.updatePlayerStats(this.homePlayerStats, this.homeSquad, this.match.home);
        }
        else if (teamId === this.match.awayId) {
          this.awaySquad = this.teamService.getMatchSquad(this.match.awayId, matchId);
          this.updatePlayerStats(this.awayPlayerStats, this.awaySquad, this.match.away);
        }
      }
    }

    this.events.subscribe('servicematchsquadready', this.onMatchSquadReady);
    this.teamService.getMatchSquadAsync(this.match.homeId, this.match.id);
    this.teamService.getMatchSquadAsync(this.match.awayId, this.match.id);
    this.squadSettings.offsetY = this.pageHeader.nativeElement.clientHeight;

    if ('players' === this.matchSegments) {
      setTimeout(() => {
        this.getCombinedStats();
      }, 1000);
    }
  }

  ionViewWillUnload() {
    if (this.onMatchSquadReady)
      this.events.unsubscribe('servicematchsquadready', this.onMatchSquadReady);

    if (this.onMatchReady)
      document.removeEventListener('servicematchready', this.onMatchReady);
  }

  initializePlayerStats(stats) {
    stats['goals'] = [];
    stats['assists'] = [];
    stats['redcards'] = [];
    stats['yellowcards'] = [];
    stats['owngoals'] = [];
    stats['rating'] = [];
  }

  updatePlayerStats(stats, squad, team) {
    stats['goals'] = [];
    stats['assists'] = [];
    stats['redcards'] = [];
    stats['yellowcards'] = [];
    stats['owngoals'] = [];
    stats['rating'] = [];

    if (squad) {
      if ('participants' in squad) {
        squad.participants.forEach(p => {
          if (p.goals) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.goals;
            stats['goals'].push(stat);
          }

          if (p.assists) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.assists;
            stats['assists'].push(stat);
          }

          if (p.redcards) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.redcards;
            stats['redcards'].push(stat);
          }

          if (p.yellowcards) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.yellowcards;
            stats['yellowcards'].push(stat);
          }

          if (p.owngoals) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(p.id);
            stat.teamName = team.name;
            stat.val = p.owngoals;
            stats['owngoals'].push(stat);
          }
        });
      }

      if ('ratings' in squad) {
        let playerRatingsMap: any = {};
        for (let key in squad.ratings) {
          let ratingObj = squad.ratings[key];
          for (let playerId in ratingObj) {
            let playerRating = ratingObj[playerId];
            //console.log(playerRating);
            playerRatingsMap[playerId] ? playerRatingsMap[playerId].push(playerRating) : playerRatingsMap[playerId] = [playerRating];
          }
        }

        for (let key in playerRatingsMap) {
          let playerRatings = playerRatingsMap[key];
          if (playerRatings.length) {
            let stat: any = {};
            stat.player = this.playerService.findOrCreatePlayerAndPull(key);
            stat.teamName = team.name;
            let sum = 0;
            playerRatings.forEach(r => {
              let tempR = Math.min(10, r);
              sum += tempR;
              //console.log(r, sum);
            })
            //console.log('calculate avg rating', sum, playerRatings.length);
            stat.val = (sum / playerRatings.length).toFixed(1);
            stats['rating'].push(stat);
          }
        }
        //console.log(playerRatingsMap);
      }
    }

    console.log(stats);
  }

  segmentChange(e) {
    //console.log(e);
    this.matchSegments = e;
    if ('info' === e) {
      //  this.showCurrentPositionInGoogleMap();
    }
    else if ('squad' === e) {
      // let self = this;
      // setTimeout(function() {
      //   console.log(self.squadCtrl);
      // }, 2000);
    }
    else if ('players' === e)
      this.getCombinedStats();

    this.matchDetailContent.resize();
  }

  canShowSquadSegment() {
    if (!this.playerService.isAuthenticated())
      return false;
    if (!this.match)
      return false;

    if (this.playerService.amIMemberOfCurrentTeam(this.match.homeId) ||
      this.playerService.amIMemberOfCurrentTeam(this.match.awayId)) {
      return true;
    }

    return false;
  }

  edit() {
    switch (this.matchSegments) {
      case 'info':
        this.goUpdateMatchPage();
        break;
      case 'squad':
        this.modal.create(EditSquadPage, { match: this.match, teamId: this.squadSettings.teamId }).present();
        break;
    }
  }

  isMatchEditable() {
    if (!this.match)
      return false;
    //updated by at least one captain, do not show
    if (this.match.isHomeUpdated || this.match.isAwayUpdated)
      return false;

    //captain can update matchInfo
    if (this.playerService.isCaptainOrAdmin(this.playerService.selfId(), this.match.homeId) ||
      this.playerService.isCaptainOrAdmin(this.playerService.selfId(), this.match.awayId))
      return true;
  }

  canShowDelete() {
    if (!this.playerService.isAuthenticated())
      return false;

    if (this.playerService.isAdmin())
      return true;

    return this.isMatchEditable();
  }

  canShowEdit() {
    if (!this.playerService.isAuthenticated())
      return false;

    switch (this.matchSegments) {
      case 'info':
        {
          return this.isMatchEditable();
        }
      //break;
      case 'squad':
        {
          //captain can update squad
          if (this.playerService.isCaptainOrAdmin(this.playerService.selfId(), this.match.homeId) ||
            this.playerService.isCaptainOrAdmin(this.playerService.selfId(), this.match.awayId))
            return true;
        }
        break;
      case 'players':
        {
          return false;
          //captain can update stats
          //if (this.squad)
          //  return true;
        }
      //break;
      // case 'rating':
      //   break;
    }

    return false;
  }

  goUpdateMatchPage() {
    // if (this.match.isStarted())
    //   this.modal.create(UpdateGamePage, { id: this.match.id, teamId: this.squadSettings.teamId }).present();
    // else
    this.modal.create(NewGamePage, { id: this.match.id }).present();
  }

  canShowPlayersSegment() {
    return true;
  }

  getCombinedStats() {
    this.statCategories.splice(0);
    for (let key in this.homePlayerStats) {
      let allStats = this.homePlayerStats[key].concat(this.awayPlayerStats[key]);
      //console.log(allStats);
      this.allPlayersStats[key] = allStats;
      if (allStats.length > 0)
        this.statCategories.push(key);
    }
    if (this.statCategories.length && !this.selectedCat) {
      this.selectedCat = this.statCategories[0];
      this.selectedStats = this.allPlayersStats[this.selectedCat];
    }
  }

  showStat(cat) {
    this.selectedCat = cat;
    this.selectedStats = this.allPlayersStats[cat];
  }

  navigateToField() {
    if (this.mapClicked)
      return;
    this.mapClicked = true;

    if (this.match.location.lat && this.match.location.lng) {
      let options: LaunchNavigatorOptions = {
        app: this.launchNavigator.APP.GOOGLE_MAPS
      };

      this.launchNavigator.navigate([this.match.location.lat, this.match.location.lng], options)
        .then(
        success => console.log('Launched navigator'),
        error => alert(error)
        );
    }

    setTimeout(() => {
      this.mapClicked = false;
    },
      3000);
  }

  doDeleteMatch() {
    this.matchService.deleteMatch(this.match.id);
    this.dismiss();
  }

  deleteMatch() {
    let confirm = this.alertCtrl.create({
      title: this.loc.getString('deletethismatch'),
      buttons: [
        {
          text: this.loc.getString('Cancel'),
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: this.loc.getString('delete'),
          handler: () => {
            this.doDeleteMatch();
          }
        }
      ]
    });
    confirm.present();
  }

  amIParticipants() {
    //console.log(this.squad);
    if (!this.squad)
      return false;

    if ('participants' in this.squad) {
      for (let i = 0; i < this.squad.participants.length; ++i) {
        let p = this.squad.participants[i];
        if (p.id === this.playerService.selfId()) {
          //console.log('equal');
          return true;
        }
      }
    }

    return false;
  }

  canShowRate() {
    if (!this.amIParticipants())
      return false;

    //rated?
    if (this.squad && this.squad.ratings && this.squad.ratings[this.playerService.selfId()])
      return false;

    return this.squad && this.squad.participantsConfirmed;
  }

  openRatePlayersPage() {
    let modal = this.modal.create(EditGameRatingPage, { squad: this.squad, teamId: this.squadSettings.teamId, matchId: this.match.id });
    modal.onDidDismiss(done => {
      if (done) {
        this.getCombinedStats();
      }
    });
    modal.present();
  }

  getMatchDetailScrollHeight() {
    return this.matchDetailContent.scrollHeight - this.pageHeader.nativeElement.clientHeight;
  }

  canShowEnroll() {
    if (!this.match)
      return false;
    return !this.match.isStarted() && this.playerService.amIMemberOfTeam(this.squadSettings.teamId);
  }

  amIMember() {
    if (!this.match)
      return false;
    return this.playerService.amIMemberOfTeam(this.squadSettings.teamId);
  }

  attendMatch() {
    this.matchService.attendMatch(this.squadSettings.teamId, this.match.id);
  }

  absentMatch() {
    this.matchService.absentMatch(this.squadSettings.teamId, this.match.id);
  }

  TBDMatch(teamId: string, matchId: string) {
    this.matchService.TBDMatch(this.squadSettings.teamId, this.match.id);
  }

  updateEnrollPlayers() {
    if (this.squad && this.squad.attendance) {
      this.attendances.splice(0);
      this.absences.splice(0);
      this.TBDs.splice(0);

      for (let playerId in this.squad.attendance) {
        let playerEnrollInfo = this.squad.attendance[playerId];
        switch (playerEnrollInfo) {
          case 0:
            this.absences.push(this.playerService.findOrCreatePlayerAndPull(playerId));
            break;
          case 1:
            this.attendances.push(this.playerService.findOrCreatePlayerAndPull(playerId));
            break;
          case 2:
            this.TBDs.push(this.playerService.findOrCreatePlayerAndPull(playerId));
            break;
        }
      }
    }
  }

  getDisabled(stat) {
    if (this.squad && this.squad.attendance && stat === this.squad.attendance[this.playerService.selfId()])
      return true;

    return false;
  }
}
