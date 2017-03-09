import { Component, Input, OnInit } from '@angular/core';
import { MatchService } from '../../app/matches/match.service'

@Component({
  selector: 'page-squad',
  templateUrl: 'squad.html',
})
export class SquadPage implements OnInit {
  @Input()
  settings;

  players = [];
  match;
  squad;
  constructor(private matchService: MatchService) {
    this.players.push({ left: 0, top: 0, photo: 'assets/img/none.png', name: 'lihao' });
    this.players.push({ left: 100, top: 100, photo: 'assets/img/none.png', name: 'wang tianyi' });
    this.players.push({ left: 200, top: 200, photo: 'assets/img/none.png', name: 'li ji xiang' });

    document.addEventListener('servicematchsquadready', e => {
      let matchId = e['detail'];
      this.match = this.match = this.matchService.getMatch(this.settings.matchId);
      this.squad = this.settings.teamId === this.match.homeId ? this.match.homeSquad : this.match.awaySquad;
    })
  }

  onTouchMove(e, p) {
    if (!this.settings.editMode)
      return;
    //console.log(e, this.settings);
    if (1 === e.touches.length) {
      p.left = e.touches[0].pageX - 24;// - this.left;
      p.top = e.touches[0].pageY - 24 - this.settings.offsetY;
    }
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
    this.matchService.getMatchSquadAsync(this.settings.matchId)
  }
}
