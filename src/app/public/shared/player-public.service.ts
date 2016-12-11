import { Injectable } from '@angular/core';

import { PlayerPublic } from './player-public.model';
import { PLAYERPUBLICS } from './mock-data/mock-player-public';

@Injectable()
export class PlayerPublicService {
  getPlayerPublics(): Promise<PlayerPublic[]> {
    return new Promise<PlayerPublic[]>(resolve =>
      setTimeout(resolve, 2000)) // delay 2 seconds
      .then(() => Promise.resolve(PLAYERPUBLICS));
  }
}