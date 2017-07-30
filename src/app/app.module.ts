import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Transfer } from '@ionic-native/transfer'; 
import { File } from '@ionic-native/file';
import { MyErrorHandler } from '../providers/exception-handler'
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { MyApp } from './app.component';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { RankPage } from '../pages/rank/rank';
import { HomePage } from '../pages/home/home';
import { ModalContentPage } from '../pages/home/place-selection';
import { TabsPage } from '../pages/tabs/tabs';
import { MePage } from "../pages/me/me";
import { MessagesPage } from "../pages/messages/messages";
import { ChatPage } from "../pages/chat/chat";
import { EditPlayerPage } from "../pages/edit-player/edit-player";
import { EditPlayerNamePage } from "../pages/edit-player/edit-player-name";
import { EditPlayerHeightPage } from "../pages/edit-player/edit-player-height";
import { EditPlayerWeightPage } from "../pages/edit-player/edit-player-weight";
import { EditPlayerPositionPage } from "../pages/edit-player/edit-player-position";
import { EditPlayerFootPage } from "../pages/edit-player/edit-player-foot";
import { EditPlayerDescriptionPage } from "../pages/edit-player/edit-player-description";
import { EditTeamPage } from "../pages/edit-team/edit-team";
import { EditTeamNamePage } from "../pages/edit-team/edit-team-name";
import { ManageTeamPage } from "../pages/manage-team/manage-team";
import { LeagueInfoPage } from "../pages/league-info/league-info";
import { LeagueResultPage } from "../pages/league-result/league-result";
import { MyPlayerPage } from "../pages/my-player/my-player";
import { FeedbackPage } from "../pages/feedback/feedback";
import { MatchesPage } from "../pages/matches/matches";
import { MatchRulesPage } from "../pages/matches/match-rules";
import { MatchListPage } from "../pages/match-list/match-list";
import { CheeringTeamPage } from "../pages/cheering-team/cheering-team";
import { CheeringTeamStatsPage } from "../pages/cheering-team/cheering-team-stats";
import { MyTeamPage } from "../pages/my-team/my-team";
import { LoginPage } from '../pages/login/login';
import { GameSchedulePage } from "../pages/game-schedule/game-schedule";
import { NewGamePage } from "../pages/new-game/new-game";
import { CreateTeamPage } from '../pages/create-team/create-team';
import { SearchTeamPage } from '../pages/search-team/search-team';
import { SearchPlayerPage } from '../pages/search-player/search-player';
import { SearchMatchPage } from '../pages/search-match/search-match';
import { UpdateGamePage } from '../pages/update-game/update-game';
import { SquadPage } from '../pages/squad/squad';
import { EditSquadPage } from '../pages/edit-squad/edit-squad';
import { SharePage } from '../pages/share/share';
import { EditGameRatingPage } from '../pages/edit-game-rating/edit-game-rating';
import { SquadSelectPage } from '../pages/squad-select/squad-select';
import { ManageSquadPage } from '../pages/manage-squad/manage-squad';
import { TeamPlayersPage } from '../pages/team-players/team-players';
import { ColorPickerPage} from '../pages/color-picker/color-picker';
import { EditPositionPage } from '../pages/edit-position/edit-position';
import { TrainingPage } from '../pages/training/training';

// services
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FirebaseManager } from '../providers/firebase-manager';
import { LocalStorage } from '../providers/local-storage';
import { OneSignalManager } from '../providers/onesignal-manager';
import { UIHelper } from '../providers/uihelper';
import { PlayerService } from './players/player.service';
import { TeamService } from './teams/team.service';
import { MatchService } from './matches/match.service';
import { MessageService } from './messages/message.service';
import { CheerleaderService } from './cheerleaders/cheerleader.service';
import { RankService } from './rank/rank.service';

// pipes
import { TransPipe, Localization } from '../providers/localization';
import { StringToDatePipe, NumberToTimePipe, MomentPipe, StringToYearOnlyPipe } from '../pipes/moment.pipe';
import { TeamBasicPipe } from '../pipes/team.pipe';
import { ReversePipe, MapToArrayPipe, GroupThreePipe, GroupNPipe,IfNullThenZeroPipe, SafePipe} from '../pipes/utilities.pipe';

// components
import { SbLoadingComponent } from './common/loading.component';
import { SbRateCircleComponent } from './common/rate.circle.component';
import { SbModalNavbarComponent } from './common/modal.navbar.component';
import { SbShareButtonComponent } from './common/share.button.component';
import { SbMatchBasicComponent } from './matches/match-basic.component';
import { MatchDetailPage } from "../pages/match-detail/match-detail";
import { GameRatingPage } from "../pages/game-rating/game-rating";
import { NoRecordComponent } from './common/no.record.component';
import { ResultScoreComponent } from './common/result.score.component';
import { SbReportButton } from './common/report.button'
import { ManagePlayerPopover } from '../pages/team-players/manage-players-menu';
import { SbCupTeamComponent } from './common/cup.team.component';
import { FAQComponent} from './common/faq.component';

// directives
//import { KeyboardAttachDirective } from '../providers/keyboard-attach.directive';

//native
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Camera } from '@ionic-native/camera';
import { Badge } from '@ionic-native/badge';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';
import { OneSignal } from '@ionic-native/onesignal';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Screenshot } from '@ionic-native/screenshot';
import { Clipboard } from '@ionic-native/clipboard';

export const firebaseConfig = {
  apiKey: "AIzaSyCrhL6g6rHs7-X09jw5Oq8I_g0fspD8bf8",
    authDomain: "project-3416565325366537224.firebaseapp.com",
    databaseURL: "https://project-3416565325366537224.firebaseio.com",
    projectId: "project-3416565325366537224",
    storageBucket: "project-3416565325366537224.appspot.com",
    messagingSenderId: "149844388984"
};

@NgModule({
  declarations: [
    MyApp,
    TutorialPage,
    RankPage,
    HomePage,
    TabsPage,
    LeagueInfoPage,
    LeagueResultPage,
    MePage,
    MessagesPage,
    ChatPage,
    EditPlayerPage,
    EditPlayerNamePage,
    EditPlayerHeightPage,
    EditPlayerWeightPage,
    EditPlayerPositionPage,
    EditPlayerFootPage,
    EditPlayerDescriptionPage,
    EditTeamPage,
    EditTeamNamePage,
    ManageTeamPage,
    MyPlayerPage,
    FeedbackPage,
    MatchesPage,
    MatchRulesPage,
    MatchListPage,
    MatchDetailPage,
    CheeringTeamPage,
    CheeringTeamStatsPage,
    MyTeamPage,
    LoginPage,
    GameSchedulePage,
    NewGamePage,
    ModalContentPage,
    GameRatingPage,
    CreateTeamPage,
    SearchTeamPage,
    SearchPlayerPage,
    SearchMatchPage,
    UpdateGamePage,
    SquadPage,
    EditSquadPage,
    SharePage,
    EditGameRatingPage,
    SquadSelectPage,
    ManageSquadPage,
    TeamPlayersPage,
    EditPositionPage,
    TrainingPage,
    // pipes
    TransPipe,
    StringToDatePipe,
    NumberToTimePipe,
    MomentPipe,
    TeamBasicPipe,
    ReversePipe,
    MapToArrayPipe,
    GroupThreePipe,
    GroupNPipe,
    StringToYearOnlyPipe,
    IfNullThenZeroPipe,
    SafePipe,
    // components
    SbLoadingComponent,
    SbRateCircleComponent,
    SbModalNavbarComponent,
    SbShareButtonComponent,
    SbMatchBasicComponent,
    NoRecordComponent,
    ResultScoreComponent,
    SbReportButton,
    ManagePlayerPopover,
    SbCupTeamComponent,
    FAQComponent,
    ColorPickerPage,
    // directives
    //KeyboardAttachDirective,
  ],
  imports: [
    BrowserModule,
    YoutubePlayerModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      backButtonText: ''
    }),
    RoundProgressModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    /*
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA9L3ja5ZcViqTc5Tgz8tG6QvJGlYO-fa4',
      libraries: ["places"]
    }),
    */
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TutorialPage,
    RankPage,
    HomePage,
    LeagueInfoPage,
    LeagueResultPage,
    TabsPage,
    MePage,
    MessagesPage,
    ChatPage,
    EditPlayerPage,
    EditPlayerNamePage,
    EditPlayerHeightPage,
    EditPlayerWeightPage,
    EditPlayerPositionPage,
    EditPlayerFootPage,
    EditPlayerDescriptionPage,
    EditTeamPage,
    EditTeamNamePage,
    ManageTeamPage,
    MyPlayerPage,
    FeedbackPage,
    MatchesPage,
    MatchRulesPage,
    MatchListPage,
    MatchDetailPage,
    CheeringTeamPage,
    CheeringTeamStatsPage,
    MyTeamPage,
    LoginPage,
    GameSchedulePage,
    NewGamePage,
    ModalContentPage,
    GameRatingPage,
    CreateTeamPage,
    SearchTeamPage,
    SearchPlayerPage,
    SearchMatchPage,
    UpdateGamePage,
    SquadPage,
    EditSquadPage,
    SharePage,
    EditGameRatingPage,
    SquadSelectPage,
    ManageSquadPage,
    TeamPlayersPage,
    ManagePlayerPopover,
    FAQComponent,
    ColorPickerPage,
    EditPositionPage,
    TrainingPage,
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    FirebaseManager,
    LocalStorage,
    OneSignalManager,
    Localization,
    UIHelper,
    PlayerService,
    TeamService,
    MatchService,
    MessageService,
    CheerleaderService,
    RankService,
    Camera,
    LaunchNavigator,
    Badge,
    Transfer,
    File,
    SplashScreen,
    Keyboard,
    StatusBar,
    OneSignal,
    SocialSharing,
    Screenshot,
    Clipboard],
})
export class AppModule {
}
