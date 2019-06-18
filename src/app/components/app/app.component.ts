import { Component, OnInit } from '@angular/core';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import * as moment from 'moment';
import { AntiHostAdService } from 'src/app/services/anti-host-ad.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
   title = 'sportTimer';

   constructor(
      private googleDriveService: GoogleDriveService, 
      private antiHostAdService: AntiHostAdService) {

      //синхронизация данных при старте
      this.googleDriveService.synchronizationDrive();

      //локализация времени
      const language = window.navigator ? window.navigator.language : 'en';
      moment.locale(language.substr(0, 2));

      setTimeout(() => this.antiHostAdService.removeAd(), 500);
   }

   ngOnInit() {
   }
}
