import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTimerSettingsComponent } from './popup-timer-settings.component';

describe('PopupTimerSettingsComponent', () => {
  let component: PopupTimerSettingsComponent;
  let fixture: ComponentFixture<PopupTimerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupTimerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupTimerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
