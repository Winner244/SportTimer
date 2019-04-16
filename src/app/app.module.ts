import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { StringExtension } from './StringExtension';
import { ArrayExtension } from './ArrayExtension';

import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './components/app/app.component';
import { TimerComponent } from './components/timer/timer.component';
import { TimerControlComponent } from './components/timer-control/timer-control.component';
import { TimerSettingsComponent } from './components/timer-settings/timer-settings.component';
import { ExerciseResultsComponent } from './components/exercise-results/exercise-results.component';
import { ExerciseResultsHeaderComponent } from './components/exercise-results-header/exercise-results-header.component';
import { ExerciseResultsControlComponent } from './components/exercise-results-control/exercise-results-control.component';
import { ExerciseResultsSettingsComponent } from './components/exercise-results-settings/exercise-results-settings.component';
import { ExerciseResultsStatisticsComponent } from './components/exercise-results-statistics/exercise-results-statistics.component';
import { ExerciseResultsTableComponent } from './components/exercise-results-table/exercise-results-table.component';
import { NavigationPanelComponent } from './components/navigation-panel/navigation-panel.component';

StringExtension.on();
ArrayExtension.on();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TimerComponent,
    TimerControlComponent,
    TimerSettingsComponent,
    ExerciseResultsComponent,
    ExerciseResultsHeaderComponent,
    ExerciseResultsControlComponent,
    ExerciseResultsSettingsComponent,
    ExerciseResultsStatisticsComponent,
    ExerciseResultsTableComponent,
    NavigationPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
	  FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
