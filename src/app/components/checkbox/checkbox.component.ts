import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.less']
})
export class CheckboxComponent {
  faCheck = faCheck;

  @Input() text: string;
  @Input() value: boolean;
  @Output() onToggle = new EventEmitter<void>();

  toggle(event) {
    this.onToggle.emit();
    event.preventDefault();
  }
}
