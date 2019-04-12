import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  faCog = faCog;

  constructor() { }

  ngOnInit() {
  }

  onClickOpenSettings(){
    console.log('onClickOpenSettings');
  }
}
