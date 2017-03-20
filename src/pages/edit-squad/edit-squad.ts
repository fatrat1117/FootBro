import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams,PopoverController } from 'ionic-angular';
import { Match, PREDEFINEDSQUAD } from '../../app/matches/match.model';
import { PlayerService} from '../../app/players/player.service';
import { UIHelper } from  '../../providers/uihelper';
import { TeamService } from '../../app/teams/team.service';
import { SquadSelectPage } from '../../pages/squad-select/squad-select';

@Component({
  selector: 'page-edit-squad',
  templateUrl: 'edit-squad.html'
})
export class EditSquadPage {
  @ViewChild('pageHeader') pageHeader;
  @ViewChild('squadCtrl') squadCtrl;

  match: Match;
  squadSettings: any;
  teamId;
  selectedSquad = 11; //Default Squad Number set to 11
  popOverPage:any;

  constructor(private viewCtrl: ViewController,
    private playerService: PlayerService,
    private uiHelper: UIHelper,
    navParams: NavParams,
    private teamService: TeamService,
    private popoverCtrl: PopoverController) {
    this.match = navParams.get('match');
    this.teamId = navParams.get('teamId');
    this.squadSettings = {};
    this.squadSettings.editMode = true;
    this.squadSettings.matchId = this.match.id;
    this.squadSettings.teamId = this.teamId;
  }

  dismiss() {
    this.viewCtrl.dismiss();
     if (this.popOverPage){
        this.popOverPage.dismiss();
    }
  }

  ionViewDidLoad() {
    this.squadSettings.offsetY = this.pageHeader.nativeElement.clientHeight;
    console.log('editsquadloaded', this.squadCtrl);
    //this.squadCtrl.loadSquad();
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
  
  selectSquadNumber(myEvent,number) {
    
    if (this.popOverPage){
        this.popOverPage.dismiss();
    }
    this.selectedSquad = number;
    this.popOverPage = this.popoverCtrl.create(SquadSelectPage,{select:this.selectedSquad},{cssClass:'squad-popover'});
    
    this.popOverPage.present({
        ev:myEvent
    });
    
  
  }
 }
