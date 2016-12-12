import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { RankPage } from '../pages/rank/rank';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TransPipe, Localization } from '../providers/localization';
import {MePage} from "../pages/me/me";

@NgModule({
  declarations: [
    MyApp,
    RankPage,
    ContactPage,
    HomePage,
    TabsPage,
    TransPipe,
    MePage
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
    MePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Localization]
})
export class AppModule {}
