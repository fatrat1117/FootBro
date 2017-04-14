import { Component, Input } from '@angular/core';
import { OneSignalManager } from '../../providers/onesignal-manager'
import { AlertController} from 'ionic-angular';
import { Localization } from '../../providers/localization'

@Component({
  selector: 'sb-report-button',
  template: `
  <button ion-button color="danger" block (click) = "onReport()">{{'reportobjectionalbecontent' | trans}}</button>
  `
})

export class SbReportButton {
  @Input() reportId;

  constructor(private osm : OneSignalManager,
    private alertCtrl : AlertController,
    private loc : Localization) {
  }

  report() {
    this.osm.sendFeedBack(this.reportId + ' : ' + this.loc.getString('reportobjectionalbecontent'));
  }

  onReport() {
    let confirm = this.alertCtrl.create({
      subTitle: this.loc.getString('reportobjectionalbecontent'),
      message: this.loc.getString('systemadminsdealwithreport'),
      buttons: [
        {
          text: this.loc.getString('Cancel'),
          handler: () => {
          }
        },
        {
          text: this.loc.getString('OK'),
          handler: () => {
            this.report();
          }
        }
      ]
    });
    confirm.present();
  }
}