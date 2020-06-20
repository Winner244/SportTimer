import { Component, DoCheck, ViewChild, ElementRef } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from '../../services/settings.service';
import { FAQService } from '../../services/faq.service';
import { RefsService } from '../../services/refs.service';
import { Helper } from '../../helpers/Helper';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements DoCheck {
  faCog = faCog;

  @ViewChild('buttonSettings') buttonSettingsElement: ElementRef;
  buttonSettingsHash: string;

  constructor(
    private settingsService: SettingsService,
    private faqService: FAQService,
    private refsService: RefsService) { }

  ngDoCheck(){
     let buttonSettingsNewHash = Helper.getElementHash(this.buttonSettingsElement);
     if(!this.buttonSettingsHash || this.buttonSettingsHash != buttonSettingsNewHash){
        this.buttonSettingsHash = buttonSettingsNewHash;
        this.refsService.buttonSettings = this.buttonSettingsElement;
     }
  }

  onClickOpenSettings(){
    this.settingsService.openPopup();
  }

  onClickOpenFAQ(){
    this.faqService.openPopup();
  }
}
