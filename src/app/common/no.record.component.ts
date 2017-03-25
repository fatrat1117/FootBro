import { Component ,Input} from '@angular/core';

@Component({
  selector: 'no-record',
  template: `
    <div class="no-record-wrapper">
       <div class="no-record">
          {{message}}
       </div>
    </div>
  `,
  styleUrls: ['/app/common/no.record.component.scss']
})

export class NoRecordComponent {
  @Input() message:String;
}
