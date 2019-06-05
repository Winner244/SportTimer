import { Component, OnInit } from '@angular/core';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.less']
})
export class NavigationPanelComponent implements OnInit {
  windowWidth: number;

  constructor(private exerciseResultsService: ExerciseResultsService) { }

  ngOnInit() {
    this.onResize();
  }

  openAllResults(){
    this.exerciseResultsService.openPopupResults();
  }

  openChart(){
    this.exerciseResultsService.openPopupChart();
  }

  public onResize() {
     this.windowWidth = window.innerWidth;
  }

}
