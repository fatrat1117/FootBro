import { Component, Input } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';


@Component({
  selector: 'page-faq',
  template: `
      <div class="faq-content">
         <div class="faq-title">
          <span>{{title}}</span>
          <div class="faq-subtitle"></div> 
        </div>
        
        <div class="content-text">
          <p>
            {{content}}
          </p> 
        </div>
      </div>
  `,
  styleUrls: ['/app/common/faq.component.scss']
})

export class FAQComponent {
  @Input() title: String;
  @Input() subtitle: String;
  @Input() content: string;
  @Input() hostPageName: String;

  constructor(private viewCtrl: ViewController,private navParams: NavParams) {

  }

  ngOnInit() {
    if (this.navParams.data) {
      this.title = this.navParams.data.title;
      this.subtitle = this.navParams.data.subtitle;
      this.content = this.navParams.data.content;
      // console.log(this.squadNumber);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  //
  // squadSelect(event :any){
  //
  //   let raw = event.target.innerHTML;
  //   this.selectedSquad = raw.trim();
  //   this.dismiss();
  // }

}

