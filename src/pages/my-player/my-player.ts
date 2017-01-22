import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlayerService} from '../../app/players/player.service'
import {Player} from '../../app/players/player.model'

@Component({
  selector: 'page-my-player',
  templateUrl: 'my-player.html',
})
export class MyPlayerPage {
  id;
  player = new Player();
  //af
  NumOfLikes : number;
  NumOfUnLikes : number;
  PercentOfLikes : number;
  PercentOfUnLikes : number;

  constructor(private nav: NavController,
  private service : PlayerService,
  private navParams: NavParams) {
    var fromDBLikes = 213;
    var fromDBUnLikes = 67;
    this.NumOfLikes = fromDBLikes;
    this.NumOfUnLikes = fromDBUnLikes;
    this.PercentOfLikes = fromDBLikes/(fromDBLikes+fromDBUnLikes) * 100;
    this.PercentOfUnLikes = fromDBUnLikes/ (fromDBLikes+fromDBUnLikes) * 100;
  }

  ionViewDidLoad() {
    document.addEventListener('serviceplayerdataready', e => {
      let id = e['detail'];
      if (this.id === id)
        this.player = this.service.getPlayer(id);
    })

    this.id = this.navParams.get('id');
    this.service.getPlayerAsync(this.id);
    this.service.increasePopularity(this.id);
  }
}
