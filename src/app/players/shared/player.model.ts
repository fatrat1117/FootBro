export class PlayerBasic {
  id: string;
  created: boolean;
  displayName: string;
  photoURL: string;
  teamId: string;
}

export class PlayerDetail {
  description: string;
  foot: string;
  height: number;
  position: string;
  pushId: string;
  slogan: string;
  weight: number;
}

export class Player {
  basic: PlayerBasic;
  detail: PlayerDetail;
  role: string;
  teams: string[];
}