import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import { ModelExerciseResult } from 'src/app/models/ModelExerciseResult';

@Component({
  selector: 'app-exercise-results',
  templateUrl: './exercise-results.component.html',
  styleUrls: ['./exercise-results.component.less']
})
export class ExerciseResultsComponent implements OnDestroy {
  exerciseLastResults: ModelExerciseResult;
  exerciseCurrentResult: ModelExerciseResult;

  private _destroyed: Subject<any> = new Subject();

  constructor(private exerciseResultsService: ExerciseResultsService) { 
    this.exerciseResultsService.exerciseResults$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseLastResults = this.exerciseResultsService.getLastExerciseResults(this.exerciseResultsService.exerciseTypeUidSelected));

    this.exerciseResultsService.exerciseTypeUidSelected$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseLastResults = this.exerciseResultsService.getLastExerciseResults(value));

    this.exerciseResultsService.exerciseCurrentResult$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseCurrentResult = value);
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }

  changeModelTable(){
    console.log('changeModelTable');
    this.exerciseResultsService.exerciseCurrentResult = this.exerciseCurrentResult;
  }
}
