import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams, AlertController, Events } from 'ionic-angular';
import { SearchTeamPage } from '../search-team/search-team';
import { SearchPlayerPage } from '../search-player/search-player';
import { Team } from '../../app/teams/team.model'
import { Match } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'
import { PlayerService } from '../../app/players/player.service'
import { PlayerMatchStatsUI } from '../../app/players/player.model'
import { TeamService } from '../../app/teams/team.service'
import { UIHelper } from '../../providers/uihelper'
import { Localization } from '../../providers/localization'
import { OneSignalManager } from '../../providers/onesignal-manager'
import * as moment from 'moment';
declare var sprintf: any;
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
    homeScore;
    awayScore;
    myIdentity = 2; //0: home captain, 1: away captain, 2:others
    onMatchSquadReady;
    teamId;
    participants: PlayerMatchStatsUI[] = [];
    hasPenalty = false;
    adminMode = false;
    homePenalty;
    awayPenalty;

    constructor(public navCtrl: NavController,
        private modalCtrl: ModalController,
        private viewCtrl: ViewController,
        private matchService: MatchService,
        private helper: UIHelper,
        private playerService: PlayerService,
        private teamService: TeamService,
        private loc: Localization,
        private alertCtrl: AlertController,
        params: NavParams,
        private events: Events,
        private osm: OneSignalManager) {
        this.id = params.get('id');
        this.teamId = params.get('teamId');
        this.adminMode = params.get('adminMode') || this.adminMode;
        this.match = this.matchService.getMatch(this.id);
        this.homeScore = this.match.homeScore >= 0 ? this.match.homeScore : '';
        this.awayScore = this.match.awayScore >= 0 ? this.match.awayScore : '';
        this.homePenalty = this.match.homePenalty >= 0 ? this.match.homePenalty : '';
        this.awayPenalty = this.match.awayPenalty >= 0 ? this.match.awayPenalty : '';
        //this.homePenalty = this.match.homePenalty || '';
        //this.awayPenalty = this.match.awayPenalty || '';
        if (this.match.home.captain === this.playerService.selfId())
            this.myIdentity = 0;
        else if (this.match.away.captain === this.playerService.selfId())
            this.myIdentity = 1;
        this.minDate = moment("20160101", "YYYYMMDD").format("YYYY-MM-DD");
        this.matchDate = helper.numberToDateString(this.match.date);
        this.matchTime = helper.numberToTimeString(this.match.time);
    }
    //显示或关闭队员得分详情
    clickTeamMember(player) {
        player.expanded = !player.expanded;
    }

    ionViewDidLoad() {
        this.onMatchSquadReady = (teamId, matchId) => {
            if (teamId === this.teamId && matchId === this.id) {
                let squad = this.teamService.getMatchSquad(teamId, matchId);
                if ('participants' in squad)
                    this.copyParticipants(this.participants, squad.participants);
                else {
                    //get from lineup and substitutes
                    if ('lineup' in squad) {
                        squad.lineup.forEach(l => {
                            if ('id' in l) {
                                let player = new PlayerMatchStatsUI();
                                player.id = l.id;
                                player.player = this.playerService.findOrCreatePlayerAndPull(l.id);
                                this.participants.push(player);
                            }
                        });
                    }

                    if ('substitutes' in squad) {
                        squad.substitutes.forEach(id => {
                            let player = new PlayerMatchStatsUI();
                            player.id = id;
                            player.player = this.playerService.findOrCreatePlayerAndPull(id);
                            this.participants.push(player);
                        });
                    }
                }
            }
        }
        this.events.subscribe('servicematchsquadready', this.onMatchSquadReady);
        this.teamService.getMatchSquadAsync(this.teamId, this.id);
    }

    ionViewWillUnload() {
        this.events.unsubscribe('servicematchsquadready', this.onMatchSquadReady);
    }

    copyParticipants(target, source) {
        if (source) {
            target.splice(0);
            source.forEach(p => {
                let copy = Object.assign({}, p);
                copy['player'] = this.playerService.findOrCreatePlayerAndPull(p.id);
                target.push(copy);
            })
        }
    }

    // //删除球员
    deleteTeamPlayer(player, e, players) {
        e.stopPropagation();
        players.splice(players.indexOf(player), 1);
    }

    minus(player, key) {
        --player[key];
    }

    plus(player, key) {
        ++player[key];
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

    getTeamPoints() {
        let points = 100 + this.participants.length * 10;
        return Math.min(250, points);
    }

    updateMatch() {
        //amdin can update score
        if (this.adminMode) {
            this.doSimpleUpdate();
            return;
        }

        //let points = 100 + (0 === this.myIdentity ? this.homePlayers.length : this.awayPlayers.length) * 10;
        let points = this.getTeamPoints();
        let msg = sprintf(this.loc.getString('teamupdateonceandearnpoints'), points);
        let self = this;
        let confirm = this.alertCtrl.create({
            title: this.loc.getString('note'),
            message: msg,
            buttons: [
                {
                    text: this.loc.getString('Cancel'),
                    handler: () => {
                    }
                },
                {
                    text: this.loc.getString('OK'),
                    handler: () => {
                        self.doUpdateMatch(points);
                    }
                }
            ]
        });
        confirm.present();
    }

    doSimpleUpdate () {
        let updateMatchData = this.getMatchScores();
        this.matchService.updateMatch(this.id, updateMatchData);
        this.close();
    }
    
    canShowPenalty() {
        if (this.hasPenalty && this.homeScore == this.awayScore)
            return true;
        return false;
    }

    doUpdateMatch(points) {
        let playerIds = [];
        let pushIds = [];
        this.participants.forEach(p => {
            if (p.player && p.player.pushId) {
                playerIds.push(p.player.id);
                pushIds.push(p.player.pushId);
            }
        })

        let participants = this.copyAndUpdatePlayersData(this.participants);

        let updateMatchData = this.getMatchScores();

        if (this.teamId === this.match.homeId)
            updateMatchData['isHomeUpdated'] = true;
        else if (this.teamId === this.match.awayId)
            updateMatchData['isAwayUpdated'] = true;

        this.matchService.updateMatch(this.id, updateMatchData);
        this.teamService.updateMatchParticipants(this.teamId, this.id, participants);
        this.teamService.teamEarnPoints(this.teamId, points);

        let enMsg = sprintf('%s vs %s (%s : %s), rate your teammates to earn player points',
            this.match.home.name,
            this.match.away.name,
            updateMatchData.homeScore,
            updateMatchData.awayScore
        );

        let chMsg = sprintf('%s vs %s (%s : %s), 快去给队友打分以获得个人积分吧',
            this.match.home.name,
            this.match.away.name,
            updateMatchData.homeScore,
            updateMatchData.awayScore
        );

        this.osm.matchNotification('rateMatch', this.id, playerIds, pushIds, enMsg, chMsg);
        //let pushMsg = { 'en': enMsg, 'zh-Hans': chMsg };
        //this.osm.postNotification(pushMsg, pushIds);
        this.close();
    }

    getMatchScores() : any {
        let updateMatchData = {
        };

        let homeScoreStr = this.homeScore.toString().trim();
        let awayScroeStr = this.awayScore.toString().trim();
        if (homeScoreStr.length > 0 && awayScroeStr.length > 0) {
            updateMatchData["homeScore"] = Number(homeScoreStr);
            updateMatchData["awayScore"] = Number(awayScroeStr);
        }
        if (this.hasPenalty) {
            let homePenaltyStr = this.homePenalty.toString().trim();
            let awayPenaltyStr = this.awayPenalty.toString().trim();
            if (homePenaltyStr.length > 0 && awayPenaltyStr.length > 0) {
                updateMatchData["homePenalty"] = Number(homePenaltyStr);
                updateMatchData["awayPenalty"] = Number(awayPenaltyStr);
            }
        }

        return updateMatchData;
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
                //console.log(selectedIds, players);
                //delete not selected players
                // for (let i = players.length - 1; i >= 0; --i) {
                //     let p = players[i];
                //     if (selectedIds[p.id] != true)
                //         players.splice(i, 1);
                // }
                for (let id in selectedIds) {
                    //add only new
                    if (selectedIds[id] && existingPlayersMap[id] != true) {
                        let data = new PlayerMatchStatsUI();
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
