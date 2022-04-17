import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, shareReplay, tap, throwError } from 'rxjs';
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

  saveBank(bankId: string, changes: Partial<Bank>): Observable<any> {
    const banks = this.subject.getValue();
    const index = banks.findIndex(bank => bank.id == bankId)
    // temporary fake id implementetion
    const newBank: Bank = {
      ...banks[index == -1 ? 0 : index],
      ...changes
    }
    const newBanks: Bank[] = banks.slice(0);
    // temporary fake id implementetion
    if (index == -1) {
      newBank.id = new Date().getTime().toString() + changes.name
      newBanks.push(newBank)
    } else {
      newBanks[index] = newBank;
    }
    this.subject.next(newBanks);
    return this.bs.save(bankId, newBank)
      .pipe(
        catchError(err => {
          const message = 'Could not save bank';
          console.log(message, err);
          // this.messagesService.showErrors(message);
          return throwError(() => err);
        }),
        shareReplay()
      );
  }

  deleteBank(bankId: string): Observable<any> {
    let banks = this.subject.getValue();
    const index = banks.findIndex(bank => bank.id == bankId)
    banks.splice(index, 1);
    // console.log(banks)
    const newBanks: Bank[] = banks.slice(0)
    this.subject.next(newBanks);
    return this.bs.delete(bankId)
      .pipe(
        catchError(err => {
          const message = 'Could not delete bank';
          console.log(message, err);
          // this.messagesService.showErrors(message);
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
