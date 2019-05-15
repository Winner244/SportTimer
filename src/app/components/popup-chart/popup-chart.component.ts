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

      /**
       * 
       * 
		var lineChartData = {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
			datasets: [{
				label: 'My First dataset',
				borderColor: window.chartColors.red,
				backgroundColor: window.chartColors.red,
				fill: false,
				data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor()
				],
				yAxisID: 'y-axis-1',
			}, {
				label: 'My Second dataset',
				borderColor: window.chartColors.blue,
				backgroundColor: window.chartColors.blue,
				fill: false,
				data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor()
				],
				yAxisID: 'y-axis-2'
			}]
		};

			Chart.Line(ctx, {
				data: lineChartData,
				options: {
					responsive: true,
					hoverMode: 'index',
					stacked: false,
					title: {
						display: true,
						text: 'Chart.js Line Chart - Multi Axis'
					},
					scales: {
						yAxes: [{
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'left',
							id: 'y-axis-1',
						}, {
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'right',
							id: 'y-axis-2',

							// grid line settings
							gridLines: {
								drawOnChartArea: false, // only want the grid lines for one axis to show up
							},
						}],
					}
				}
			});
	
       */
   }

   onClose() {
      this.popupChartService.closePopup();
   }
}
