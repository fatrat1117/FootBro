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
  type = 11;
  tournamentId;
  location = new MatchLocation();
  createBy;
  isHomeUpdated;
  isAwayUpdated;
  homeSquad;
  awaySquad;
  isStarted = function () {
    let now = moment().unix() * 1000;
    //console.log(now, this.time);
    return now > this.time;
  };
  updateState = function () {
    //0: no one update
    //1: home updated
    //2: away updated
    //3 both updated
    if (this.isHomeUpdated && this.isAwayUpdated)
      return 3;
    if (this.isHomeUpdated)
      return 1;
    if (this.isAwayUpdated)
      return 2;
    return 0;
  }
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
  ],352: [{
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
  ],451: [{
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
  ],4231: [{
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
  ],321: [{
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
  ]
}