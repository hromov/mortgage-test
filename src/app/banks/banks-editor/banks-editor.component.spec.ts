import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksEditorComponent } from './banks-editor.component';

describe('BanksEditorComponent', () => {
  let component: BanksEditorComponent;
  let fixture: ComponentFixture<BanksEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanksEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
