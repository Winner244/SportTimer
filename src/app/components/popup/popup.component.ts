import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.less']
})
export class PopupComponent {

  @Input() title: string;
  @Input() isOpen: boolean;
  @Input() width: number = 700;
  @Input() height: number = 500;
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
