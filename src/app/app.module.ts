import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { RankPage } from '../pages/rank/rank';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TransPipe, Localization } from '../providers/localization';
import { StringToDatePipe, NumberToTimePipe } from '../pipes/moment.pipe';
import { MePage } from "../pages/me/me";
import { MyPlayerPage } from "../pages/my-player/my-player";
import { MatchesPage } from "../pages/matches/matches";
import { LuPrototypePage } from "../pages/my-player/lu-prototype";
import { JixiangPrototypePage } from "../pages/my-player/jixiang-prototype";

// components
import { SbLoadingComponent } from './common/loading.component';
import { SbMatchBasicComponent } from './matches/match-basic.component';

@NgModule({
  declarations: [
    MyApp,
    RankPage,
    ContactPage,
    HomePage,
    TabsPage,
    MePage,
    MyPlayerPage,
    JixiangPrototypePage,
    LuPrototypePage,
    MatchesPage,
    // pipes
    TransPipe,
    StringToDatePipe,
    NumberToTimePipe,
    // components
    SbLoadingComponent,
    SbMatchBasicComponent,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RankPage,
    ContactPage,
    HomePage,
    TabsPage,
    MePage,
    MyPlayerPage,
    JixiangPrototypePage,
    LuPrototypePage,
    MatchesPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Localization]
})
export class AppModule { }
