import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucessDialog } from './sucess-dialog';

describe('SucessDialog', () => {
  let component: SucessDialog;
  let fixture: ComponentFixture<SucessDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucessDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucessDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
