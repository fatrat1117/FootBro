import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { MyApp } from './app.component';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { RankPage } from '../pages/rank/rank';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MePage } from "../pages/me/me";
import { EditPlayerPage } from "../pages/edit-player/edit-player";
import { EditPlayerNamePage } from "../pages/edit-player/edit-player-name";
import { EditPlayerHeightPage } from "../pages/edit-player/edit-player-height";
import { EditPlayerWeightPage } from "../pages/edit-player/edit-player-weight";
import { EditPlayerPositionPage } from "../pages/edit-player/edit-player-position";
import { EditPlayerFootPage } from "../pages/edit-player/edit-player-foot";
import { EditPlayerDescriptionPage } from "../pages/edit-player/edit-player-description";
import { ManageTeamPage } from "../pages/manage-team/manage-team";
import { NewTeamPage } from "../pages/manage-team/new-team";
import { MyPlayerPage } from "../pages/my-player/my-player";
import { FeedbackPage } from "../pages/feedback/feedback";
import { MatchesPage } from "../pages/matches/matches";
import { CheeringTeamPage } from "../pages/cheering-team/cheering-team";

// services
import { PlayerService } from './players/shared/player.service';
import { TeamService } from './teams/shared/team.service';

// pipes
import { TransPipe, Localization } from '../providers/localization';
import { StringToDatePipe, NumberToTimePipe } from '../pipes/moment.pipe';
import { TeamBasicPipe } from '../pipes/team.pipe'

// components
import { SbLoadingComponent } from './common/loading.component';
import { SbModalNavbarComponent } from './common/modal.navbar.component';
import { SbMatchBasicComponent } from './matches/match-basic.component';

@NgModule({
  declarations: [
    MyApp,
    TutorialPage,
    RankPage,
    ContactPage,
    HomePage,
    TabsPage,
    MePage,
    EditPlayerPage,
    EditPlayerNamePage,
    EditPlayerHeightPage,
    EditPlayerWeightPage,
    EditPlayerPositionPage,
    EditPlayerFootPage,
    EditPlayerDescriptionPage,
    ManageTeamPage,
    NewTeamPage,
    MyPlayerPage,
    FeedbackPage,
    MatchesPage,
    CheeringTeamPage,
    // pipes
    TransPipe,
    StringToDatePipe,
    NumberToTimePipe,
    TeamBasicPipe,
    // components
    SbLoadingComponent,
    SbModalNavbarComponent,
    SbMatchBasicComponent,
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true
    }),
    RoundProgressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TutorialPage,
    RankPage,
    ContactPage,
    HomePage,
    TabsPage,
    MePage,
    EditPlayerPage,
    EditPlayerNamePage,
    EditPlayerHeightPage,
    EditPlayerWeightPage,
    EditPlayerPositionPage,
    EditPlayerFootPage,
    EditPlayerDescriptionPage,
    ManageTeamPage,
    NewTeamPage,
    MyPlayerPage,
    FeedbackPage,
    MatchesPage,
    CheeringTeamPage,
  ],
  providers: [ { provide: ErrorHandler, useClass: IonicErrorHandler }, Localization, PlayerService, TeamService ]
})
export class AppModule {
}
