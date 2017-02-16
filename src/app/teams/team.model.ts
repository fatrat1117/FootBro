export class TeamStat {
  draw;
  lose;
  rate;
  total_matches;
  win;
  GA;
  GF;
  AvgGA;
  AvgGF;
  Year;
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
  last_15;
  last_30;
  overall;
  yearlyHistory = [];
}
