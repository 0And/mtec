import { Directive } from '@angular/core';
import { ValidatorFn, FormGroup, ValidationErrors, NG_VALIDATORS, Validator, AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export const sameAmountValidator: ValidatorFn = (control: FormGroup): ValidationErrors |
null => {
  const amount = control.get('amount');
  const questionNum = control.get('questionNum');

  return amount && questionNum && questionNum.value % Number(amount.value) !== 0 ? {'notDivisibleByPlayers': true} :
  null;
}

@Directive({
  selector: '[appSameAmount]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SameAmountValidatortDirective,
  multi: true}]
})
export class SameAmountValidatortDirective implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid);
  }
}
