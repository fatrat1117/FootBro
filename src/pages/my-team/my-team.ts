import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TeamService } from '../../app/teams/team.service'
import { Team, TeamStat } from '../../app/teams/team.model'
import { TeamPlayersService } from '../../app/teams/teamplayers.service'

@Component({
  selector: 'page-my-team',
  templateUrl: 'my-team.html'
})
export class MyTeamPage {
  first = [];
  id;
  team: Team = new Team();
  currTeamStat;
  selectedStatIndex = 0;
  players;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private service: TeamService,
    private teamPlayersService: TeamPlayersService) {
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
    this.service.getTeamAsync(this.id);
  }

  addEventListeners() {
    document.addEventListener('serviceteamready', e => {
      //console.log(e);
      let teamId = e['detail'];
      //console.log(teamId, this.id);
      if (teamId === this.id) {
        this.team = this.service.getTeam(teamId);
        this.teamPlayersService.getTeamPlayersAsync(teamId);
        this.setChoosePosition(this.selectedStatIndex);
      }
    });

    document.addEventListener('serviceteamplayersready', e => {
      let teamId = e['detail'];
      //console.log(teamId, this.id);
      if (teamId === this.id) {
        this.players = this.teamPlayersService.getTeamPlayers(teamId);
        console.log(this.players);
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
    //console.log(this);
    //3个选项页
    var recent15 = document.getElementById("recent15");
    //this page is not shown
    if (!recent15)
      return;
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
        this.currTeamStat = this.team.last_15;
        recent15.setAttribute("class", "team-all-game-choose");
        btnRecent15.style.color = "white";
        firstLine.style.backgroundColor = "yellow";
        break;
      case 1:
        this.currTeamStat = this.team.last_30;
        recent20.setAttribute("class", "team-all-game-choose");
        btnRecent20.style.color = "white";
        secondLine.style.backgroundColor = "yellow";
        break;
      case 2:
        this.currTeamStat = this.team.overall;
        all.setAttribute("class", "team-all-game-choose");
        btnAll.style.color = "white";
        thirdLine.style.backgroundColor = "yellow";
        break;
    }
    //console.log(this.currTeamStat);
    this.selectedStatIndex = position;
    //this.setSuccessRate(Math.round(this.currTeamStat.rate * 100));
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
    if (this.getByteLen(successRate + "%") > 4) {
      successRateText.style.fontSize = "3.5rem";
      successRateText.style.marginTop = "0px";
    } else {
      successRateText.style.fontSize = "4.5rem";
      successRateText.style.marginTop = "-10px";
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

  getCircleBkColor(result) {
    let style: any = {};
    switch (result) {
      case 'W':
        style.background = '#00ff00';
        break;
      case 'L':
        style.background = '#8c8c8c';
        break;
      default:
        style.background = '#01c5ff';
        break;
    }
    return style;
  }

  getCircleTextColor(result) {
    let style: any = {};
    switch (result) {
      case 'W':
        style.color = '#00ff00';
        break;
      case 'L':
        style.color = '#8c8c8c';
        break;
      default:
        style.color = '#01c5ff';
        break;
    }
    return style;
  }
}
