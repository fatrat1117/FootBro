import { Team} from '../teams/team.model';
export class MatchLocation {
  name;
  address;
  latitude;
  longitude;
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
}