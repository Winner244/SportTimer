import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupResultInfoComponent } from './popup-result-info.component';

describe('PopupResultInfoComponent', () => {
  let component: PopupResultInfoComponent;
  let fixture: ComponentFixture<PopupResultInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupResultInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupResultInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
