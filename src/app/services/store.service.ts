import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Bank, BanksService } from './banks.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private subject = new BehaviorSubject<Bank[]>([]);

  banks$: Observable<Bank[]> = this.subject.asObservable();

  constructor(private bs: BanksService) {
    this.bs.loadAllBanks().pipe(
      catchError(err => {
        const message = "Could not load banks";
        // this.messagesService.showErrors(message);
        console.log(message, err)
        return throwError(() => err);
      }),
      tap(banks => this.subject.next(banks))
    ).subscribe()
  }
}
