import { Team } from '../teams/team.model';
import * as moment from 'moment';

export class MatchLocation {
  name;
  address;
  lat = 0;
  lng = 0;
}

export class Match {
  $key;
  id;
  date;
  time;
  homeId;
  awayId;
  home: Team;
  away: Team;
  homeScore;
  awayScore;
  homePenalty;
  awayPenalty;
  type = 11;
  tournamentId;
  groupId;
  location = new MatchLocation();
  createBy;
  isHomeUpdated;
  isAwayUpdated;
  homeSquad;
  awaySquad;
  dataReady = false;
  isStarted = function () {
    let now = moment().unix() * 1000;
    //console.log(now, this.time);
    return now > this.time;
  };
}

export const PREDEFINEDSQUAD = {
  442: [{
    x: 20,
    y: 10
  },
  {
    x: 80,
    y: 10
  },
  {
    x: 10,
    y: 40
  },
  {
    x: 37,
    y: 40
  },
  {
    x: 63,
    y: 40
  },
  {
    x: 90,
    y: 40
  },
  {
    x: 10,
    y: 70
  },
  {
    x: 37,
    y: 70
  },
  {
    x: 63,
    y: 70
  },
  {
    x: 90,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 433: [{
    x: 15,
    y: 10
  },
  {
    x: 50,
    y: 10
  },
  {
    x: 85,
    y: 10
  },
  {
    x: 15,
    y: 40
  },
  {
    x: 50,
    y: 40
  },
  {
    x: 85,
    y: 40
  },
  {
    x: 10,
    y: 70
  },
  {
    x: 37,
    y: 70
  },
  {
    x: 63,
    y: 70
  },
  {
    x: 90,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 352: [{
    x: 15,
    y: 10
  },
  {
    x: 85,
    y: 10
  },
  {
    x: 5,
    y: 40
  },
  {
    x: 27,
    y: 40
  },
  {
    x: 50,
    y: 40
  },
  {
    x: 73,
    y: 40
  },
  {
    x: 95,
    y: 40
  },
  {
    x: 15,
    y: 70
  },
  {
    x: 50,
    y: 70
  },
  {
    x: 85,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 451: [{
    x: 50,
    y: 10
  },
  {
    x: 5,
    y: 40
  },
  {
    x: 27,
    y: 40
  },
  {
    x: 50,
    y: 40
  },
  {
    x: 73,
    y: 40
  },
  {
    x: 95,
    y: 40
  },
  {
    x: 10,
    y: 70
  },
  {
    x: 37,
    y: 70
  },
  {
    x: 63,
    y: 70
  },
  {
    x: 90,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 4231: [{
    x: 50,
    y: 10
  },
  {
    x: 15,
    y: 30
  },
  {
    x: 50,
    y: 30
  },
  {
    x: 85,
    y: 30
  },
  {
    x: 20,
    y: 50
  },
  {
    x: 80,
    y: 50
  },
  {
    x: 10,
    y: 70
  },
  {
    x: 37,
    y: 70
  },
  {
    x: 63,
    y: 70
  },
  {
    x: 90,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 321: [{
    x: 50,
    y: 10
  },
  {
    x: 20,
    y: 40
  },
  {
    x: 80,
    y: 40
  },
  {
    x: 15,
    y: 70
  },
  {
    x: 50,
    y: 70
  },
  {
    x: 85,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 231: [{
    x: 50,
    y: 10
  },
  {
    x: 15,
    y: 40
  },
  {
    x: 50,
    y: 40
  },
  {
    x: 85,
    y: 40
  },
  {
    x: 20,
    y: 70
  },
  {
    x: 80,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 312: [{
    x: 20,
    y: 10
  },
  {
    x: 80,
    y: 10
  },
  {
    x: 50,
    y: 40
  },
  {
    x: 15,
    y: 70
  },
  {
    x: 50,
    y: 70
  },
  {
    x: 85,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 112: [{
    x: 20,
    y: 10
  },
  {
    x: 80,
    y: 10
  },
  {
    x: 50,
    y: 40
  },
  {
    x: 50,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 121: [{
    x: 50,
    y: 10
  },{
    x: 20,
    y: 40
  },
  {
    x: 80,
    y: 40
  },
  {
    x: 50,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 202: [{
    x: 20,
    y: 20
  },{
    x: 80,
    y: 20
  },
  {
    x: 20,
    y: 70
  },
  {
    x: 80,
    y: 70
  },
  {
    x: 50,
    y: 90
  },
  ], 22: [{
    x: 20,
    y: 20
  },{
    x: 80,
    y: 20
  },
  {
    x: 20,
    y: 50
  },
  {
    x: 80,
    y: 50
  },
  {
    x: 50,
    y: 90
  },
  ]
}