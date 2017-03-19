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

export class PlayerMatchStatsUI {
  id;
  player: Player;
  goals = 0;
  assists = 0;
  reds = 0;
  yellows = 0;
  owngoals = 0;
  expanded = false; //UI use
}

export class PlayerRatingUI {
  //id;
  player: Player;
  rating = 5;
  starArray = [{
    id: 2,
    src: "ios-star-outline"
  }, {
      id: 4,
      src: "ios-star-outline"
    }, {
      id: 6,
      src: "ios-star-outline"
    }, {
      id: 8,
      src: "ios-star-outline"
    }, {
      id: 10,
      src: "ios-star-outline"
    }];
}