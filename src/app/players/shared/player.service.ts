import { Injectable } from '@angular/core';

import { PlayerBasic, PlayerDetail } from './player.model';
import { PLAYERS } from './mock-data/mock-player';

@Injectable()
export class PlayerService {
  // self
  getSelfBasic(): Promise<PlayerBasic> {
    return Promise.resolve(PLAYERS[0].basic);
  }

  getSelfDetail(): Promise<PlayerDetail> {
    return Promise.resolve(PLAYERS[0].detail);
  }

  getSelfTeams(): Promise<string[]> {
    return Promise.resolve(PLAYERS[0].teams);
  }

  saveSelfBasic(playerBasic: PlayerBasic) {
    PLAYERS[0].basic = playerBasic;
  }

  saveSelfDetail(playerDetail: PlayerDetail) {
    PLAYERS[0].detail = playerDetail;
  }

  saveSelfTeams(teams: string[]) {
    PLAYERS[0].teams = teams;
    // TODO: update team
  }

  // general
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