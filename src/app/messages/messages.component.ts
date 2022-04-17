import { Component, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  showMessages = false;
  errors$: Observable<string[]> = of([]);

  constructor(public messagesService: MessagesService) {

  }

  ngOnInit() {
    this.errors$ = this.messagesService.errors$
      .pipe(
        tap(() => this.showMessages = true)
      );

  }


  onClose() {
    this.showMessages = false;

  }

}
