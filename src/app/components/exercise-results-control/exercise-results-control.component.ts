import { Component, OnInit } from '@angular/core';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';

@Component({
  selector: 'app-exercise-results-control',
  templateUrl: './exercise-results-control.component.html',
  styleUrls: ['./exercise-results-control.component.less']
})
export class ExerciseResultsControlComponent implements OnInit {
  windowWidth: number;

  constructor(private exerciseResultsService: ExerciseResultsService) 
  { 
  }

  ngOnInit(){
    this.onResize();
  }

  addResultItem(){
    this.exerciseResultsService.addCurrentResultItem();
  }

  saveAndClear(){
    this.exerciseResultsService.saveCurrentResult();
    this.exerciseResultsService.clearCurrentResult();
  }

  clear(){
    this.exerciseResultsService.clearCurrentResult();
  }

  public onResize(){
     this.windowWidth = window.innerWidth;
  }
}
