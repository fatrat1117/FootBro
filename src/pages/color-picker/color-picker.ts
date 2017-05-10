import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
  selector: 'page-color-picker',
  templateUrl: 'color-picker.html',
})
export class ColorPickerPage {
  colors: string[][];
  constructor(private viewCtrl: ViewController) {
    this.colors = [
      ['black', 'gray', 'blue', 'brown'],
      ['cyan', 'green', 'magenta', 'orange'],
      ['purple', 'red', 'white', 'yellow'],
      ['lightgray', 'lightgreen', 'lightblue', 'lightyellow'],
    ];
  }

  getColorStyle(color: string) {
    let style: any = {};
    style.background = color;
    if (color == 'white')
    {
      style.border = '1px solid lightgray';
    }

    return style;
  }

  selectedColor(color:string) {
    this.dismiss(color);
  }

  dismiss(color: string) {
    this.viewCtrl.dismiss({color: color});
  }
}
