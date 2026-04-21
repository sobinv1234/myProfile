import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from './sucess-dialog/sucess-dialog';

@Directive({
  selector: '[appSuccessDialog]'
})
export class SuccessDialogDirective {

  @Input() successMessage: string = 'Message sent successfully!';

  constructor(private dialog: MatDialog) {}

  @HostListener('click')
  onClick() {
    this.dialog.open(SuccessDialogComponent, {
      data: { message: this.successMessage }
    });
  }
}