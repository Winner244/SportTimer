import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseResultsSettingsComponent } from './exercise-results-settings.component';

describe('ExerciseResultsSettingsComponent', () => {
  let component: ExerciseResultsSettingsComponent;
  let fixture: ComponentFixture<ExerciseResultsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseResultsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseResultsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
