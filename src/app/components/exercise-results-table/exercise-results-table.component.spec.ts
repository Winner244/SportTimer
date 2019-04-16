import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseResultsTableComponent } from './exercise-results-table.component';

describe('ExerciseResultsTableComponent', () => {
  let component: ExerciseResultsTableComponent;
  let fixture: ComponentFixture<ExerciseResultsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseResultsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
