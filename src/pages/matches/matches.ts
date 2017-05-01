import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ModalController, NavParams } from 'ionic-angular';
import { Match } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'
import { PlayerService } from '../../app/players/player.service'
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
  onMatchesChanged;
  isEnd = false;
  title = "schedule";
  rules = "";
  type = "";

  // eliminations
  onEliminationReady;
  onMatchReady;
  selectedGroup = 0;
  //groups = [0, 0, 0, 0];
  selectedElimination = 0;
  eliminations: any;
  eliminationPairs = [];
  eliminationMatches = {};
  tournament;

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private matchService: MatchService,
    private navParams: NavParams,
    private playerService: PlayerService) {
    this.selectedInfo = "schedule";
    this.selectedId = this.navParams.get('tournamentId') || "all";
    this.tournament = this.navParams.get('tournament');
    if (this.tournament && this.tournament.groups && this.tournament.groups.length)
      this.selectedGroup = this.tournament.groups[0];
  }

  ionViewDidLoad() {
    this.eliminationPairs = [];
    this.today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;
    this.addEventListeners();
    if (this.navParams.get('tournamentId')) {
      this.matchService.getTournamentTableAsync(this.selectedId);
    }
    if (this.navParams.get('status') == 'end') {
      this.selectedInfo = "standings";
      this.isEnd = true;
      this.title = "results";
    }

    if (this.navParams.get("rules")) {
      this.rules = this.navParams.get("rules");
    }

    if (this.navParams.get("type")) {
      this.type = this.navParams.get("type");
      if (this.type == 'cup') {
        this.matchService.getEliminationsAsync(this.selectedId);
      }
    }

    this.matchService.getMatchDatesAsync(this.selectedId);
  }

  getMatchScrollHeight() {
    return this.matchContent.scrollHeight - this.matchHeader.nativeElement.clientHeight;
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
        let scrollableItem = scrollableDiv.getElementsByTagName("ion-item");

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

    this.onTournamentTableReady = e => {
      let tournamentId = e['detail'];
      if (tournamentId === this.selectedId)
        //console.log(tournamentId);
        this.matchStandings = this.matchService.getTournamentTable(tournamentId);
      //console.log(this.matchStandings);
    };

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
    if (this.type) 
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
    // console.log();
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
    if (this.eliminationPairs.length == 0 && ev == 'eliminations')
      this.onEliminationChange(0);
  }
}
