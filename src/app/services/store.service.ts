import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, shareReplay, tap, throwError } from 'rxjs';
import { MessagesService } from '../messages/messages.service';
import { Bank, BanksService } from './banks.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private subject = new BehaviorSubject<Bank[]>([]);

  banks$: Observable<Bank[]> = this.subject.asObservable();

  constructor(
    private bs: BanksService,
    private messagesService: MessagesService
    ) {
    this.bs.loadAllBanks().pipe(
      catchError(err => {
        const message = "Could not load banks. Reload the page please";
        // this.messagesService.showErrors(message);
        console.log(message, err)
        return throwError(() => err);
      }),
      tap(banks => this.subject.next(banks))
    ).subscribe()
  }

  saveBank(bank: Bank): Observable<any> {
    const banks = this.subject.getValue();
    const index = banks.findIndex(b => b.id == bank.id)
    console.log(index, bank)
    // temporary fake id implementetion
    const newBanks: Bank[] = banks.slice(0);
    // if we don't have this bank in base yet, we have to wait backend for proper ID
    if (index == -1) {
      return this.bs.new(bank)
        .pipe(
          catchError(err => {
            const message = 'Could not save bank. Try again';
            console.log(message, err);
            this.messagesService.showErrors(message);
            return throwError(() => err);
          }),
          shareReplay(),
          tap(bank => {
            newBanks.push(bank)
            this.subject.next(newBanks);
          })
        );
    }

    newBanks[index] = bank;
    this.subject.next(newBanks);
    return this.bs.save(bank)
      .pipe(
        catchError(err => {
          const message = 'Could not save bank. Try again';
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(() => err);
        }),
        shareReplay()
      );
  }

  deleteBank(bankId: number): Observable<any> {
    let banks = this.subject.getValue();
    const index = banks.findIndex(bank => bank.id == bankId)
    //save in case we'll get backend error
    const oldBanks = banks.slice(0)
    banks.splice(index, 1);
    // console.log(banks)
    const newBanks: Bank[] = banks.slice(0)
    this.subject.next(newBanks);
    return this.bs.delete(bankId)
      .pipe(
        catchError(err => {
          const message = 'Could not delete bank! So we put it back in the list. Try again';
          console.log(message, err);
          this.messagesService.showErrors(message);
          //if we were not able to delete - we have to push it back
          this.subject.next(oldBanks)
          return throwError(() => err);
        }),
        shareReplay()
      );
  }

  getBank(bankId: number): Bank {
    const banks = this.subject.getValue();
    const index = banks.findIndex(bank => bank.id == bankId)
    // console.log(bankId, banks)
    return banks[index]
  }
}
