import { Component, ViewChild } from '@angular/core';
import { NavParams, ModalController, ViewController} from 'ionic-angular'
import { PlayerService } from '../../app/players/player.service'

@Component({
  selector: 'page-edit-position',
  templateUrl: 'edit-position.html'
})
export class EditPositionPage {
  position;
    @ViewChild('contentCtrl') contentCtrl;
  constructor(params: NavParams,
  private modal: ModalController,
  private viewCtrl: ViewController,
  private playerService: PlayerService) {
    this.position = params.get('position');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  selectPosition(pos) {
    this.playerService.updatePlayerDetail('position', pos);
    this.viewCtrl.dismiss({position: pos});
  }

  //ionViewDidLoad() {
    //console.log(this.contentCtrl);
  //}
}
