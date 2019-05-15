import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  faCog = faCog;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
  }

  onClickOpenSettings(){
    this.settingsService.openPopup();
  }
}
