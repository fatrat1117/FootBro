import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { SearchTeamPage } from '../search-team/search-team';
import { Team } from '../../app/teams/team.model'
import { Match } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'
import { PlayerService } from '../../app/players/player.service'
import { UIHelper } from '../../providers/uihelper'
import { MapsAPILoader } from 'angular2-google-maps/core';
import * as moment from 'moment';
declare var google: any;

@Component({
    selector: 'page-new-game',
    templateUrl: 'new-game.html'
})
export class NewGamePage {
    players = [];
    match = new Match();
    minDate;
    matchDate;
    matchTime;
    tournamentId;
    id;
    groupId;

    constructor(public navCtrl: NavController,
        private modalCtrl: ModalController,
        private viewCtrl: ViewController,
        private matchService: MatchService,
        private helper: UIHelper,
        private playerService: PlayerService,
        params: NavParams,
        private mapsAPILoader: MapsAPILoader) {
        this.tournamentId = params.get('tournamentId');
        this.groupId = params.get('groupId');
        this.id = params.get('id');
        this.minDate = moment("20160101", "YYYYMMDD").format("YYYY-MM-DD");
        if (this.id) {
            this.match = this.matchService.getMatch(this.id);
            this.matchDate = helper.numberToDateString(this.match.date);
            this.matchTime = helper.numberToTimeString(this.match.time);
        }
        else {
            this.matchDate = moment().format("YYYY-MM-DD");
            this.matchTime = "15:00";
        }
    }

    ionViewDidLoad() {
        let input = document.getElementById('autocompleteInput');
        this.mapsAPILoader.load().then(() => {
            //console.log(google);
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', () => {
                let place = autocomplete.getPlace();
                //console.log(place);
                this.match.location.name = place.name;
                this.match.location.address = place.formatted_address;
                if (place.geometry) {
                    this.match.location.lat = place.geometry.location.lat();
                    this.match.location.lng = place.geometry.location.lng();
                }
                console.log(this.match);
            });
        });
    }

    //根据胜率设置图像例如90%
    setSuccessRate(successRate) {
        var backCircle1 = document.getElementById("backCircle1");
        var backCircle2 = document.getElementById("backCircle2");
        if (successRate <= 50) {
            var angle = -360 * successRate / 100;
            backCircle2.style.transform = "rotate(" + angle + "deg)";
            backCircle2.style.backgroundColor = "#9e9e9e";
        } else {
            var angle = 180 - 360 * successRate / 100;
            backCircle2.style.transform = "rotate(" + angle + "deg)";
            backCircle2.style.backgroundColor = "green";
        }
    }

    //获取字符串长度
    getByteLen(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            }
            else {
                len += 1;
            }
        }
        return len;
    }
    //显示或关闭队员得分详情
    clickTeamMember(player) {
        if (player.hidden) {
            player.showExpandableIcon = "ios-arrow-up";
            for (var i = 0; i < this.players.length; i++) {
                for (var j = 0; j < this.players[i].items.length; j++) {
                    if (this.players[i].items[j].number <= 0) {
                        this.players[i].items[j].color = "light";
                    } else {
                        this.players[i].items[j].color = "secondary";
                    }
                }
            }
        } else {
            player.showExpandableIcon = "ios-arrow-down";
        }
        player.hidden = !player.hidden;
    }
    //删除球员
    deleteTeamPlayer(player) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i] == player) {
                this.players.splice(i, 1);
                break;
            }
        }
    }
    //减少得分
    minusScore(item) {
        if (item.number > 0) {
            item.number = item.number - 1;
            if (item.number == 0) {
                item.color = "light";
            } else {
                item.color = "secondary";
            }
        }
    }
    //增加得分
    addScore(item) {
        item.number = item.number + 1;
        item.color = "secondary";
    }
    //更新数据
    openUpdate() {
        alert("update");
    }
    //右上角删除
    openDelete() {
        alert("delete");
    }

    searchTeam(teamType) {
        let searchTeamModal = this.modalCtrl.create(SearchTeamPage);
        searchTeamModal.onDidDismiss(data => {
            if (data) {
                if (1 == teamType)
                    this.match.home = data.team;
                else
                    this.match.away = data.team;
            }
        });
        searchTeamModal.present();
    }

    toNumber(s) {
        return Number(s);
    }

    scheduleMatch() {
        let t = this.helper.dateTimeStringToNumber(this.matchDate + " " + this.matchTime);
        let tDate = this.helper.dateTimeStringToNumber(this.matchDate);

        let matchData = {
            homeId: this.match.home.id,
            awayId: this.match.away.id,
            date: tDate,
            time: t,
            locationName: this.match.location.name,
            locationAddress: this.match.location.address,
            type: this.match.type,
        }

        if (this.match.location.lat)
            matchData['lat'] = this.match.location.lat;
        if (this.match.location.lng)
            matchData['lng'] = this.match.location.lng;

        //update existinng match time, address, etc...
        if (this.id) {
            this.matchService.updateMatch(this.id, matchData);
        }
        else {
            if (this.tournamentId != null)
                matchData["tournamentId"] = this.tournamentId;
            if (this.groupId != null)
                matchData["groupId"] = this.groupId;
            matchData['creator'] = this.playerService.selfId();
            this.matchService.scheduleMatch(matchData);
        }

        this.dismiss(tDate);
    }

    close() {
        this.viewCtrl.dismiss();
    }

    dismiss(date) {
        this.viewCtrl.dismiss({ date: date });
    }
}
