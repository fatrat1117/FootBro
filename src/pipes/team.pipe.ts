import {Pipe, PipeTransform} from '@angular/core';

//import { TeamBasic } from '../app/teams/shared/team.model'
import { TeamService } from '../app/teams/team.service'

@Pipe({
  name: 'teamBasicPipe'
})

export class TeamBasicPipe implements PipeTransform {
  constructor(private teamService: TeamService) {
  }

  transform(id: string) {
    return this.teamService.getTeam(id);
  }
}
