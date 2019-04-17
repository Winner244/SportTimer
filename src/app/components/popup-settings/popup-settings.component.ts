import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-settings',
  templateUrl: './popup-settings.component.html',
  styleUrls: ['./popup-settings.component.less']
})
export class PopupSettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClose(){
    console.log('onClose');
  }

}
