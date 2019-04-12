import { Component, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-timer-settings',
  templateUrl: './timer-settings.component.html',
  styleUrls: ['./timer-settings.component.less']
})
export class TimerSettingsComponent implements OnInit {
  faCheck = faCheck;

  constructor() { }

  ngOnInit() {
  }

}
