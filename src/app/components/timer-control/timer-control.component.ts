import { Component, OnInit } from '@angular/core';
import { faPlay, faStop, faPause } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-timer-control',
  templateUrl: './timer-control.component.html',
  styleUrls: ['./timer-control.component.less']
})
export class TimerControlComponent implements OnInit {
  faPlay = faPlay;
  faStop = faStop;
  faPause = faPause;

  constructor() { }

  ngOnInit() {
  }

  start(){
    console.log('start');
  }

  pause(){
    console.log('pause');
  }

  clear(){
    console.log('clear');
  }

}
