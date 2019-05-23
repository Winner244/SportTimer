import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import { ModelExerciseResult } from 'src/app/models/ModelExerciseResult';

@Component({
   selector: 'app-popup-result-info',
   templateUrl: './popup-result-info.component.html',
   styleUrls: ['./popup-result-info.component.less']
})
export class PopupResultInfoComponent implements OnDestroy {

   isOpen: boolean;
   item: ModelExerciseResult;

   private _destroyed: Subject<any> = new Subject();

   constructor(private exerciseResultsService: ExerciseResultsService) {
      this.exerciseResultsService.isOpenPopupResultInfo$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.isOpen = value;
            this.item = this.exerciseResultsService.popupResultInfoItem;
         });
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }


   onClose() {
      this.exerciseResultsService.closePopupResultInfo();
   }
}
