export class TeamStat {
  draw;
  lose;
  rate;
  total_matches;
  win;
}

export class Team {
  id;
  popularity;
  logo;
  name;
  ability;
  totalPlayers;
  last_5 = [];
  players = [];
  last_15 = new TeamStat();
  last_30 = new TeamStat();
  overall = new TeamStat();
}
