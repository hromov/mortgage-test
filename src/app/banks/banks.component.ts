import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter, tap } from 'rxjs';
import { BankEditComponent } from '../bank-edit/bank-edit.component';


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

const Default_Bank: Bank = {
  id: "",
  name: "Bank name",
  interest: 0.2,
  max_loan: 10000,
  min_down: 0.1,
  term: 12,
}


@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {
  displayedColumns: string[] = ['name', 'term', 'interest', 'min_down', 'max_loan', 'edit'];
  dataSource = BANK_DATA;
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  add() {
    this.edit(Default_Bank)
  }

  edit(bank: Bank) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = bank;

    const dialogRef = this.dialog.open(BankEditComponent, dialogConfig);

    dialogRef.afterClosed().pipe(
      filter(val => val!!),
      tap(() => console.log("bank changed. implement!"))
    ).subscribe()

  }

}
