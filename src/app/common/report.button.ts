import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-report-button',
  template: `
  <button ion-button color="danger" block (click) = "onReport()">{{'reportobjectionalbecontent' | trans}}</button>
  `
})

export class SbReportButton {
  @Input() reportId;

  constructor() {
  }

  onReport() {

  }
}