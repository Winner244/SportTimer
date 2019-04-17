import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'sportTimer';
  isShowFooterFixed = false;

  @ViewChild('app') appElement: ElementRef;
  @ViewChild('footer') footerElement: ElementRef;

  constructor(){
    this.onResize = this.onResize.bind(this);
  }

  ngOnInit() {
    setTimeout(this.onResize, 100);
  }

  onResize() {
    this.isShowFooterFixed = window.innerHeight > this.appElement.nativeElement.offsetHeight + this.footerElement.nativeElement.offsetHeight;
  }
}
