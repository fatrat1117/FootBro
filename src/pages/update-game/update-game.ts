import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { SearchTeamPage } from '../search-team/search-team';
import { SearchPlayerPage } from '../search-player/search-player';
import { Team } from '../../app/teams/team.model'
import { Match } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'
import { PlayerService } from '../../app/players/player.service'
import { PlayerMatchData } from '../../app/players/player.model'
import { TeamService } from '../../app/teams/team.service'
import { UIHelper } from '../../providers/uihelper'
import * as moment from 'moment';
declare var google: any;

@Component({
    selector: 'page-update-game',
    templateUrl: 'update-game.html'
})
export class UpdateGamePage {
    //players = [];
    match = new Match();
    minDate;
    matchDate;
    matchTime;
    tournamentId;
    id;
    homePlayers: PlayerMatchData[];
    awayPlayers: PlayerMatchData[];

    constructor(public navCtrl: NavController,
        private modalCtrl: ModalController,
        private viewCtrl: ViewController,
        private matchService: MatchService,
        private helper: UIHelper,
        private playerService: PlayerService,
        private teamService: TeamService,
        params: NavParams) {
        this.id = params.get('id');
        this.match = this.matchService.getMatch(this.id);
        console.log(this.match);
        this.minDate = moment("20160101", "YYYYMMDD").format("YYYY-MM-DD");
        this.matchDate = helper.numberToDateString(this.match.date);
        this.matchTime = helper.numberToTimeString(this.match.time);
        this.homePlayers = this.match.homePlayers || [];
        this.awayPlayers = this.match.awayPlayers || [];
        
        // for (var i = 0; i < 4; i++) {
        //     this.players[i] = {
        //         name: i,
        //         items: [],
        //         hidden: true,
        //         showExpandableIcon: "ios-arrow-down"
        //     };
        //     for (var j = 0; j < 3; j++) {
        //         // this.players[i].items.push(i + '-' + j);
        //         this.players[i].items = [
        //             {
        //                 name: "进球",
        //                 number: 5,
        //                 icon: "assets/icon/b2.png",
        //                 color: "light"
        //             },
        //             {
        //                 name: "助攻",
        //                 number: 1,
        //                 icon: "assets/icon/b3.png",
        //                 color: "light"
        //             },
        //             {
        //                 name: "红牌",
        //                 number: 2,
        //                 icon: "assets/icon/b2.png",
        //                 color: "light"
        //             },
        //             {
        //                 name: "黄牌",
        //                 number: 4,
        //                 icon: "assets/icon/b2.png",
        //                 color: "light"
        //             },

        //         ];
        //     }
        // }
    }

    ionViewDidLoad() {
        let input = document.getElementById('autocompleteInput');
        //console.log(google);    
        let autocomplete = new google.maps.places.Autocomplete(input);
        //console.log(autocomplete);
        //let autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocompleteInput"), {});
        autocomplete.addListener('place_changed', () => {
            let place = autocomplete.getPlace();
            //console.log(place);
            this.match.location.name = place.name;
            this.match.location.address = place.formatted_address;
            if (place.geometry) {
                this.match.location.lat = place.geometry.location.lat();
                this.match.location.lng = place.geometry.location.lng();
            }
            //console.log(this.match.location);
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
        player.expanded = !player.expanded;
        // if (player.hidden) {
        //     player.showExpandableIcon = "ios-arrow-up";
        //     for (var i = 0; i < this.players.length; i++) {
        //         for (var j = 0; j < this.players[i].items.length; j++) {
        //             if (this.players[i].items[j].number <= 0) {
        //                 this.players[i].items[j].color = "light";
        //             } else {
        //                 this.players[i].items[j].color = "secondary";
        //             }
        //         }
        //     }
        // } else {
        //     player.showExpandableIcon = "ios-arrow-down";
        // }
        // player.hidden = !player.hidden;
    }

    // //删除球员
    deleteTeamPlayer(player, e, tag) {
        e.stopPropagation();
        let players = (1 === tag ? this.homePlayers : this.awayPlayers);
        players.splice(players.indexOf(player), 1);
        // for (var i = 0; i < this.players.length; i++) {
        //     if (this.players[i] == player) {
        //         this.players.splice(i, 1);
        //         break;
        //     }
        // }
    }

    //减少得分
    // minusScore(item) {
    //     if (item.number > 0) {
    //         item.number = item.number - 1;
    //         if (item.number == 0) {
    //             item.color = "light";
    //         } else {
    //             item.color = "secondary";
    //         }
    //     }
    // }
    // //增加得分
    // addScore(item) {
    //     item.number = item.number + 1;
    //     item.color = "secondary";
    // }
    //更新数据

    minus(player, key) {
        --player[key];
    }

    plus(player, key) {
        ++player[key];
    }

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

    updatePlayersData(players) {
        players.forEach(p => {
            p['id'] = p.player.id;
            delete p.player;
        })
    }

    updateMatch() {
        let t = this.helper.dateTimeStringToNumber(this.matchDate + " " + this.matchTime);
        let tDate = this.helper.dateTimeStringToNumber(this.matchDate);

        this.updatePlayersData(this.homePlayers);
        this.updatePlayersData(this.awayPlayers);
        let updateMatchData = {
            date: tDate,
            time: t,
            locationName: this.match.location.name,
            locationAddress: this.match.location.address,
            type: this.match.type,
            homePlayers: this.homePlayers,
            awayPlayers: this.awayPlayers,
        };

        if (this.match.location.lat)
            updateMatchData['lat'] = this.match.location.lat;
        if (this.match.location.lng)
            updateMatchData['lng'] = this.match.location.lng;
        if ('homeScore' in this.match && this.match.homeScore >= 0)
            updateMatchData["homeScore"] = this.match.homeScore;
        if ('awayScore' in this.match && this.match.awayScore >= 0)
            updateMatchData["awayScore"] = this.match.homeScore;
        
        this.matchService.updateMatch(this.id, updateMatchData);
        
        // let self = this;
        // let success = () => {
        //   //alert('update match successful');
        //   self.dismiss();
        // };
        // let error = err => {
        //   alert(err);
        // };

        // this.fm.updateMatch(this.tournamentId, this.mId, updateMatchData,
        //   this.oldDate,
        //   success,
        //   error);
    }

    close() {
        this.viewCtrl.dismiss();
    }

    deleteMatch() {
        //console.log('beforedeleteMatch', this.match);
        //save temp date and tournamentId
        //let date = this.match.date;
        //let tournamentId = this.match.tournamentId || 'all';
        this.matchService.deleteMatch(this.id);
        // console.log('deleteMatch', this.match);
        //this.matchService.getMatchesByDateAsync(date, tournamentId);
        this.close();
    }

    choosePlayers(id, tag) {
        let players = (1 === tag ? this.homePlayers : this.awayPlayers);
        let existingPlayers = [];
        players.forEach(p => {
            existingPlayers.push(p.player.id);
        });

        let modal = this.modalCtrl.create(SearchPlayerPage, {
            teamId: id,
            showClose: true,
            selectPlayersMode: true,
            selectedIds: existingPlayers
        });

        modal.onDidDismiss(e => {
            if (e && e['selectedIds']) {
                let selectedIds = e['selectedIds'];
                console.log(selectedIds);

                players = (1 === tag ? this.homePlayers : this.awayPlayers);
                players.splice(0);
                for (let id in selectedIds) {
                    if (selectedIds[id]) {
                        let data = new PlayerMatchData();
                        data.player = this.playerService.getPlayer(id);
                        players.push(data);
                    }
                }
                console.log(this.homePlayers);
            }
        });

        modal.present();
    }
}
