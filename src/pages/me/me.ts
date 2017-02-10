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
import { CreateTeamPage } from '../create-team/create-team'

@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
  providers: [MessageService],
})
export class MePage {
  player: Player;
  team: Team;
  messageCount: number;
  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private messageService: MessageService,
    private teamService: TeamService,
    private af: AngularFire) {
    this.messageCount = 0;
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.playerService.getPlayerAsync(this.playerService.selfId());

    this.messageService.getAllUnreadMessages().subscribe(messages => {
      this.messageCount = messages.length;
    })
  }

  addEventListeners() {
    document.addEventListener('serviceplayerready', e => {
      let playerId = e['detail'];
      if (playerId === this.playerService.selfId()) {
        this.player = this.playerService.getPlayer(playerId);
        if (this.player.teamId)
          this.teamService.getTeamAsync(this.player.teamId);
      }
    });

    document.addEventListener('serviceteamready', e => {
      let teamId = e['detail'];
      if (this.player && this.player.teamId === teamId)
        this.team = this.teamService.getTeam(teamId);
    });
  }

  goEditPlayerPage() {
    this.navCtrl.push(EditPlayerPage);
  }

  goSwitchTeamPage() {
    this.navCtrl.push(ManageTeamPage);
  }

  goPlayerPage() {
    this.navCtrl.push(MyPlayerPage, { id: this.player.id });
  }

  goFeedbackPage() {
    this.navCtrl.push(FeedbackPage);
  }

  goTeamPage() {
    this.navCtrl.push(MyTeamPage, { id: this.player.teamId });
  }

  goMessagesPage() {
    this.navCtrl.push(MessagesPage);
  }

  createTeam() {
    this.modalCtrl.create(CreateTeamPage).present();
  }

  onLogout() {
    this.af.auth.logout();
  }
}
