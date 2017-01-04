import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { RankPage } from '../rank/rank';
//import { ContactPage } from '../contact/contact';
import { MatchesPage } from '../matches/matches';
import { MePage } from '../me/me';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = RankPage;
  tab3Root: any = MatchesPage;
  tab4Root: any = MePage;

  constructor() {
  }
}
