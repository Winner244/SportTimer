import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelExerciseResultItem } from 'src/app/models/ModelExerciseResultItem';
import { Helper } from '../../helpers/Helper';
import * as moment from 'moment';

@Component({
   selector: 'app-exercise-results-table',
   templateUrl: './exercise-results-table.component.html',
   styleUrls: ['./exercise-results-table.component.less']
})
export class ExerciseResultsTableComponent implements OnInit {
   windowWidth: number;
   widthTd: string;

   @Input() items: ModelExerciseResultItem[];
   @Input() isDisableInputs: boolean;
   @Input() isHideHeader: boolean;
   
   @Output() onChangeModel = new EventEmitter<void>();

   constructor() { }

   ngOnInit() {
      this.onResize();
   }

   getTimeStart(item: ModelExerciseResultItem): string {
      return moment(item.timeStart).format('hh:mm:ss');
   }
   getTimeEnd(item: ModelExerciseResultItem): string {
      return item.timeEnd ? moment(item.timeEnd).format('hh:mm:ss') : '';
   }
   getTimeDuration(item: ModelExerciseResultItem): string {
      return item.timeEnd ? Helper.betweenDate(item.timeStart, item.timeEnd) : '';
   }

   changeModel() {
      this.onChangeModel.emit();
   }

   public onResize() {
      this.windowWidth = window.innerWidth;
      this.widthTd = this.windowWidth > 600 ? '20%' : '33%';
  }
}
