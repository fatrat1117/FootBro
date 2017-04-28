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

  dates: number[];
  selectedDate: number;
  matches;
  matchStandings;
  today;
  selectedInfo: string;
  selectedId: string;
  afTournamentList;
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

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private matchService: MatchService,
    private navParams: NavParams,
    private playerService: PlayerService) {
    this.selectedInfo = "schedule";
    this.selectedId = "all";
    this.afTournamentList = this.matchService.afTournamentList();
  }

  ionViewDidLoad() {
    this.today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;
    this.addEventListeners();
    if (this.navParams.get('id')) {
      this.selectedId = this.navParams.get('id');
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

    document.addEventListener('matchdatesready', this.onMatchDatesReady);
    document.addEventListener('matchesbydateready', this.onMatchesByDateReady);
    document.addEventListener('servicetournamenttableready', this.onTournamentTableReady);
    document.addEventListener('matcheschanged', this.onMatchesChanged);
  }

  ionViewWillUnload() {
    document.removeEventListener('matchdatesready', this.onMatchDatesReady);
    document.removeEventListener('matchesbydateready', this.onMatchesByDateReady);
    document.removeEventListener('servicetournamenttableready', this.onTournamentTableReady);
    document.removeEventListener('matcheschanged', this.onMatchesChanged);
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

  enterNewGame() {
    let modal = this.modalCtrl.create(NewGamePage, { tournamentId: 'all' === this.selectedId ? null : this.selectedId });
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

  isLeagueAdmin() {
    return false;
  }

  canShowAdd() {
    if ('all' === this.selectedId)
      return this.playerService.amICaptainOrAdminOfCurrentTeam();
    else 
      return this.isLeagueAdmin(); 
  }

  showRules() {
    this.modalCtrl.create(MatchRulesPage, {
      rules: this.rules
    }).present();
  }
}
