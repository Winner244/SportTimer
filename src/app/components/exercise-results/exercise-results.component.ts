import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import { ModelExerciseResult } from 'src/app/models/ModelExerciseResult';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-exercise-results',
  templateUrl: './exercise-results.component.html',
  styleUrls: ['./exercise-results.component.less']
})
export class ExerciseResultsComponent implements OnDestroy {
  exerciseLastResults: ModelExerciseResult;
  exerciseCurrentResults: ModelExerciseResult;

  private _destroyed: Subject<any> = new Subject();

  constructor(
    private exerciseResultsService: ExerciseResultsService,
    private settingsService: SettingsService) 
  { 
    this.exerciseResultsService.exerciseResults$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseLastResults = this.exerciseResultsService.getLastExerciseResults(this.settingsService.exerciseTypeUidSelected));

    this.settingsService.exerciseTypeUidSelected$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseLastResults = this.exerciseResultsService.getLastExerciseResults(value));

    this.exerciseResultsService.exerciseCurrentResults$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseCurrentResults = value);
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }

  changeModelTable(){
    console.log('changeModelTable');
    this.exerciseResultsService.exerciseCurrentResults = this.exerciseCurrentResults;
  }
}
