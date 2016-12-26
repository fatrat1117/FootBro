import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { MyApp } from './app.component';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { RankPage } from '../pages/rank/rank';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TransPipe, Localization } from '../providers/localization';
import { StringToDatePipe, NumberToTimePipe } from '../pipes/moment.pipe';
import { MePage } from "../pages/me/me";
import { EditPlayerPage } from "../pages/edit-player/edit-player";
import { EditPlayerNamePage } from "../pages/edit-player/edit-player-name";
import { EditPlayerHeightPage } from "../pages/edit-player/edit-player-height";
import { EditPlayerWeightPage } from "../pages/edit-player/edit-player-weight";
import { EditPlayerPositionPage } from "../pages/edit-player/edit-player-position";
import { EditPlayerFootPage } from "../pages/edit-player/edit-player-foot";
import { EditPlayerDescriptionPage } from "../pages/edit-player/edit-player-description";
import { EditTeamPage } from "../pages/edit-team/edit-team";
import { MyPlayerPage } from "../pages/my-player/my-player";
import { FeedbackPage } from "../pages/feedback/feedback";
import { MatchesPage } from "../pages/matches/matches";
import { LuPrototypePage } from "../pages/my-player/lu-prototype";
import { JixiangPrototypePage } from "../pages/my-player/jixiang-prototype";

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
    EditTeamPage,
    MyPlayerPage,
    JixiangPrototypePage,
    LuPrototypePage,
    FeedbackPage,
    MatchesPage,
    // pipes
    TransPipe,
    StringToDatePipe,
    NumberToTimePipe,
    // components
    SbLoadingComponent,
    SbModalNavbarComponent,
    SbMatchBasicComponent,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
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
    EditTeamPage,
    MyPlayerPage,
    JixiangPrototypePage,
    LuPrototypePage,
    FeedbackPage,
    MatchesPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Localization]
})
export class AppModule {
}
