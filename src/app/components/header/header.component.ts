import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from '../../services/settings.service';
import { FAQService } from '../../services/faq.service';
import { RefsService } from '../../services/refs.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  faCog = faCog;

  @ViewChild('buttonSettings') buttonSettingsElement: ElementRef;

  constructor(
    private settingsService: SettingsService,
    private faqService: FAQService,
    private refsService: RefsService) { }

  ngOnInit() {
    this.refsService.buttonSettings = this.buttonSettingsElement;
  }

  onClickOpenSettings(){
    this.settingsService.openPopup();
  }

  onClickOpenFAQ(){
    this.faqService.openPopup();
  }
}
