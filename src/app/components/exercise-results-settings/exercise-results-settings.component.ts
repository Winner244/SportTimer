import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { SettingsService } from 'src/app/services/settings.service';
import { ModelTypeExercise } from 'src/app/models/ModelTypeExercise';

@Component({
  selector: 'app-exercise-results-settings',
  templateUrl: './exercise-results-settings.component.html',
  styleUrls: ['./exercise-results-settings.component.less']
})
export class ExerciseResultsSettingsComponent implements OnDestroy {
  exerciseTypes: ModelTypeExercise[];
  exerciseTypeUidSelected: string;

  private _destroyed: Subject<any> = new Subject();

  constructor(private settingsService: SettingsService) { 
    this.settingsService.exerciseTypes$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseTypes = value);

    this.settingsService.exerciseTypeUidSelected$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseTypeUidSelected = value);
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }

  onSelectTypeExercise(exerciseType: ModelTypeExercise){
    this.exerciseTypeUidSelected = exerciseType.uid;
    this.settingsService.exerciseTypeUidSelected = exerciseType.uid;
  }
}
