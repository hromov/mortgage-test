import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Bank {
  id: number;
  name: string;
  interest: number;
  max_loan: number;
  min_down: number;
  term: number;
}

const host = environment.production ? 'https://back-dot-mortgage-test-347507.lm.r.appspot.com' : 'http://localhost:8080'

@Injectable({
  providedIn: 'root'
})
export class BanksService {

  constructor(private http: HttpClient) { }

  loadAllBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(`${host}/banks`)
  }

  save(bank: Bank): Observable<any> {
    return this.http.put(`${host}/banks/${bank.id}`, bank)
  }

  delete(bankId: number): Observable<any> {
    return this.http.delete(`${host}/banks/${bankId}`)
  }

  new(bank: Bank): Observable<Bank> {
    return this.http.post<Bank>(`${host}/banks`, bank)
  }
}
