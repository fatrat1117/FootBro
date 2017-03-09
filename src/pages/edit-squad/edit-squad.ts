import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams } from 'ionic-angular';
import { Match } from '../../app/matches/match.model';
import { PlayerService} from '../../app/players/player.service';

@Component({
  selector: 'page-edit-squad',
  templateUrl: 'edit-squad.html'
})
export class EditSquadPage {
  @ViewChild('pageHeader') pageHeader;
  match: Match;
  squadSettings: any;
  players;
  teamId;

  constructor(private viewCtrl: ViewController,
    private playerService: PlayerService,
    navParams: NavParams) {
    this.match = navParams.get('match');
    this.teamId = navParams.get('teamId');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    document.addEventListener('serviceteamplayersready', e => {
      let teamId = e['detail'];
      if (teamId === this.teamId) {
        this.players = this.playerService.getTeamPlayers(teamId);
      }
    })

    this.squadSettings = {};
    this.squadSettings.editMode = true;
    this.squadSettings.matchId = this.match.id;
    this.squadSettings.teamId = this.match.homeId;
    this.squadSettings.offsetY = this.pageHeader.nativeElement.clientHeight;

    this.playerService.getTeamPlayersAsync(this.teamId);
  }

  onTouchMove(e, p) {
    console.log(e, p);
    
  }
 }
