import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface Bank {
  id: string;
  name: string;
  interest: number;
  max_loan: number;
  min_down: number;
  term: number;
}

const BANK_DATA: Bank[] = [
  {id: "0", name: "Bank of America", interest: 0.2, max_loan: 40000, min_down: 0.3, term: 12},
  {id: "1", name: "Bank of China", interest: 0.2, max_loan: 2000000, min_down: 0.25, term: 14},
  {id: "2", name: "Bank of Ukraine", interest: 0.2, max_loan: 20000, min_down: 0.2, term: 9},
  {id: "3", name: "Bank of Spain", interest: 0.2, max_loan: 100000, min_down: 0.4, term: 16},
  {id: "4", name: "Bank of Italy", interest: 0.2, max_loan: 300000, min_down: 0.5, term: 32},
];

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {
  banks$: Observable<Bank[]> = of([]);

  constructor() {

  }

  ngOnInit(): void {
    this.banks$ = of(BANK_DATA)
  }

}
