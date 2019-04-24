import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { ModelNotification } from 'src/app/models/ModelNotification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnDestroy {

  messages: ModelNotification[];
  
  private _destroyed: Subject<any> = new Subject();

  constructor(private notificationService: NotificationService) {
    this.notificationService.messages$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.messages = value);
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }
  
  removeMessage(message: ModelNotification){
    this.notificationService.removeMessage(message.uid);
  }
}
