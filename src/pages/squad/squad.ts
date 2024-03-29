import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalController, Content, Events } from 'ionic-angular'
import { MatchService } from '../../app/matches/match.service'
import { TeamService } from '../../app/teams/team.service'
import { SearchPlayerPage } from '../search-player/search-player'
import { PlayerService } from '../../app/players/player.service'
import { UIHelper } from '../../providers/uihelper'

@Component({
  selector: 'page-squad',
  templateUrl: 'squad.html',
})
export class SquadPage implements OnInit, OnDestroy {
  @Input() settings;

  @ViewChild(Content) content: Content;
  @ViewChild('squadCtrl') squadCtrl;

  players;
  lineup = [];
  substitutes = [];
  overflowMode = 'auto';
  uiPlayerMap = {};
  onMatchSquadReady;
  onPlayerReady;

  constructor(private matchService: MatchService,
    private modal: ModalController,
    private playerService: PlayerService,
    private uiHelper: UIHelper,
    private teamService: TeamService,
    public events: Events) {

  } 

  addEventListeners() {
      this.onMatchSquadReady = (teamId, matchId) => {
      //console.log(teamId, matchId, this);
      if (teamId === this.settings.teamId && matchId === this.settings.matchId) {
        let squad = this.teamService.getMatchSquad(teamId, matchId);
        this.setSquad(squad);
      }
    }

    this.onPlayerReady = e => {
      let playerId = e['detail'];
      let uiPlayer = this.uiPlayerMap[playerId];
      if (uiPlayer) {
        let player = this.playerService.getPlayer(playerId);
        uiPlayer.photo = player.photo;
        uiPlayer.name = player.name;
      }
    };

    this.events.subscribe('servicematchsquadready', this.onMatchSquadReady);
    document.addEventListener('serviceplayerready', this.onPlayerReady);
  }

  ngOnInit() {
    this.addEventListeners();

      let self = this;
      setTimeout(function () {
        self.loadSquad();
      }, 500);
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  
  unsubscribeEvents() {
    this.events.unsubscribe('servicematchsquadready', this.onMatchSquadReady);
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
  }

  addSubstitute(id) {
    let player = this.playerService.getPlayer(id);
    let substitue = {
      id: id,
      photo: player.photo,
      name: player.name,
    }
    this.substitutes.push(substitue);
  }

  onTouchStart() {
    this.overflowMode = 'hidden';
  }

  onTouchEnd() {
    this.overflowMode = 'auto';
  }

  isImageInBoundary(x, y) {
    //console.log(x, this.squadCtrl.clientWidth - this.uiHelper.squadHalfImageSize * 2); 
    if (x < 0 ||
      x > this.squadCtrl.nativeElement.clientWidth - this.uiHelper.squadHalfImageSize * 2 ||
      y < 0 ||
      y > this.squadCtrl.nativeElement.clientHeight - this.uiHelper.squadHalfImageSize * 2)
      return false;

    return true;
  }

  onTouchMove(e, p) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.settings.editMode)
      return;
    //console.log(e, this.settings, p);
    if (1 === e.touches.length) {
      let x = e.touches[0].pageX - this.uiHelper.squadHalfImageSize;
      let y = e.touches[0].pageY - this.uiHelper.squadHalfImageSize - this.settings.offsetY;
      if (this.isImageInBoundary(x, y)) {
        p.x = x;
        p.y = y;
      }
    }
  }

  getAddedPlayerIds() {
    let existingPlayers = [];
    this.lineup.forEach(p => {
      if ('id' in p)
        existingPlayers.push(p.id);
    });
    this.substitutes.forEach(p => {
      existingPlayers.push(p.id);
    })
    return existingPlayers;
  }

  choosePlayer(e, p) {
    //console.log(e);
    e.stopPropagation();
    e.preventDefault();
    if (!this.settings.editMode)
      return;

    let existingPlayers = this.getAddedPlayerIds();

    let modal = this.modal.create(SearchPlayerPage, {
      teamId: this.settings.teamId,
      showClose: true,
      selectedIds: existingPlayers
    });

    modal.onDidDismiss(e => {
      console.log(e);
      if (e && e.playerId) {
        p.id = e.playerId;
        let player = this.playerService.getPlayer(p.id);
        p.name = player.name;
        p.photo = player.photo;
      }
    });
    modal.present();
  }

  setLineup(lineup) {
    console.log('setLineup', this.squadCtrl);
    if (lineup)
      this.lineup = this.uiHelper.squadPercentToPx(lineup, this.squadCtrl.nativeElement.clientWidth, this.squadCtrl.nativeElement.clientHeight);
  }

  setSquad(squad) {
    this.setLineup(squad.lineup);
        if (this.lineup) {
          this.lineup.forEach(l => {
            if ('id' in l) {
              this.uiPlayerMap[l.id] = l;
              let player = this.playerService.getPlayerAsync(l.id);
            }
          });
        }
        this.substitutes.splice(0);
        if (squad.substitutes) {
          squad.substitutes.forEach(id => {
            let substitue = {
              id: id,
            }
            this.uiPlayerMap[id] = substitue;
            this.substitutes.push(substitue);
            let player = this.playerService.getPlayerAsync(id);
          });
        }
  }

  getSquad() {
    console.log(this.squadCtrl);
    let lineup = this.uiHelper.squadPxToPercent(this.lineup, this.squadCtrl.nativeElement.clientWidth, this.squadCtrl.nativeElement.clientHeight);
    let substitutes = [];
    this.substitutes.forEach(s => {
      substitutes.push(s.id);
    });
    let squadObj = {
      lineup: lineup,
      substitutes: substitutes
    };
    return squadObj;
  }

  addSubstitutes() {
    if (!this.settings.editMode)
      return;

    let existingPlayers = this.getAddedPlayerIds();

    let modal = this.modal.create(SearchPlayerPage, {
      teamId: this.settings.teamId,
      showClose: true,
      selectPlayersMode: true,
      selectedIds: existingPlayers
    });

    modal.onDidDismiss(e => {
      console.log(e);
      if (e && e.selectedIds) {
        for (let id in e.selectedIds) {
          this.addSubstitute(id);
        }
      }
    });
    modal.present();
  }

  removeSubstitute(p) {
    //console.log('removeSubstitute', p, this.substitutes);
    if (!this.settings.editMode)
      return;

    this.substitutes.splice(this.substitutes.indexOf(p), 1);
  }

  loadSquad() {
    this.teamService.getMatchSquadAsync(this.settings.teamId, this.settings.matchId);
  }
}
