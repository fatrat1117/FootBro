import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';


@Component({
  selector: 'page-my-player',
  templateUrl: 'my-player.html',
})
export class MyPlayerPage {
  pId: any;
  //af
  afBasic: any;
  afDetail: any;
  afPublic: any;
  secretCount = 0;
  // Radar
  public radarChartLabels:string[];

  public radarChartData:any = [
    [20, 20, 20, 20, 20, 20],
  ];
  public radarChartType:string = 'radar';
  public radarOptions = { legend: { display: false }};

  constructor(private nav: NavController) {

  }

}
