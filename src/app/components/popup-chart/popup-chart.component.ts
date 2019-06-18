import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Chart } from 'chart.js';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import * as moment from 'moment';
import { ModelExerciseResult } from 'src/app/models/ModelExerciseResult';

@Component({
   selector: 'app-popup-chart',
   templateUrl: './popup-chart.component.html',
   styleUrls: ['./popup-chart.component.less']
})
export class PopupChartComponent implements OnDestroy, OnInit {

	isOpen: boolean;
	chart : Chart;
	paddingBody: string = '15px 20px';
	height: string = '400px';

   @ViewChild('exerciseSelectedChart') exerciseSelectedChartElement: ElementRef;

   private _destroyed: Subject<any> = new Subject();

	constructor(private exerciseResultsService: ExerciseResultsService) 
	{
      this.exerciseResultsService.isOpenPopupChart$
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
	
	ngOnInit(){
      const ctx = (<any>this.exerciseSelectedChartElement.nativeElement).getContext('2d');
		this.chart = new Chart(ctx, {
			type: 'line',
			data: [],
			options: {
				responsive: true,
				hoverMode: 'index',
				stacked: false,
				legend: {
					position: 'right',
					labels: {
						usePointStyle: true,
						padding: 20,
						fontSize: 14,
						boxWidth: 5
					}
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
						labels: [],
						offset: true
				  }]
				}
			}
		});

		this.onResize();
	}

   drawChart(){
		let selectedExerviceResults: ModelExerciseResult[] = [].concat(this.exerciseResultsService.getTypeSelectedExerciseResults());
		selectedExerviceResults = selectedExerviceResults.sortByField(x => x.date);
		const xAxis= selectedExerviceResults.map(x => moment(x.date).format('DD.MM.YYYY'));
		const mass = selectedExerviceResults.map(x => x.results.sum(r => r.mass));

		const lineChartData = {
			datasets: [{
				label: 'Количество',
				borderColor: 'rgb(1, 0, 187)',
				backgroundColor: 'rgb(1, 0, 187)',
				pointRadius: 4,
				fill: false,
				data: selectedExerviceResults.map(x => x.results.sum(r => r.count)),
				yAxisID: 'y-axis-1',
				offset: true
			}, {
				label: 'Поднятая масса',
				borderColor: 'rgb(187, 0, 40)',
				backgroundColor: 'rgb(187, 0, 40)',
				pointStyle: 'triangle',
				pointRadius: 5,
				fill: false,
				data: mass,
				yAxisID: 'y-axis-2',
				offset: true
			}],
		};

		//hide mass if 0
		if(mass.sum(x => x) === 0){
			lineChartData.datasets = [lineChartData.datasets[0]];
		}

		this.chart.data = lineChartData;
		this.chart.options.scales.xAxes[0].labels = xAxis;
		this.chart.update();
   }

   onClose() {
      this.exerciseResultsService.closePopupChart();
	}
	
	onResize(){
		this.chart.options.legend.position = window.innerWidth < 700 ? 'top' : 'right';
		this.paddingBody = window.innerWidth < 600 ? '10px 10px' : '15px 20px';
		this.height = window.innerWidth < 700 ? window.innerWidth * 0.6 + 'px' : '400px';
		if(window.innerWidth < 450){
			this.paddingBody = '0';
		}
	}
}
