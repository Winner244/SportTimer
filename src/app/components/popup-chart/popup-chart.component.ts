import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Chart } from 'chart.js';
import { PopupChartService } from 'src/app/services/popup-chart.service';

@Component({
   selector: 'app-popup-chart',
   templateUrl: './popup-chart.component.html',
   styleUrls: ['./popup-chart.component.less']
})
export class PopupChartComponent implements OnDestroy {

   isOpen: boolean;

   @ViewChild('exerciseSelectedChart') exerciseSelectedChartElement: ElementRef;

   private _destroyed: Subject<any> = new Subject();

   constructor(private popupChartService: PopupChartService) {
      this.popupChartService.isOpen$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.isOpen = value;
            if(value){
               this.drawChart();
            }
         });
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }

   drawChart(){
      const ctx = (<any>this.exerciseSelectedChartElement.nativeElement).getContext('2d');
      const chart = new Chart(ctx, {
         type: 'line',
         data: [{
            x: 10,
            y: 20
        }, {
            x: 15,
            y: 10
        }],
         options: {}
      });
   }

   onClose() {
      this.popupChartService.closePopup();
   }
}
