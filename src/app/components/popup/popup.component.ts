import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.less']
})
export class PopupComponent {

  @Input() title: string;
  @Input() isOpen: boolean;

  @Input() width: string = '700px';
  @Input() height: string = '500px';
  @Input() left: string = 'calc(50% - 350px)';
  @Input() top: string = '100px';

  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
