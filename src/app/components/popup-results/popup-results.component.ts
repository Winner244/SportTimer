import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';

@Component({
   selector: 'app-popup-results',
   templateUrl: './popup-results.component.html',
   styleUrls: ['./popup-results.component.less']
})
export class PopupResultsComponent implements OnDestroy {

   isOpen: boolean;

   private _destroyed: Subject<any> = new Subject();

   constructor(private exerciseResultsService: ExerciseResultsService) {
      this.exerciseResultsService.isOpenPopupResults$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.isOpen = value;
         });
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }

   onClose() {
      this.exerciseResultsService.closePopupResults();
   }
}
