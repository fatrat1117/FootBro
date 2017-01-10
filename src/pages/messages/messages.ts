import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { PlayerBasic } from '../../app/players/shared/player.model'
import { TeamBasic } from '../../app/teams/shared/team.model'

import { PlayerService } from '../../app/players/shared/player.service'
import { TeamService } from '../../app/teams/shared/team.service'
import { MyTeamPage } from "../my-team/my-team";
import { EditPlayerPage } from "../edit-player/edit-player";
import { ManageTeamPage } from "../manage-team/manage-team";
import { MyPlayerPage } from "../my-player/my-player";
import { FeedbackPage } from "../feedback/feedback";

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {

  constructor(private navCtrl: NavController) {
  }

  markAsRead(slidingItem) {
    slidingItem.close();
  }
}
