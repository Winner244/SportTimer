import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseResultsControlComponent } from './exercise-results-control.component';

describe('ExerciseResultsControlComponent', () => {
  let component: ExerciseResultsControlComponent;
  let fixture: ComponentFixture<ExerciseResultsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseResultsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseResultsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
