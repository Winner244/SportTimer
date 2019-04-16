import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseResultsHeaderComponent } from './exercise-results-header.component';

describe('ExerciseResultsHeaderComponent', () => {
  let component: ExerciseResultsHeaderComponent;
  let fixture: ComponentFixture<ExerciseResultsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseResultsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseResultsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
