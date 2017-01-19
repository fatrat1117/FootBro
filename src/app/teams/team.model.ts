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
  last_5;
  last_15: TeamStat;
  last_30: TeamStat;
  overall: TeamStat;
}
