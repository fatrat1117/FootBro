import { Component } from '@angular/core';

@Component({
  selector: 'sb-loading',
  template: `
    <div class="loader">
      <ul class="hexagon-container">
        <li class="hexagon hex_1"></li>
        <li class="hexagon hex_2"></li>
        <li class="hexagon hex_3"></li>
        <li class="hexagon hex_4"></li>
        <li class="hexagon hex_5"></li>
        <li class="hexagon hex_6"></li>
        <li class="hexagon hex_7"></li>
      </ul>
    </div>
  `,
  styleUrls: ['/app/common/loading.component.scss']
})

export class SbLoadingComponent {
}