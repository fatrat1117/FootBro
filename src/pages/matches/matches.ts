import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Match } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'
import { NewGamePage } from "../new-game/new-game";
import * as moment from 'moment';

@Component({
  selector: 'page-matches',
  templateUrl: 'matches.html'
})

export class MatchesPage {
  dates: number[];
  selectedDate: number;
  matches;
  matchStandings;
  today;
  selectedInfo: string;
  selectedId: string;
  tournamentId;
  afTournamentList;
  thisYear: string;
  changeYear: boolean;
  years = {};

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private matchService: MatchService) {
    this.selectedInfo = "schedule";
    this.selectedId = "all";
    this.afTournamentList = this.matchService.afTournamentList();
  }

  ionViewDidLoad() {
    this.today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;
    this.addEventListeners();
    this.matchService.getMatchDatesAsync("all");

    // this.matchService.getMatchStandings("test_league_id").then(matchStandings => {
    //   this.matchStandings = matchStandings;
    // });
  }

  scrollToToday() {
    let iToday = -1;
    if (this.dates.length > 0)
      iToday = 0;
    for (let i = 1; i < this.dates.length; ++i) {
      if (Number(this.dates[i]) > this.today) {
        break;
      }
      iToday = i;
    }

    if (iToday != -1) {
      let closeToToday = this.dates[iToday];
      this.showMatches(closeToToday, iToday);
      let scrollableDiv = document.getElementById("sketchElement");

      if (scrollableDiv) {
        scrollableDiv.scrollTop = 0;
        let scrollableItem = scrollableDiv.getElementsByTagName("ion-item");

        if (scrollableItem.length > 0) {
          scrollableDiv.scrollTop += scrollableItem[0].clientHeight * iToday;
        }
      }
    }
  }

  addEventListeners() {
    document.addEventListener('matchdatesready', e => {
      let id = e['detail'];
      this.dates = this.matchService.getMatchDates(id);
      if (!this.selectedDate) {
        let self = this;
        setTimeout(() => {
          self.scrollToToday();
          self.addYears();
        },
          1000);
      }
    });

    document.addEventListener('matchesbydateready', e => {
      let date = e['detail'];
      this.matches = this.matchService.getMatchesByDate(date);
    });

    document.addEventListener('tournamenttableready', e=>{
      let tournamentId = e['detail'];
      if (tournamentId === this.selectedId)
        //console.log(tournamentId);
        this.matchStandings = this.matchService.getTournamentTable(tournamentId);
        //console.log(this.matchStandings);
    });
  }

  addYears() {
    this.addDateToYearDictionary();
    setTimeout(this.addYearCss(),3000);
  }

  addDateToYearDictionary(){
    for (let i = 0 ; i < this.dates.length; i++){
      let currentYear = this.getYearStringFromDate(this.dates[i]);
      if (!(currentYear in this.years)){
        this.years[currentYear] = i;
      }
    }
  }

  addYearCss(){
    for (let key in this.years){
      let item_id = this.years[key];
      let item =  document.getElementById("matches-scroll-target-"+String(item_id));
      if (item != null){
        item.className += " ion-item-changeYear";
      }

    }
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
    this.modalCtrl.create(NewGamePage, { tournamentId: this.tournamentId }).present();
  }

  isChangeYear(index) {

    for (let key in this.years){
      if (index == this.years[key]){
        return true;
      }
    }
    return false;
  }

  getYearStringFromDate(date){
    let t = Number(date);
    let year = moment(t).format('YYYY');
    return year;
  }

  addDateSelectNgClass(i, date) {
    let class1 = this.selectedDate == date ? "ion-item-selected" : "ion-item-unselected";
    //let class2 = this.isChangeYear(i, date) == true ? "ion-item-changeYear" : "ion-item-unchangeYear"

    return class1 ;
  }
}
