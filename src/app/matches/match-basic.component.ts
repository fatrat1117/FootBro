import { Component, Input, OnInit } from '@angular/core';
import { MatchDetailPage } from '../../pages/match-detail/match-detail'
import { NavController, ModalController } from "ionic-angular";
import { TeamService } from '../teams/team.service';

@Component({
  selector: 'sb-match-basic',
  templateUrl: 'match-basic.component.html',
  styleUrls: ['/app/matches/match-basic.component.scss']
})

export class SbMatchBasicComponent implements OnInit {
  @Input()
  match;
  home;
  away;

  constructor(private navCtrl: NavController,
    private teamService: TeamService,
    private modelCtrl: ModalController) {

  }

  ngOnInit() {
    document.addEventListener('serviceteamready', e => {
      let id = e['detail'];
      if (id === this.match.homeId)
        this.home = this.teamService.getTeam(id);
      else if (id === this.match.awayId)
        this.away = this.teamService.getTeam(id);
    });

    this.teamService.getTeamAsync(this.match.homeId);
    this.teamService.getTeamAsync(this.match.awayId);
  }

  goMatchDetailPage() {
    this.modelCtrl.create(MatchDetailPage, {id: this.match.$key}).present();
    //this.navCtrl.push(MatchDetailPage);
  }
}
