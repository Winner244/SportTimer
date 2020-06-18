import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFAQComponent } from './popup-faq.component';

describe('PopupFAQComponent', () => {
  let component: PopupFAQComponent;
  let fixture: ComponentFixture<PopupFAQComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupFAQComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupFAQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
