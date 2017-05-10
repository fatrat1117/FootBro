export class Player {
  id: string;
  created: boolean;
  name: string;
  photo = "assets/img/none.png";
  photoMedium = "assets/img/none.png";
  photoLarge = "assets/img/forTest/messi_banner.png";
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
  social;
  wechatShareTime;
  fbShareTime;
  stats = {};
  yearlyHistory = [];
  assists;
  goals;
}

export class TeamPlayer extends Player {
  teamRole = 'player';
};

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
  player: Player;
  rating = 6;
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

  constructor() {
    this.updateStarPictureByStar();
  }

  updateStarPictureByStar() {
    switch (this.rating) {
      case 1:
        this.starArray[0].src = "ios-star-half";
        break;
      case 2:
        this.starArray[0].src = "ios-star";
        break;
      case 3:
        this.starArray[0].src = "ios-star";
        this.starArray[1].src = "ios-star-half";
        break;
      case 4:
        this.starArray[0].src = "ios-star";
        this.starArray[1].src = "ios-star";
        break;
      case 5:
        this.starArray[0].src = "ios-star";
        this.starArray[1].src = "ios-star";
        this.starArray[2].src = "ios-star-half";
        break;
      case 6:
        this.starArray[0].src = "ios-star";
        this.starArray[1].src = "ios-star";
        this.starArray[2].src = "ios-star";
        break;
      case 7:
        this.starArray[0].src = "ios-star";
        this.starArray[1].src = "ios-star";
        this.starArray[2].src = "ios-star";
        this.starArray[3].src = "ios-star-half";
        break;
      case 8:
        this.starArray[0].src = "ios-star";
        this.starArray[1].src = "ios-star";
        this.starArray[2].src = "ios-star";
        this.starArray[3].src = "ios-star";
        break;
      case 9:
        this.starArray[0].src = "ios-star";
        this.starArray[1].src = "ios-star";
        this.starArray[2].src = "ios-star";
        this.starArray[3].src = "ios-star";
        this.starArray[4].src = "ios-star-half";
        break;
      case 10:
        this.starArray[0].src = "ios-star";
        this.starArray[1].src = "ios-star";
        this.starArray[2].src = "ios-star";
        this.starArray[3].src = "ios-star";
        this.starArray[4].src = "ios-star";
        break;
    }
  }
}
