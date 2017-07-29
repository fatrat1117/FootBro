import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ModalController, NavParams } from 'ionic-angular';
import { Match } from '../../app/matches/match.model';
import { MatchService } from '../../app/matches/match.service';
import { PlayerService } from '../../app/players/player.service';
import { TeamService } from '../../app/teams/team.service';
import { NewGamePage } from "../new-game/new-game";
import { MatchRulesPage } from "./match-rules"
import * as moment from 'moment';

@Component({
  selector: 'page-matches',
  templateUrl: 'matches.html'
})

export class MatchesPage {
  @ViewChild(Content) matchContent: Content;
  @ViewChild('matchHeader') matchHeader;
  @ViewChild('matchFooter') matchFooter;

  dates: number[];
  selectedDate: number;
  matches;
  matchStandings;
  today;
  selectedInfo: string;
  selectedId: string;
  //afTournamentList;
  //Key: year : String eg: 2014, 2017...
  //Value: selectedDate'index in dates : Number eg: 0 , 5 , 27....
  years = {};
  onMatchDatesReady;
  onMatchesByDateReady;
  onTournamentTableReady;
  onPlayerReady;
  onMatchesChanged;
  isEnd = false;
  title = "schedule";
  rules = "";
  type = "";



  //players
  statCategories = ['goals', 'assists'];//Goals, Assists
  selectedCat = this.statCategories[0];
  selectedStats = [];
  allPlayersStats = {}; //allPlayersStats['goals']  allPlayersStats['assists']

  // eliminations
  onEliminationReady;
  onMatchReady;
  selectedGroup;
  //groups = [0, 0, 0, 0];
  selectedElimination = 0;
  eliminations: any;
  eliminationPairs = [];
  eliminationMatches = {};
  tournament;
  standingTitle = 'standings';
  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private matchService: MatchService,
    private navParams: NavParams,
    private playerService: PlayerService,
    private teamService: TeamService) {
    this.selectedInfo = "schedule";
    this.selectedId = this.navParams.get('tournamentId') || "all";
    this.tournament = this.navParams.get('tournament');
    this.type = this.navParams.get("type") || 'league';
    this.allPlayersStats['goals'] = [];
    this.allPlayersStats['assists'] = [];

    if (this.tournament) {
      if (this.tournament.groups && this.tournament.groups.length)
        this.selectedGroup = this.tournament.groups[0];
      if (this.tournament.type)
        this.type = this.tournament.type;
    }
  }

  ionViewDidLoad() {
    this.eliminationPairs = [];
    this.today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;
    this.addEventListeners();
    if (this.navParams.get('tournamentId')) {
      this.refreshTournamentTable();
    }
    if (this.navParams.get('status') == 'end') {
      this.selectedInfo = "standings";
      this.isEnd = true;
      this.title = "results";
      this.refreshTournamentTable();
    }

    if (this.navParams.get("rules")) {
      this.rules = this.navParams.get("rules");
    }

    if (this.type == 'cup') {
      this.standingTitle = 'groups';
      this.matchService.getEliminationsAsync(this.selectedId);
    }

    this.matchService.getMatchDatesAsync(this.selectedId);
  }

  refreshTournamentTable() {
    if (this.type == 'cup') {
      if (!this.selectedGroup)
        this.selectedGroup = 'A';
    }
    //console.log('refreshTournamentTable', this.type, this.selectedGroup);

    let groupId = 'cup' == this.type ? this.selectedGroup : null;
    this.matchStandings = this.matchService.getTournamentTable(this.selectedId, groupId);
    //console.log(this.matchStandings);
  }

  getMatchScrollHeight() {
    return this.matchContent.scrollHeight - this.matchHeader.nativeElement.clientHeight;
  }

  getContentHeight() {
    //console.log(this.getMatchScrollHeight() - this.matchFooter.nativeElement.clientHeight);

    return this.getMatchScrollHeight() - this.matchFooter.nativeElement.clientHeight;
  }

  scrollToDate(date) {
    let selectedFormatDate = moment(date).format("YYYY-MM-DD");
    let cToday = -1;
    if (this.dates.length > 0)
      cToday = 0;
    for (let i = 0; i < this.dates.length; ++i) {
      let currFormattedDate = moment(this.dates[i]).format("YYYY-MM-DD");
      if (currFormattedDate >= selectedFormatDate) {
        cToday = i;
      } else {
        break;
      }
    }
    if (cToday != -1) {
      let closeToToday = this.dates[cToday];
      this.showMatches(closeToToday, cToday);
      let scrollableDiv = document.getElementById("sketchElement");

      if (scrollableDiv) {
        scrollableDiv.scrollTop = 0;
        let scrollableItem = scrollableDiv.getElementsByTagName("button");

        if (scrollableItem.length > 0) {
          scrollableDiv.scrollTop += scrollableItem[0].clientHeight * cToday;
        }
      }
    }
  }

  scrollToToday() {
    this.scrollToDate(this.today);
  }

  addEventListeners() {
    this.onMatchDatesReady = e => {
      let id = e['detail'];
      if (this.selectedId === id) {
        this.dates = this.matchService.getMatchDates(id);
        //console.log(this.dates);
        if (!this.selectedDate) {
          let self = this;
          setTimeout(() => {
            self.scrollToToday();
            self.addYears();
          },
            1000);
        }
      }
    }

    this.onMatchesByDateReady = e => {
      let date = e['detail'];
      if (this.selectedDate === date)
        this.matches = this.matchService.getMatchesByDate(date);
    }

    // this.onTournamentTableReady = e => {
    //   let tournamentId = e['detail'];
    //   if (tournamentId === this.selectedId)
    //     //console.log(tournamentId);
    //     this.matchStandings = this.matchService.getTournamentTable(tournamentId);
    //   //console.log(this.matchStandings);
    // };

    this.onMatchesChanged = e => {
      let date = e['detail'];
      //if (date == this.selectedDate)
      this.scrollToDate(date);
    };

    this.onEliminationReady = e => {
      let id = e['detail'];
      if (id == this.selectedId) {
        this.eliminationMatches = {};
        this.eliminations = this.matchService.getEliminations(id);
        this.eliminations.forEach(el => {
          for (let id of el.matches) {
            this.eliminationMatches[id] = {};
            this.matchService.getMatchAsync(id);
          }
        });
      }
    }

    this.onMatchReady = e => {
      let id = e['detail'];
      if (this.eliminationMatches[id])
        this.eliminationMatches[id] = this.matchService.getMatch(id);
    }


    document.addEventListener('matchdatesready', this.onMatchDatesReady);
    document.addEventListener('matchesbydateready', this.onMatchesByDateReady);
    document.addEventListener('servicetournamenttableready', this.onTournamentTableReady);
    document.addEventListener('matcheschanged', this.onMatchesChanged);
    document.addEventListener('servicematchready', this.onMatchReady);
    document.addEventListener('serviceeliminationsready', this.onEliminationReady);
  }

  ionViewWillUnload() {
    document.removeEventListener('matchdatesready', this.onMatchDatesReady);
    document.removeEventListener('matchesbydateready', this.onMatchesByDateReady);
    document.removeEventListener('servicetournamenttableready', this.onTournamentTableReady);
    document.removeEventListener('matcheschanged', this.onMatchesChanged);
    document.removeEventListener('servicematchready', this.onMatchReady);
    document.removeEventListener('serviceeliminationsready', this.onEliminationReady);
  }

  addYears() {
    this.addDateToYearDictionary();
    setTimeout(this.addYearCss(), 3000);
  }

  addDateToYearDictionary() {
    for (let i = 0; i < this.dates.length; i++) {
      let currentYear = this.getYearStringFromDate(this.dates[i]);
      if (!(currentYear in this.years)) {
        this.years[currentYear] = i;
      }
    }
  }

  addYearCss() {
    let extraHeight = 0;
    for (let key in this.years) {
      let item_id = this.years[key];
      let item = document.getElementById("matches-scroll-target-" + String(item_id));
      if (item != null) {
        item.className += " ion-item-changeYear";
        extraHeight = item.clientHeight * 0.5;
      }
    }

    setTimeout(this.reScrolling(extraHeight), 3000);

  }

  reScrolling(extraHeight) {

    let scrollableDiv = document.getElementById("sketchElement");
    if (scrollableDiv) {
      let currentYear = this.getYearStringFromDate(this.selectedDate);
      let currentIndex = this.getIndexFromDates(this.selectedDate);
      let isLastDayOfYear = false;
      let extraCount = 0;
      for (let key in this.years) {
        if (parseInt(key) >= parseInt(currentYear)) {
          extraCount++;
        }
        if (currentIndex == this.years[key]) {
          isLastDayOfYear = true;
        }
      }
      if (isLastDayOfYear) {
        if (extraCount > 0) {
          extraCount -= 1;
        }
      }
      scrollableDiv.scrollTop += extraHeight * extraCount;
    }
  }

  getIndexFromDates(currentDate) {
    let result = 0;
    for (let i = 0; i < this.dates.length; i++) {
      if (currentDate == this.dates[i]) {
        result = i;
      }
    }
    return result;
  }


  showMatches(date, index) {
    //console.log('showMatches', date, index);
    this.selectedDate = date;
    this.matchService.getMatchesByDateAsync(date, this.selectedId);
  }

  /*
  onSelectionChange() {
    this.selectedDate = null;
    if (this.selectedId == "all") {
      this.selectedInfo = "schedule";
      this.matchService.getMatchDatesAsync("all");
    } else {
      this.matchService.getMatchDatesAsync(this.selectedId);
      this.matchService.getTournamentTableAsync(this.selectedId);
    }
  }
  */

  enterNewGame() {
    let options = { tournamentId: 'all' === this.selectedId ? null : this.selectedId };
    //only groups schedule has groupId
    if (this.type == "cup" && this.selectedInfo == 'standings')
      options['groupId'] = this.selectedGroup;
    console.log('newGame', options);
    let modal = this.modalCtrl.create(NewGamePage,
      options);
    modal.onDidDismiss(e => {
      if (e && e['date']) {
        let date = e['date'];
        this.scrollToDate(date);
      }
    })
    modal.present();
  }

  isChangeYear(index) {

    for (let key in this.years) {
      if (index == this.years[key]) {
        return true;
      }
    }
    return false;
  }

  getYearStringFromDate(date) {
    let t = Number(date);
    let year = moment(t).format('YYYY');
    return year;
  }

  addDateSelectNgClass(i, date) {
    let class1 = this.selectedDate == date ? "ion-item-selected" : "ion-item-unselected";
    //let class2 = this.isChangeYear(i, date) == true ? "ion-item-changeYear" : "ion-item-unchangeYear"

    return class1;
  }

  canAddTournamentMatch() {
    if (this.playerService.amITournamentAdmin(this.selectedId))
      return true;

    //captain or admin of tournament team
    if (this.playerService.amICaptainOrAdminOfCurrentTeam() &&
      this.playerService.isMyteamInTournament(this.playerService.myself().teamId, this.selectedId))
      return true;

    return false;
  }

  canShowAdd() {
    if (!this.playerService.isAuthenticated())
      return false;
    if (this.isEnd)
      return false;
    if ('all' === this.selectedId)
      return this.playerService.amICaptainOrAdminOfCurrentTeam();
    else
      return this.canAddTournamentMatch();
  }

  showRules() {
    this.modalCtrl.create(MatchRulesPage, {
      rules: this.rules
    }).present();
  }

  getEliminationTitle(name: string) {
    // localization here
    if (name)
      return name;

    return "";
  }

  getSelectedMatches() {
    return this.eliminations[this.selectedElimination].matches;
  }

  getSelectedNextName() {
    return this.getEliminationTitle(this.eliminations[this.selectedElimination].nextName);
  }

  onEliminationChange(ev) {
    this.eliminationPairs = [];
    let ms = this.eliminations[ev].matches;

    let pair = [];
    for (let i = 0; i < ms.length; ++i) {
      pair.push(this.eliminationMatches[ms[i]]);
      if (i % 2 == 1) {
        this.eliminationPairs.push(pair);
        pair = [];
      }
    }
    if (pair.length != 0)
      this.eliminationPairs.push(pair);
  }

  onSegmentChange(ev) {
    this.selectedInfo = ev;
    switch (ev) {
      case "standings": {
        this.refreshTournamentTable();
      }
        break;
      case 'eliminations':
        {
          if (this.eliminationPairs.length == 0)
            this.onEliminationChange(0);;
        }
        break;
      case 'players':
        this.getCombinedStats();
        break;
    }
  }

  canShowComputeTable() {
    if ('all' === this.selectedId)
      return false;
    if (this.type != "cup")
      return false;
    return this.playerService.amITournamentAdmin(this.selectedId);
  }

  canShowPlayersSegment() {
    return true;
  }

  computeTournamentTable() {
    this.matchService.computeTournamentTable(this.selectedId);
  }

  onSelectedGroupChange(e) {
    this.selectedGroup = e;
    this.refreshTournamentTable();
  }

  getMatchDetailScrollHeight() {
    return this.matchContent.scrollHeight - this.matchHeader.nativeElement.clientHeight;
  }

  // initializePlayerStats(stats) {
  //   stats['goals'] = [];
  //   stats['assists'] = [];
  // }

  showStat(cat) {
    this.selectedCat = cat;
    this.selectedStats = this.allPlayersStats[cat];
  }


  sortStatsObjCompare(b, a) {
    if (a.val < b.val)
      return -1;
    if (a.val > b.val)
      return 1;
    return 0;
  }


  getBinaryInsertSortingFromHighToLowIndex(target, val) {
    if (!target || target.length <= 0) {
      return 0;
    }

    if (target.length == 1) {
      if (val > target[0].val) {
        return 0;
      } else if (val < target[0].val) {
        return 1;
      } else {
        return 0;
      }
    }



    var targetLength = target.length;
    var hIndex = targetLength - 1;
    var lIndex = 0;

    var mid = Math.floor((hIndex + lIndex) / 2);

    while (hIndex > lIndex) {
      if (val > target[mid].val) {
        hIndex = mid - 1;
        mid = Math.floor((hIndex + lIndex) / 2);
      } else if (val < target[mid].val) {
        lIndex = mid + 1;
        mid = Math.floor((hIndex + lIndex) / 2);
      } else {
        return mid;
      }
    }

    return mid;

  }

  updatePlayerStats(stats) {

    stats['goals'] = [];
    stats['assists'] = [];
    var goals = this.tournament.goals;
    var assists = this.tournament.assists;

    //console.log('updatePlayerStats', squad);
    if (goals) {

      for (var goalKey in goals) {
        if (goals[goalKey]['number'] > 0) {
          var newGoalObj = {
            player: this.playerService.findOrCreatePlayerAndPull(goalKey),
            val: goals[goalKey]['number'],
            team: this.teamService.findOrCreateTeamAndPull(goals[goalKey]['teamID'])
          };
          stats['goals'].push(newGoalObj);
        }
      }
      //sort
      stats['goals'].sort(this.sortStatsObjCompare);
    }

    if (assists) {

      for (var assistKey in assists) {
        if (assists[assistKey]['number'] > 0) {
          var newAssistObj = {
            player: this.playerService.findOrCreatePlayerAndPull(assistKey),
            val: assists[assistKey]['number'],
            team: this.teamService.findOrCreateTeamAndPull(assists[assistKey]['teamID'])
          };
          stats['assists'].push(newAssistObj);
        }
      }
      stats['assists'].sort(this.sortStatsObjCompare);
    }

    this.selectedCat = this.statCategories[0];
    this.selectedStats = this.allPlayersStats[this.selectedCat];
  }
  //invoke when load
  getCombinedStats() {
    this.updatePlayerStats(this.allPlayersStats);
  }
}
