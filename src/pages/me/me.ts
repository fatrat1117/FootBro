import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { Player } from '../../app/players/player.model'
import { Team } from '../../app/teams/team.model'
import { MyTeamPage } from "../my-team/my-team";
import { EditPlayerPage } from "../edit-player/edit-player";
import { ManageTeamPage } from "../manage-team/manage-team";
import { MyPlayerPage } from "../my-player/my-player";
import { FeedbackPage } from "../feedback/feedback";
import { MessagesPage } from "../messages/messages";
import { PlayerService } from '../../app/players/player.service'
import { TeamService } from '../../app/teams/team.service'
import { MessageService } from '../../app/messages/shared/message.service'

@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
  providers: [ MessageService ]
})
export class MePage {
  selfId: string
  player: Player;
  messageCount: number;
  constructor(private navCtrl: NavController, 
  private modalCtrl: ModalController, 
  private playerService: PlayerService, 
  private messageService: MessageService, 
  private teamService: TeamService,
  private af: AngularFire) {
    this.messageCount = 0;
    this.selfId = this.playerService.selfId;
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.playerService.getPlayerAsync(this.selfId);

    this.messageService.getAllUnreadMessages().subscribe(messages => {
      this.messageCount = messages.length;
    })
  }

  addEventListeners() {
    document.addEventListener('serviceplayerdataready', e => {
      let playerId = e['detail'];
      //console.log(teamId, this.id);
      if (playerId === this.selfId) {
        this.player = this.playerService.getPlayer(playerId);
        //console.log(this.team);
      }
    });
  }

  goEditPlayerPage() {
    this.navCtrl.push(EditPlayerPage);
  }

  goSwitchTeamPage() {
    this.navCtrl.push(ManageTeamPage);
  }

  goPlayerPage() {
    this.navCtrl.push(MyPlayerPage);
  }

  goFeedbackPage() {
    this.navCtrl.push(FeedbackPage);
  }

  goTeamPage() {
    this.navCtrl.push(MyTeamPage);
  }

  goMessagesPage() {
    this.navCtrl.push(MessagesPage);
  }

  onLogout() {
    this.af.auth.logout();
  }
}
