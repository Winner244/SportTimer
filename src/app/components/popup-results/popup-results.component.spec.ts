import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupResultsComponent } from './popup-results.component';

describe('PopupResultsComponent', () => {
  let component: PopupResultsComponent;
  let fixture: ComponentFixture<PopupResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
