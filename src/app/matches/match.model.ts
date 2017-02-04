export class MatchBasic {
  time: number;
  homeId: string;
  awayId: string;
  homeScore: number;
  awayScore: number;
}

export class MatchStanding {
  teamId: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export class Match {
  id;
  date;
  time;
  homeId;
  awayId;
  homeName;
  awayName;
  homeScore;
  awayScore;
  type;
  tournamentId;
}