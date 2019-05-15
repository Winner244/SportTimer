import { Component, OnInit } from '@angular/core';
import { PopupChartService } from 'src/app/services/popup-chart.service';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.less']
})
export class NavigationPanelComponent implements OnInit {

  constructor(private popupChartService: PopupChartService) { }

  ngOnInit() {
  }

  openAllResults(){

  }

  openChart(){
    this.popupChartService.openPopup();
  }

}
