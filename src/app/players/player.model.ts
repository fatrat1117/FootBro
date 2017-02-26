export class Player {
  id: string;
  created: boolean;
  name: string;
  photo: string;
  photoMedium;
  teamId: string;
  description: string;
  foot: string;
  height: number;
  position: string;
  pushId: string;
  slogan: string;
  weight: number;
  role: string;
  teams: string[];
  cheerleaders: string[];
  popularity;
  points: number;
}

export class PlayerMatchData {
  player: Player;
  goal;
  assist;
  red;
  yellow;
}