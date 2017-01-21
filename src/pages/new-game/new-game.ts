import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';


@Component({
    selector: 'page-new-game',
    templateUrl: 'new-game.html'
})
export class NewGamePage {
    players = [];


    constructor(public navCtrl: NavController) {
        for (var i = 0; i < 4; i++) {
            this.players[i] = {
                name: i,
                items: [],
                hidden: true,
                showExpandableIcon: "ios-arrow-down"
            };
            for (var j = 0; j < 3; j++) {
                // this.players[i].items.push(i + '-' + j);
                this.players[i].items = [
                    {
                        name: "进球",
                        number: 5,
                        icon: "assets/icon/b2.png",
                        color:"light"
                    },
                    {
                        name: "助攻",
                        number: 1,
                        icon: "assets/icon/b3.png",
                        color:"light"
                    },
                    {
                        name: "红牌",
                        number: 2,
                        icon: "assets/icon/b2.png",
                        color:"light"
                    },
                    {
                        name: "黄牌",
                        number: 4,
                        icon: "assets/icon/b2.png",
                        color:"light"
                    },

                ];
            }
        }
    }


    //根据胜率设置图像例如90%
    setSuccessRate(successRate) {
        var backCircle1 = document.getElementById("backCircle1");
        var backCircle2 = document.getElementById("backCircle2");
        if (successRate <= 50) {
            var angle = -360 * successRate / 100;
            backCircle2.style.transform = "rotate(" + angle + "deg)";
            backCircle2.style.backgroundColor = "#9e9e9e";
        } else {
            var angle = 180 - 360 * successRate / 100;
            backCircle2.style.transform = "rotate(" + angle + "deg)";
            backCircle2.style.backgroundColor = "green";
        }
    }

    //获取字符串长度
    getByteLen(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            }
            else {
                len += 1;
            }
        }
        return len;
    }
    //显示或关闭队员得分详情
    clickTeamMember(player) {
        if (player.hidden) {
            player.showExpandableIcon = "ios-arrow-up";
            for (var i = 0; i < this.players.length; i++) {
                for(var j=0;j<this.players[i].items.length;j++){
                    if(this.players[i].items[j].number<=0){
                        this.players[i].items[j].color="light";
                    }else{
                        this.players[i].items[j].color="secondary";
                    }
                }
            }
        } else {
            player.showExpandableIcon = "ios-arrow-down";
        }
        player.hidden = !player.hidden;
    }
    //删除球员
    deleteTeamPlayer(player) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i] == player) {
                this.players.splice(i, 1);
                break;
            }
        }
    }
    //减少得分
    minusScore(item){
        if(item.number>0) {
            item.number = item.number - 1;
            if(item.number == 0){
                item.color="light";
            }else{
                item.color="secondary";
            }
        }
    }
    //增加得分
    addScore(item){
        item.number = item.number+1;
        item.color="secondary";
    }
    //更新数据
    openUpdate(){
        alert("update");
    }
    //右上角删除
    openDelete(){
        alert("delete");
    }



}