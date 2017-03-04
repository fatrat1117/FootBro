import { Team} from '../teams/team.model';
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
  home : Team;
  away : Team;
  homeScore;
  awayScore;
  type = 11;
  tournamentId;
  location = new MatchLocation();
  createBy;
  homeParticipants = [];
  awayParticipants = [];
  isStarted = function() {
    let now = moment().unix() * 1000;
    //console.log(now, this.time);
    return now > this.time;
  }
}