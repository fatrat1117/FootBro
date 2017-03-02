import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-rate-circle',
  template: `
    <div class="round-progress-container">
      <round-progress [current]="rate" [max]=100 [color]="'#'+'00ff00'" [background]="'#'+'a0a0a0'" [radius]="125"
        [stroke]="20" [semicircle]="false" [rounded]="true" [clockwise]="false" [responsive]="true"> </round-progress>
      <span class="circle-text">
            <div class="win-ratio-label">{{ title | trans }}</div>
            <div class="win-ratio">{{ rate }}%</div>
        </span>
    </div>
  `,
  styleUrls: ['/app/common/rate.circle.component.scss']
})

export class SbRateCircleComponent {
  @Input() title: string;
  @Input() rate: number
}