import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';
import { Screenshot, SocialSharing } from 'ionic-native';

declare var Wechat: any;

@Component({
  selector: 'page-squad-select',
  templateUrl: 'squad-select.html'
})
export class SquadSelectPage {

  squadNumber : Number;
  selectedSquad : String;
  sampleFiveList:String[] = ["1-1-1-1","1-2-1","2-1-1","1-1-2","2-2-0","2-0-2"];
  sampleSevenList:String[] = ["3-1-2","3-2-1","2-2-2","2-3-1","2-1-3",
  "4-1-1"];
  sampleElevenList:String[] = ["4-4-2","4-5-1","4-3-3","4-2-4","3-5-2",
  "5-4-1"];
  constructor(private viewCtrl: ViewController,private navParams: NavParams) {

  }

  ngOnInit() {
    if (this.navParams.data) {
      this.squadNumber = this.navParams.data.select;
      console.log(this.squadNumber);
    }
  }

   dismiss() {
    this.viewCtrl.dismiss(
       this.selectedSquad
    );
  }


  squadSelect(event :any){

     let raw = event.target.innerHTML;
     this.selectedSquad = raw.trim();
     this.dismiss();
  }


}
