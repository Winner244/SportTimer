import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { SettingsService } from 'src/app/services/settings.service';
import { ModelTypeExercise } from 'src/app/models/ModelTypeExercise';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';

@Component({
  selector: 'app-exercise-results-settings',
  templateUrl: './exercise-results-settings.component.html',
  styleUrls: ['./exercise-results-settings.component.less']
})
export class ExerciseResultsSettingsComponent implements OnDestroy, OnInit {
  windowWidth: number;

  exerciseTypes: ModelTypeExercise[];
  exerciseTypeSelected: ModelTypeExercise;

  private _destroyed: Subject<any> = new Subject();

  constructor(
    private settingsService: SettingsService,
    private exerciseResultsService: ExerciseResultsService) 
  { 
    this.settingsService.exerciseTypes$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseTypes = value);

    this.exerciseResultsService.exerciseTypeUidSelected$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.exerciseTypeSelected = this.exerciseTypes.find(x => x.uid == value));
  }

  ngOnInit(){
    this.onResize();
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }

  onSelectTypeExercise(exerciseTypeUid: string){
    this.exerciseTypeSelected = this.exerciseTypes.find(x => x.uid == exerciseTypeUid);
    this.exerciseResultsService.exerciseTypeUidSelected = exerciseTypeUid;
  }

  public onResize(){
     this.windowWidth = window.innerWidth;
  }
}
