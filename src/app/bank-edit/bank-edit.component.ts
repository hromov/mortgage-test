import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Bank } from '../services/banks.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-bank-edit',
  templateUrl: './bank-edit.component.html',
  styleUrls: ['./bank-edit.component.scss']
})
export class BankEditComponent implements AfterViewInit {

  form: FormGroup;
  bank: Bank;

  formatLabel(value: number) {
    return Math.round(value * 100) + '%';
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BankEditComponent>,
    @Inject(MAT_DIALOG_DATA) bank: Bank,
    private storeService: StoreService,
  ) {
    this.bank = bank;

    this.form = fb.group({
      name: [bank.name, Validators.required],
      interest: [bank.interest, Validators.required],
      max_loan: [bank.max_loan, Validators.required],
      min_down: [bank.min_down, Validators.required],
      term: [bank.term, Validators.required],
    });
  }

  ngAfterViewInit(): void {

  }

  save() {

    // const changes = this.form.value;
    // console.log(changes)
    const newBank = {
      ...this.bank,
      ...this.form.value
    }
    console.log("bank to chanhe: ", newBank)
    //optimistic variant. Prevent clossing or make inform message
    this.storeService.saveBank(newBank).subscribe()

    this.dialogRef.close(newBank)



  }

  close() {
    this.dialogRef.close();
  }

  delete() {
    this.storeService.deleteBank(this.bank.id).subscribe()
    
    this.dialogRef.close();
  }

}
