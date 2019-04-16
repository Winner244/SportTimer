import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseResultsComponent } from './exercise-results.component';

describe('ExerciseResultsComponent', () => {
  let component: ExerciseResultsComponent;
  let fixture: ComponentFixture<ExerciseResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
