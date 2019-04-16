import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseResultsStatisticsComponent } from './exercise-results-statistics.component';

describe('ExerciseResultsStatisticsComponent', () => {
  let component: ExerciseResultsStatisticsComponent;
  let fixture: ComponentFixture<ExerciseResultsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseResultsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseResultsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
