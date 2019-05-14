import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import * as moment from 'moment';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
   title = 'sportTimer';
   isShowFooterFixed = false;

   @ViewChild('content') contentElement: ElementRef;
   @ViewChild('footer') footerElement: ElementRef;

   constructor(private googleDriveService: GoogleDriveService) {
      this.onResize = this.onResize.bind(this);

      //синхронизация данных при старте
      this.googleDriveService.synchronizationDrive();

      //локализация времени
      const language = window.navigator ? window.navigator.language : 'en';
      moment.locale(language.substr(0, 2));
   }

   ngOnInit() {
      setTimeout(this.onResize, 100);
   }

   onResize() {
      this.isShowFooterFixed = window.innerHeight > this.contentElement.nativeElement.offsetHeight + this.footerElement.nativeElement.offsetHeight;
   }
}
