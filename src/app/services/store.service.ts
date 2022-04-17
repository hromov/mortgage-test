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

  saveBank(bankId: string, changes: Partial<Bank>): Observable<any> {
    const banks = this.subject.getValue();
    const index = banks.findIndex(bank => bank.id == bankId)
    console.log(index)
    // temporary fake id implementetion
    const newBank: Bank = {
      ...banks[index == -1 ? 0 : index],
      ...changes
    }
    const newBanks: Bank[] = banks.slice(0);
    // if we don't have this bank in base yet, we have to wait backend for proper ID
    if (index == -1) {
      return this.bs.new(newBank)
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

    newBanks[index] = newBank;
    this.subject.next(newBanks);
    return this.bs.save(bankId, newBank)
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

  deleteBank(bankId: string): Observable<any> {
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

  getBank(bankId: string): Bank {
    const banks = this.subject.getValue();
    const index = banks.findIndex(bank => bank.id == bankId)
    console.log(bankId, banks)
    return banks[index]
  }
}
