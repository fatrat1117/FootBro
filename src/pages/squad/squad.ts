import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, Content } from 'ionic-angular'
import { MatchService } from '../../app/matches/match.service'
import { TeamService } from '../../app/teams/team.service'
import { SearchPlayerPage } from '../search-player/search-player'
import { PlayerService } from '../../app/players/player.service'
import { UIHelper } from '../../providers/uihelper'

@Component({
  selector: 'page-squad',
  templateUrl: 'squad.html',
})
export class SquadPage implements OnInit {
  @Input() settings;

  @ViewChild(Content) content: Content;
  @ViewChild('squadCtrl') squadCtrl;

  players;
  lineup = [];
  substitutes = [];
  overflowMode = 'auto';

  constructor(private matchService: MatchService,
    private modal: ModalController,
    private playerService: PlayerService,
    private uiHelper: UIHelper,
    private teamService: TeamService) {
    document.addEventListener('servicematchsquadready', e => {
      let detail = e['detail'];
      if (detail.teamId === this.settings.teamId && detail.matchId === this.settings.matchId) {
        let squad = this.teamService.getMatchSquad(detail.teamId, detail.matchId);
        this.setSquad(squad.lineup);
        this.lineup.forEach(l => {
          if ('id' in l) {
            let player = this.playerService.findOrCreatePlayerAndPull(l.id);
            l.photo = player.photo;
            l.name = player.name;
          }
        });
        this.substitutes.splice(0);
        if (squad.substitutes) {
          squad.substitutes.forEach(id => {
              let player = this.playerService.findOrCreatePlayerAndPull(id);
              let substitue = {
                id: id,
                photo: player.photo,
                name: player.name,
              }
              this.substitutes.push(substitue);
          });
        }
      }
    })
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

  onTouchMove(e, p) {
    if (!this.settings.editMode)
      return;
    //console.log(e, this.settings, p);
    if (1 === e.touches.length) {
      p.x = e.touches[0].pageX - 24;// - this.left;
      p.y = e.touches[0].pageY - 24 - this.settings.offsetY;
    }
    //console.log(p);
  }

  ngOnInit() {
    this.loadSquad();
    //this.matchService.getMatchSquadAsync(this.settings.matchId);
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
    e.stopPropagation();
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

  setSquad(squad) {
    console.log(this.squadCtrl);
    if (squad)
      this.lineup = this.uiHelper.squadPercentToPx(squad, this.squadCtrl.nativeElement.clientWidth, this.squadCtrl.nativeElement.clientHeight);
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
    this.substitutes.splice(this.substitutes.indexOf(p), 1);
  }

  loadSquad() {
    this.teamService.getMatchSquadAsync(this.settings.teamId, this.settings.matchId);
  }
}