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
  joinTime;
}

export class PlayerMatchData {
  player: Player;
  goals = 0;
  assists = 0;
  reds = 0;
  yellows = 0;
  expanded = false; //UI use
}