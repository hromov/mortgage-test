import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bank } from '../services/banks.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {
  banks$: Observable<Bank[]> = of([]);

  constructor(private store: StoreService) {

  }

  ngOnInit(): void {
    this.banks$ = this.store.banks$;
  }

}
