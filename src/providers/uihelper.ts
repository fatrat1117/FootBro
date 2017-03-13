import { Injectable} from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Localization} from './localization';
import * as moment from 'moment';

@Injectable()
export class UIHelper {
  constructor(private toastCtrl: ToastController,
  private loc : Localization) {
  }

  squadImageSize = 16;

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

  squadPercentToPx(squads, width, height) {
    let results = [];
    squads.forEach(s => {
      let r : any = {
        x: s.x * width / 100 - this.squadImageSize,
        y: s.y * height / 100 - this.squadImageSize,
      };
      if ('id' in s) 
        r.id = s.id;
      results.push(r);
    });

    return results;
  }

  squadPxToPercent(squad, width, height) {
    let results = [];
    squad.forEach(s => {
      let r : any = {
        x: Math.round((s.x + this.squadImageSize) * 100 / width),
        y: Math.round((s.y + this.squadImageSize) * 100 / height),
      };
      if ('id' in s) 
        r.id = s.id;
      results.push(r);
    });
    return results;
  }
}
