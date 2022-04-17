import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private subjecct = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.subjecct.asObservable()
      .pipe(
          filter(messages => messages && messages.length > 0)
      );

  showErrors(...errors: string[]) {
      this.subjecct.next(errors);
  }
}
