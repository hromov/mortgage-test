import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter, tap } from 'rxjs';
import { BankEditComponent } from 'src/app/bank-edit/bank-edit.component';
import { Bank } from 'src/app/services/banks.service';


const Default_Bank: Bank = {
  id: "",
  name: "Bank name",
  interest: 0.2,
  max_loan: 10000,
  min_down: 0.1,
  term: 12,
}

@Component({
  selector: 'app-banks-editor',
  templateUrl: './banks-editor.component.html',
  styleUrls: ['./banks-editor.component.scss']
})
export class BanksEditorComponent implements OnInit {
  
  displayedColumns: string[] = ['name', 'term', 'interest', 'min_down', 'max_loan', 'edit'];
  
  @Input()
  dataSource: Bank[] = [];
  
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
