import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.less']
})
export class PopupComponent {

  @Input() title: string;
  @Input() isOpen: boolean;
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
