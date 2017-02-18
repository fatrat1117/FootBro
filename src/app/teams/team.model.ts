//not all members are the same
// export class TeamStat {
//   draw;
//   lose;
//   rate;
//   total_matches;
//   win;
//   GA;
//   GF;
//   // AvgGA () {
//   //   return  this.GA / this.total_matches;
//   // }
//   avgGA;
//   avgGF;
//   Year;
//win_streak;
//noGA_streak;
//lose_streak;
//draw_streak;
//most_GA_match;
//most_GF_match;
// }

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
