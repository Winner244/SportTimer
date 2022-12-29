import { Component, OnInit } from '@angular/core';
import { GoogleDriveService } from '../../services/google-drive.service';
import * as moment from 'moment';
import { Helper } from '../../helpers/Helper';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
   title = 'sportTimer';

   constructor(
      private googleDriveService: GoogleDriveService) {

      let urlParameters = Helper.getUrlParameters();
      if(!urlParameters.faq){
         //синхронизация данных при старте
         this.googleDriveService.synchronizationDrive();
      }

      //локализация времени
      const language = window.navigator ? window.navigator.language : 'en';
      moment.locale(language.substr(0, 2));
   }

   ngOnInit() {
   }
}
