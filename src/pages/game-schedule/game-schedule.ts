
import {NavController} from "ionic-angular";
import {Component} from "@angular/core";
@Component({
    selector: 'page-game-schedule',
    templateUrl: 'game-schedule.html'
})
export class GameSchedulePage {


    constructor(public navCtrl: NavController) {

    }

    //1:小组赛 2:八分之一决赛 3：4分之一决赛 4：半决赛 5：决赛
    setCurrentPosition(position){
        var line1=document.getElementById("line-one");
        var line2=document.getElementById("line-two");
        var line3=document.getElementById("line-three");
        var line4=document.getElementById("line-four");
        var button1=document.getElementById("button-one");
        var button2=document.getElementById("button-two");
        var button3=document.getElementById("button-three");
        var button4=document.getElementById("button-four");
        var button5=document.getElementById("button-five");
        var text1=document.getElementById("text-one");
        var text2=document.getElementById("text-two");
        var text3=document.getElementById("text-three");
        var text4=document.getElementById("text-four");
        var text5=document.getElementById("text-five");
        line1.style.backgroundColor="#307b36";
        line2.style.backgroundColor="#307b36";
        line3.style.backgroundColor="#307b36";
        line4.style.backgroundColor="#307b36";
        button1.style.backgroundColor="#307b36";
        button2.style.backgroundColor="#307b36";
        button3.style.backgroundColor="#307b36";
        button4.style.backgroundColor="#307b36";
        button5.style.backgroundColor="#307b36";
        text1.style.color="#307b36";
        text2.style.color="#307b36";
        text3.style.color="#307b36";
        text4.style.color="#307b36";
        text5.style.color="#307b36";
        switch (position){
            case 1:
                line1.style.backgroundColor="#00ff00";
                button1.style.backgroundColor="#00ff00";
                text1.style.color="#00ff00";
                break;
            case 2:
                line2.style.backgroundColor="#00ff00";
                button2.style.backgroundColor="#00ff00";
                text2.style.color="#00ff00";
                break;
            case 3:
                line3.style.backgroundColor="#00ff00";
                button3.style.backgroundColor="#00ff00";
                text3.style.color="#00ff00";
                break;
            case 4:
                line4.style.backgroundColor="#00ff00";
                button4.style.backgroundColor="#00ff00";
                text4.style.color="#00ff00";
                break;
            case 5:
                button5.style.backgroundColor="#00ff00";
                text5.style.color="#00ff00";
                break;
        }
    }
}