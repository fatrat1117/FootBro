import { Component } from '@angular/core';
import { NavController, ModalController,PopoverController } from 'ionic-angular';
import { FirebaseManager } from '../../providers/firebase-manager';
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
import { MessageService } from '../../app/messages/message.service'
import { SearchTeamPage } from '../search-team/search-team'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FAQComponent } from '../../app/common/faq.component';
import { Localization } from '../../providers/localization'

@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
  providers: [MessageService, InAppBrowser],
})
export class MePage {
  player: Player;
  team: Team;
  messageCount: number;
  onPlayerReady;
  onTeamReady;
  isCheerleader = false;
  pointsFAQPage:any;

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private messageService: MessageService,
    private teamService: TeamService,
    private fm: FirebaseManager,
    private iab: InAppBrowser, private popoverCtrl: PopoverController,
              private loc : Localization) {
    this.messageCount = 0;
  }

  ionViewDidLoad() {
    //console.log('MePage Loaded');
    this.addEventListeners();
    this.playerService.getPlayerAsync(this.playerService.selfId());
  }

  ionViewWillUnload() {
    //console.log('MePage unload');
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
    document.removeEventListener('serviceteamready', this.onTeamReady);
  }

  addEventListeners() {
    this.onPlayerReady = e => {
      let playerId = e['detail'];
      //console.log(playerId, this.playerService.selfId());
      if (playerId === this.playerService.selfId()) {
        this.player = this.playerService.getPlayer(playerId);
        this.isCheerleader = this.player.role == 'cheerleader';
        if (this.player.teamId)
          this.teamService.getTeamAsync(this.player.teamId);
      }
    };

    this.onTeamReady = e => {
      let teamId = e['detail'];
      if (this.player && this.player.teamId === teamId)
        this.team = this.teamService.getTeam(teamId);
    };

    document.addEventListener('serviceplayerready', this.onPlayerReady);
    document.addEventListener('serviceteamready', this.onTeamReady);
  }

  goEditPlayerPage(event) {
    // event.stopPropagation();
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
  // createTeam() {
  //   this.modalCtrl.create(CreateTeamPage).present();
  // }

  joinTeam() {
    let searchTeamModal = this.modalCtrl.create(SearchTeamPage);
    searchTeamModal.onDidDismiss(data => {
      if (data) {
        this.teamService.joinTeam(data.team.id, true);
      }
    });
    searchTeamModal.present();
  }

  onLogout() {
    this.fm.logout();
  }

  // migrateData() {
  //   this.fm.migrateData();
  // }

  openFAQPage() {
    this.iab.create('https://www.facebook.com/notes/soccerbro-studio/faq/792767360879298/');
  }

  openWebsite() {
    this.iab.create('https://www.soccerbrostudio.com/');
  }

  personalPointsFAQ(event){
    event.stopPropagation();
    let faqPage = this.popoverCtrl.create(FAQComponent, { title:this.loc.getString('personalPointsFAQTitle'),subtitle:"Subtitle",content:this.loc.getString('personalPointsFAQContent') }, { cssClass: 'points-faq-popover' });
    faqPage.present({
      ev: event
    });

    faqPage.onDidDismiss(e => {
      if (e) {
        console.log(e);
      }
    });
  }

  teamPointsFAQ(event){
    event.stopPropagation();
    let faqPage = this.popoverCtrl.create(FAQComponent, { title:this.loc.getString('teamPointsFAQTitle'),subtitle:"",content:this.loc.getString('teamPointsFAQContent')},{ cssClass:'points-faq-popover'} );
    faqPage.present({
      ev: event
    });

    faqPage.onDidDismiss(e => {
      if (e) {
        console.log(e);
      }
    });
  }
}
