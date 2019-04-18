import { Component, OnInit } from '@angular/core';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-timer-settings',
  templateUrl: './timer-settings.component.html',
  styleUrls: ['./timer-settings.component.less']
})
export class TimerSettingsComponent implements OnInit {
  hours: number;
  minutes: number;
  seconds: number;
  isPlaySoundInEnd: boolean;

  constructor(public timerService: TimerService) { 
    this.hours = timerService.settingHours;
    this.minutes = timerService.settingMinutes;
    this.seconds = timerService.settingSeconds;
    this.isPlaySoundInEnd = timerService.isPlaySoundInEnd;
  }

  ngOnInit() {
  }


  changeHours(){
    this.timerService.settingHours = this.hours;
  }
  changeMinutes(){
    this.timerService.settingMinutes = this.minutes;
  }
  changeSeconds(){
    this.timerService.settingSeconds = this.seconds;
  }
  changeIsPlaySoundInEnd(){
    this.isPlaySoundInEnd = !this.isPlaySoundInEnd;
    this.timerService.isPlaySoundInEnd = this.isPlaySoundInEnd;
  }
}
