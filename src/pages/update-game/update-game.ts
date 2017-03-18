import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams, AlertController, Events } from 'ionic-angular';
import { SearchTeamPage } from '../search-team/search-team';
import { SearchPlayerPage } from '../search-player/search-player';
import { Team } from '../../app/teams/team.model'
import { Match } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'
import { PlayerService } from '../../app/players/player.service'
import { PlayerMatchData } from '../../app/players/player.model'
import { TeamService } from '../../app/teams/team.service'
import { UIHelper } from '../../providers/uihelper'
import { Localization } from '../../providers/localization'
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
    //homePlayers: PlayerMatchData[];
    //awayPlayers: PlayerMatchData[];
    updateState = 3;
    myIdentity = 2; //0: home captain, 1: away captain, 2:others
    onMatchSquadReady;
    teamId;
    participants: PlayerMatchData[];

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
        private events: Events) {
        this.id = params.get('id');
        this.teamId = params.get('teamId');
        this.match = this.matchService.getMatch(this.id);
        this.updateState = this.match.updateState();
        if (this.match.home.captain === this.playerService.selfId())
            this.myIdentity = 0;
        else if (this.match.away.captain === this.playerService.selfId())
            this.myIdentity = 1;
        this.minDate = moment("20160101", "YYYYMMDD").format("YYYY-MM-DD");
        this.matchDate = helper.numberToDateString(this.match.date);
        this.matchTime = helper.numberToTimeString(this.match.time);
        //this.homePlayers = this.match.homeParticipants;
        //this.awayPlayers = this.match.awayParticipants;
        //let test = sprintf('%d sdasdf', 1);
        //console.log(test); 
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
                    //get from lineup and subsititutes
                    if ('lineup' in squad) {
                        squad.lineup.forEach(l => {
                            if ('id' in l) {
                                let player = new PlayerMatchData();
                                player.id = l.id;
                                this.playerService.findOrCreatePlayerAndPull(l.id);
                                this.participants.push(player);
                            }
                        });
                    }

                    if ('subsititutes' in squad) {
                        squad.subsititutes.forEach(s => {
                            let player = new PlayerMatchData();
                            player.id = s.id;
                            this.playerService.findOrCreatePlayerAndPull(s.id);
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
        //let points = 100 + (0 === this.myIdentity ? this.homePlayers.length : this.awayPlayers.length) * 10;
        let points = 100 + this.participants.length * 10;
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
                        self.doUpdateMatch();
                    }
                }
            ]
        });
        confirm.present();
    }

    doUpdateMatch() {
        // let copyHomeParticipants = this.copyAndUpdatePlayersData(this.homePlayers);
        // let copyAwayParticipants = this.copyAndUpdatePlayersData(this.awayPlayers);
        let updateMatchData = {
            // homeParticipants: copyHomeParticipants,
            // awayParticipants: copyAwayParticipants,
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

    isShowSave() {
        if (3 === this.updateState)
            return false;
        if (2 === this.updateState && this.match.home.captain === this.playerService.selfId())
            return false;
        if (1 === this.updateState && this.match.away.captain === this.playerService.selfId())
            return false;
        return true;
    }
}
