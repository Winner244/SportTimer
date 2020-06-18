import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqCanvasComponent } from './faq-canvas.component';

describe('FaqCanvasComponent', () => {
  let component: FaqCanvasComponent;
  let fixture: ComponentFixture<FaqCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
