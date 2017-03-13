import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams } from 'ionic-angular';
import { Match, PREDEFINEDSQUAD } from '../../app/matches/match.model';
import { PlayerService} from '../../app/players/player.service';
import { UIHelper } from  '../../providers/uihelper'
import { TeamService } from '../../app/teams/team.service'

@Component({
  selector: 'page-edit-squad',
  templateUrl: 'edit-squad.html'
})
export class EditSquadPage {
  @ViewChild('pageHeader') pageHeader;
  @ViewChild('squadCtrl') squadCtrl;

  match: Match;
  squadSettings: any;
  players;
  teamId;

  constructor(private viewCtrl: ViewController,
    private playerService: PlayerService,
    private uiHelper: UIHelper,
    navParams: NavParams,
    private teamService: TeamService) {
    this.match = navParams.get('match');
    this.teamId = navParams.get('teamId');
    this.squadSettings = {};
    this.squadSettings.editMode = true;
    this.squadSettings.matchId = this.match.id;
    this.squadSettings.teamId = this.match.homeId;
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
    this.squadSettings.offsetY = this.pageHeader.nativeElement.clientHeight;
    this.playerService.getTeamPlayersAsync(this.teamId);
  }

  onTouchMove(e, p) {
    console.log(e, p);
    
  }

  load7() {

  }

  load11() {
    //console.log(this.squadCtrl);
    this.squadCtrl.setSquad(PREDEFINEDSQUAD['442']);
  }

  saveSquad() {
    let squad = this.squadCtrl.getSquad();
    this.teamService.saveMatchSquad(this.teamId, this.match.id, squad);
    this.dismiss();
  }
 }