import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { TimerViewComponent } from './components/timer-view/timer-view.component';
import { TimerControlComponent } from './components/timer-control/timer-control.component';

import { StringExtension } from './StringExtension';
import { ArrayExtension } from './ArrayExtension';

StringExtension.on();
ArrayExtension.on();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    TimerViewComponent,
    TimerControlComponent
  ],
  imports: [
    BrowserModule,
	FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
