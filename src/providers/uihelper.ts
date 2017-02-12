import { Injectable} from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Localization} from './localization'

@Injectable()
export class UIHelper {
  constructor(private toastCtrl: ToastController,
  private loc : Localization) {
  }

  presentToast(msgId, duraiton = 3000) {
      let msg = this.loc.getString(msgId);
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duraiton
    });
    toast.present();
  }
}
