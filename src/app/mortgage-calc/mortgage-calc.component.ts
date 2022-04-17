import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, Observable, of, tap } from 'rxjs';
import { Bank } from '../services/banks.service';
import { StoreService } from '../services/store.service';

function monthlyCalc(loan: number, interest: number, term: number): number {
  const m = (loan * (interest / 12) * Math.pow(1 + interest / 12, term)) / (Math.pow(1 + interest / 12, term) - 1)
  console.log(m)
  return m
}

@Component({
  selector: 'app-mortgage-calc',
  templateUrl: './mortgage-calc.component.html',
  styleUrls: ['./mortgage-calc.component.scss']
})
export class MortgageCalcComponent implements OnInit {

  form: FormGroup;
  banks$: Observable<Bank[]> = of([]);

  selectedBank: any;
  minDown: number = 0;
  monthlyMortgage: number = 0;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
  ) {
    this.form = fb.group({
      loan: [10000, Validators.required],
      down: [3000, Validators.required],
      bank: ["", Validators.required],
    });
  }

  get bankSelection() {
    return this.form.get('bank') as FormControl;
  }

  get loanField() {
    return this.form.get('loan') as FormControl;
  }

  get downField() {
    return this.form.get('down') as FormControl;
  }

  ngOnInit(): void {
    this.banks$ = this.storeService.banks$.pipe(
      filter(value => !!value),
      tap(banks => {
        if (banks.length) {
          this.selectedBank = banks[0]
          this.form.patchValue({ 'bank': this.selectedBank.id })
          this.bankChanged()
        }
      }),
    )

    this.bankSelection.valueChanges.subscribe(bankId => {
      if (this.selectedBank != bankId) {
        this.selectedBank = this.storeService.getBank(bankId)
        this.bankChanged()
      }
    })

    this.loanField.valueChanges.subscribe(value => {
      this.minDownChanged(value);
    })

    this.form.valueChanges.subscribe(values => {
      // console.log(values)
      this.monthlyMortgage = monthlyCalc(values.loan - values.down, this.selectedBank.interest, this.selectedBank.term)
    })
  }

  bankChanged() {
    const loanValidators = [Validators.required, Validators.max(this.selectedBank.max_loan)];
    this.loanField.setValidators(loanValidators);
    this.loanField.updateValueAndValidity();
    this.downField.updateValueAndValidity();
  }

  minDownChanged(value: number) {
    this.minDown = this.selectedBank.min_down * value
    const downValidators = [Validators.required, Validators.min(this.minDown)];
    this.downField.setValidators(downValidators);
    this.downField.updateValueAndValidity();
  }

  // change(values?: any) {
  //   const loanValidators = [Validators.required, Validators.max(this.selectedBank.max_loan)];
  //   const downValidators = [Validators.required, Validators.min(this.selectedBank.min_down)];
  //   this.form.removeControl('loan')
  //   this.form.removeControl('down')
  //   this.form.addControl('loan', new FormControl(values.loan, loanValidators))
  //   this.form.addControl('down', new FormControl(values.down, downValidators))
  //   this.form.updateValueAndValidity();
  // }

}
