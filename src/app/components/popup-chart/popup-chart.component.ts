import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Chart } from 'chart.js';
import { PopupChartService } from 'src/app/services/popup-chart.service';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import * as moment from 'moment';

@Component({
   selector: 'app-popup-chart',
   templateUrl: './popup-chart.component.html',
   styleUrls: ['./popup-chart.component.less']
})
export class PopupChartComponent implements OnDestroy {

   isOpen: boolean;

   @ViewChild('exerciseSelectedChart') exerciseSelectedChartElement: ElementRef;

   private _destroyed: Subject<any> = new Subject();

	constructor(
		private popupChartService: PopupChartService,
		private exerciseResultsService: ExerciseResultsService) 
	{
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
		const selectedExervices = this.exerciseResultsService.getTypeSelectedExerciseResults();
      const ctx = (<any>this.exerciseSelectedChartElement.nativeElement).getContext('2d');
		const xAxis= selectedExervices.map(x => moment(x.date).format('DD.MM.YYYY'));

		const lineChartData = {
			datasets: [{
				label: 'Количество',
				borderColor: 'rgb(1, 0, 187)',
				backgroundColor: 'rgb(1, 0, 187)',
				pointRadius: 4,
				fill: false,
				data: selectedExervices.map(x => x.results.sum(r => r.count)),
				yAxisID: 'y-axis-1',
				offset: true
			}, {
				label: 'Поднятая масса',
				borderColor: 'rgb(187, 0, 40)',
				backgroundColor: 'rgb(187, 0, 40)',
				pointStyle: 'triangle',
				pointRadius: 5,
				fill: false,
				data: selectedExervices.map(x => x.results.sum(r => r.mass)),
				yAxisID: 'y-axis-2',
				offset: true
			}],
		};

		Chart.Line(ctx, {
			data: lineChartData,
			options: {
				responsive: true,
				hoverMode: 'index',
				stacked: false,
				legend: {
					position: 'right',
					labels: {
						usePointStyle: true,
						padding: 20,
						fontSize: 14
					}
				},
				elements: {
				},
				scales: {
					yAxes: [{
						type: 'linear', 
						display: true,
						position: 'left',
						id: 'y-axis-1',
					},
					{
						type: 'linear', 
						display: false,
						id: 'y-axis-2',
					}],
					xAxes: [{
						type: 'category',
						labels: xAxis,
						offset: true
				  }]
				}
			}
		});
	
   }

   onClose() {
      this.popupChartService.closePopup();
   }
}
