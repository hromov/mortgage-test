import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

const BANK_DATA: Bank[] = [
  { id: "0", name: "Bank of America", interest: 0.2, max_loan: 40000, min_down: 0.3, term: 12 },
  { id: "1", name: "Bank of China", interest: 0.2, max_loan: 2000000, min_down: 0.25, term: 14 },
  { id: "2", name: "Bank of Ukraine", interest: 0.2, max_loan: 20000, min_down: 0.2, term: 9 },
  { id: "3", name: "Bank of Spain", interest: 0.2, max_loan: 100000, min_down: 0.4, term: 16 },
  { id: "4", name: "Bank of Italy", interest: 0.2, max_loan: 300000, min_down: 0.5, term: 32 },
];

export interface Bank {
  id: string;
  name: string;
  interest: number;
  max_loan: number;
  min_down: number;
  term: number;
}

const host = 'http://localhost:8080'

@Injectable({
  providedIn: 'root'
})
export class BanksService {

  constructor(private http: HttpClient) { }

  loadAllBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(`${host}/banks`)
  }

  save(bankId: string, bank: Bank): Observable<any> {
    return this.http.put(`${host}/banks/${bankId}`, bank)
  }

  delete(bankId: string): Observable<any> {
    return this.http.delete(`${host}/banks/${bankId}`)
  }

  new(bank: Bank): Observable<Bank> {
    return this.http.post<Bank>(`${host}/banks`, bank)
  }
}
