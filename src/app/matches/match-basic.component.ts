import { Component, Input } from '@angular/core';

import {MatchBasic} from './shared/match.model'

@Component({
  selector: 'sb-match-basic',
  templateUrl: './match-basic.component.html',
  styleUrls: ['/app/matches/match-basic.component.scss']
})

export class SbMatchBasicComponent {
  @Input()
  matchBasic: MatchBasic;
}