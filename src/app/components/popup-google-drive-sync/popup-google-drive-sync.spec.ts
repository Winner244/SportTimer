import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupGoogleDriveSyncComponent } from './popup-google-drive-sync';

describe('PopupResultsComponent', () => {
  let component: PopupGoogleDriveSyncComponent;
  let fixture: ComponentFixture<PopupGoogleDriveSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupGoogleDriveSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupGoogleDriveSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
