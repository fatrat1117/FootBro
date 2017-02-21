import { Injectable} from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Localization} from './localization';
import * as moment from 'moment';

@Injectable()
export class UIHelper {
  constructor(private toastCtrl: ToastController,
  private loc : Localization) {
  }

  presentToast(msgId, dur = 3000) {
      let msg = this.loc.getString(msgId);
    console.log(msg, this.toastCtrl);
    
    let toast = this.toastCtrl.create({
      message: msg,
      duration: dur,
      position: 'top'
    });
    toast.present();
  }

  //time converter
  numberToDateString(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  numberToTimeString(time) {
    return moment(time).format('HH:mm');
  }

  dateTimeStringToNumber(time) {
    return moment(time).unix() * 1000;
  }
}
