import { Component, ViewChild} from '@angular/core';
import {NavController, ModalController, Tabs, LoadingController} from 'ionic-angular';
import { HomePage } from '../home/home';
import { RankPage } from '../rank/rank';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { MatchesPage } from '../matches/matches';
import { MePage } from '../me/me';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  @ViewChild('mainTabs') tabRef: Tabs;

  tab1Root: any = HomePage;
  tab2Root: any = RankPage;
  tab3Root: any = MatchesPage;
  tab4Root: any = null;

  constructor(private af: AngularFire,
  private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.af.auth.subscribe(auth => {
      console.log('firebase auth', auth);
      if (auth) {
        this.tab4Root = MePage;
      } else {
        this.tabRef.select(0);
        this.tab4Root = null;
      }
    }
    );
  }

  popupLoginPage() {
    console.log('popupLoginPage');
    
    let loginPage = this.modalCtrl.create(LoginPage);
    console.log(loginPage);
    
    loginPage.present();
  }

  checkLogin() {
    console.log('checkLogin', this.af.auth.getAuth());
    if (null == this.af.auth.getAuth()) {
      this.popupLoginPage();
    }
  }
}
