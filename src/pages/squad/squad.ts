import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from 'ionic-angular'
import { MatchService } from '../../app/matches/match.service'
import { SearchPlayerPage } from '../search-player/search-player'
import { PlayerService } from '../../app/players/player.service'
import { UIHelper } from  '../../providers/uihelper'

@Component({
  selector: 'page-squad',
  templateUrl: 'squad.html',
})
export class SquadPage implements OnInit {
  @Input()
  settings;

  @ViewChild('squadCtrl') squadCtrl;

  players;
  match;
  squads;

  constructor(private matchService: MatchService,
    private modal: ModalController,
    private playerService: PlayerService,
    private uiHelper: UIHelper) {
    document.addEventListener('servicematchsquadready', e => {
      let matchId = e['detail'];
      this.match = this.match = this.matchService.getMatch(this.settings.matchId);
      //f (matchId === this.settings.matchId) {
      //  this.match = this.match = this.matchService.getMatch(this.settings.matchId);
      //this.squad = this.settings.teamId === this.match.homeId ? this.match.homeSquad : this.match.awaySquad;
      //}
    })
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

  panEvent(e, p) {
    if (!this.settings.editMode)
      return;
    //console.log(e);
    if (e.isFinal === false) {
      p.left = e.center.x - 24;// - this.left;
      p.top = e.center.y - 24;
    }
  }

  ngOnInit() {
    //this.matchService.getMatchSquadAsync(this.settings.matchId);
  }

  choosePlayer(e, p) {
    e.stopPropagation();
    let existingPlayers = [];
    this.squads.forEach(p => {
      if ('id' in p)
        existingPlayers.push(p.id);
    });

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

  setSquads(squads) {
    this.squads = this.uiHelper.squadPercentToPx(squads, this.squadCtrl.nativeElement.clientWidth, this.squadCtrl.nativeElement.clientHeight);
  }
}
