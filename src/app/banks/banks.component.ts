import { Component, OnInit } from '@angular/core';


export interface Bank {
  name: string;
  interest: number;
  max_loan: number;
  min_down: number;
  term: number;
}

const BANK_DATA: Bank[] = [
  {name: "Bank of America", interest: 0.2, max_loan: 40000, min_down: 0.3, term: 12},
  {name: "Bank of China", interest: 0.2, max_loan: 2000000, min_down: 0.25, term: 14},
  {name: "Bank of Ukraine", interest: 0.2, max_loan: 20000, min_down: 0.2, term: 9},
  {name: "Bank of Spain", interest: 0.2, max_loan: 100000, min_down: 0.4, term: 16},
  {name: "Bank of Italy", interest: 0.2, max_loan: 300000, min_down: 0.5, term: 32},
];


@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {
  displayedColumns: string[] = ['name', 'interest', 'max_loan', 'min_down', 'term'];
  dataSource = BANK_DATA;
  constructor() { }

  ngOnInit(): void {
  }

  add() {
    console.log("add new bank")
  }

}
