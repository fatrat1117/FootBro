import { Injectable } from '@angular/core';
export const TEAMRANKS = [
  {logo: '', id: 11, ablity: 1000, totalPlayers: 20, popularity: 88, name: 'Mr. Nice'},
  {id: 12, name: 'Narco'},
  {id: 13, name: 'Bombasto'},
  {id: 14, name: 'Celeritas'},
  {id: 15, name: 'Magneta'},
  {id: 16, name: 'RubberMan'},
  {id: 17, name: 'Dynama'},
  {id: 18, name: 'Dr IQ'},
  {id: 19, name: 'Magma'},
  {id: 20, name: 'Tornado'}
];

@Injectable()
export class RankService {
  getTeamRanks(): Promise<any[]> {
      return new Promise<any[]>(resolve =>
    setTimeout(resolve, 2000)) // delay 2 seconds
    .then(() => {
        return Promise.resolve(TEAMRANKS);
    }
    )
  }
}