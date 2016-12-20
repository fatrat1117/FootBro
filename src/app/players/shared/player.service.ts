import { Injectable } from '@angular/core';

import { PlayerBasic, PlayerDetail } from './player.model';
import { PLAYERS } from './mock-data/mock-player';

@Injectable()
export class PlayerService {
  getSelfBasic(): Promise<PlayerBasic> {
    return Promise.resolve(PLAYERS[0].basic);
  }

  getPlayerBasic(id: string): Promise<PlayerBasic> {
    return Promise.resolve(PLAYERS[0].basic);
  }

  getPlayerDetail(id: string): Promise<PlayerDetail> {
    return Promise.resolve(PLAYERS[0].detail);
  }

  getPlayerRole(id: string): Promise<string> {
    return Promise.resolve(PLAYERS[0].role);
  }
}