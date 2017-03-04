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
        //console.log(this.match);
        this.minDate = moment("20160101", "YYYYMMDD").format("YYYY-MM-DD");
        this.matchDate = helper.numberToDateString(this.match.date);
        this.matchTime = helper.numberToTimeString(this.match.time);
        this.homePlayers = this.match.homeParticipants;
        this.awayPlayers = this.match.awayParticipants;
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
    deleteTeamPlayer(player, e, players) {
        e.stopPropagation();
        players.splice(players.indexOf(player), 1);
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

    copyAndUpdatePlayersData(players) {
        let data = [];
        players.forEach(p => {
            let copy = Object.assign({}, p);
            copy['id'] = p.player.id;
            delete copy.player;
            data.push(copy);
        });
        return data;
    }

    updateMatch() {
        let copyHomeParticipants = this.copyAndUpdatePlayersData(this.homePlayers);
        let copyAwayParticipants = this.copyAndUpdatePlayersData(this.awayPlayers);
        let updateMatchData = {
            homeParticipants: copyHomeParticipants,
            awayParticipants: copyAwayParticipants,
        };

        let homeScoreStr = this.match.homeScore.toString().trim();
        let awayScroeStr = this.match.awayScore.toString().trim();
        if (homeScoreStr.length > 0 && awayScroeStr.length > 0) {
            updateMatchData["homeScore"] = Number(this.match.homeScore);
            updateMatchData["awayScore"] = Number(this.match.awayScore);
        }
        
        this.matchService.updateMatch(this.id, updateMatchData);
        this.close();
    }

    close() {
        this.viewCtrl.dismiss();
    }

    deleteMatch() {
        this.matchService.deleteMatch(this.id);
        this.close();
    }

    choosePlayers(id, players) {
        let existingPlayers = [];
        let existingPlayersMap = {};
        players.forEach(p => {
            existingPlayers.push(p.player.id);
            existingPlayersMap[p.player.id] = true;
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
                //    console.log(selectedIds, players);
                //delete not selected players
                for (let i = players.length - 1; i >= 0; --i) {
                    let p = players[i];
                    if (selectedIds[p.id] != true)
                        players.splice(i, 1);
                }

                for (let id in selectedIds) {
                    //add only new
                    if (selectedIds[id] && existingPlayersMap[id] != true) {
                        let data = new PlayerMatchData();
                        data.id = id;
                        data.player = this.playerService.getPlayer(id);
                        players.push(data);
                    }
                }
                //console.log(this.homePlayers);
            }
        });

        modal.present();
    }
}
