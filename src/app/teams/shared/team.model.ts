export class TeamBasic {
  id: string;
  captain: string;
  logo: string;
  name: string;
  totalMatches: number;
  totalPlayers: number;
}

export class TeamDetail {
  description: string;
  founder: string;
  location: string;
}

export class Team {
  basic: TeamBasic;
  detail: TeamDetail;
}