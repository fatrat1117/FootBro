import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MyTeamService} from '../../app/my-team/my-team.service'
import {MyTeam} from '../../app/my-team/my-team.model'

@Component({
  selector: 'page-my-team',
  templateUrl: 'my-team.html'
})
export class MyTeamPage {
  first = [];
  id;
  team : MyTeam = new MyTeam();

  constructor(public navCtrl: NavController, 
  private navParams: NavParams,
  private service: MyTeamService) {
    this.first = [
      {
        'win': '7',
        'tie': '3',
        'lose': '6',
      }
    ]
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.id = this.navParams.get('id');
    this.service.increasePopularity(this.id);
    this.service.getMyTeamAsync(this.id);
  }

  addEventListeners() {
    document.addEventListener('ServiceMyTeamDataReady', e => {
      //console.log(e);
      let teamId = e['detail'];
      //console.log(teamId, this.id);
      if (teamId === this.id) {
        this.team = this.service.getMyTeam(teamId);
        //console.log(this.team);
      }
    });
  }

  //打开邀请
  invitePlayer() {
    alert("invite");
  }

  //打开修改
  openModify() {
    alert("modify");
  }

  //查看更多球队赛程
  seeMoreTeamGamePlan() {
    alert("see more team game plan");
  }

  //查看更多球队成员
  seeMoreTeamMember() {
    alert("see more team member");
  }

  //切换函数
  //最近15场 最近20场 全部
  setChoosePosition(position) {
    //3个选项页
    var recent15 = document.getElementById("recent15");
    var recent20 = document.getElementById("recent20");
    var all = document.getElementById("all");
    //三个按钮
    var btnRecent15 = document.getElementById("btn-recent-15");
    var btnRecent20 = document.getElementById("btn-recent-20");
    var btnAll = document.getElementById("btn-all");
    //三条横线
    var firstLine = document.getElementById("firstLine");
    var secondLine = document.getElementById("secondLine");
    var thirdLine = document.getElementById("thirdLine");
    //都设置为默认样式
    recent15.setAttribute("class", "team-all-game-unchoose");
    recent20.setAttribute("class", "team-all-game-unchoose");
    all.setAttribute("class", "team-all-game-unchoose");
    btnRecent15.style.color = "#999999";
    btnRecent20.style.color = "#999999";
    btnAll.style.color = "#999999";
    firstLine.style.backgroundColor = "#555555";
    secondLine.style.backgroundColor = "#555555";
    thirdLine.style.backgroundColor = "#555555";

    switch (position) {
      case 0:
        recent15.setAttribute("class", "team-all-game-choose");
        btnRecent15.style.color = "white";
        firstLine.style.backgroundColor = "yellow";
        this.setSuccessRate(90);
        break;
      case 1:
        recent20.setAttribute("class", "team-all-game-choose");
        btnRecent20.style.color = "white";
        secondLine.style.backgroundColor = "yellow";
        this.setSuccessRate(27.5);
        break;
      case 2:
        all.setAttribute("class", "team-all-game-choose");
        btnAll.style.color = "white";
        thirdLine.style.backgroundColor = "yellow";
        this.setSuccessRate(30);
        break;
    }

  }

  //根据胜率设置图像例如90%
  setSuccessRate(successRate) {
    var backCircle1 = document.getElementById("backCircle1");
    var backCircle2 = document.getElementById("backCircle2");
    if (successRate <= 50) {
      var angle = -360 * successRate / 100;
      backCircle2.style.transform = "rotate(" + angle + "deg)";
      backCircle2.style.backgroundColor = "#a4a4a4";
    } else {
      var angle = 180 - 360 * successRate / 100;
      backCircle2.style.transform = "rotate(" + angle + "deg)";
      backCircle2.style.backgroundColor = "green";
    }
    var successRateText = document.getElementById("success-rate-text");
    successRateText.innerHTML = successRate + "%";
    //显示百分比数字并调整相对位置
    if (this.getByteLen(successRate + "%")>4) {
      successRateText.style.fontSize="3.5rem";
      successRateText.style.marginTop="0px";
    }else{
      successRateText.style.fontSize="4.5rem";
      successRateText.style.marginTop="-10px";
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

}
