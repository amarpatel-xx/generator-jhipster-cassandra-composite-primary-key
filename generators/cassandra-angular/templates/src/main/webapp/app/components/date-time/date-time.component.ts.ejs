import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-date-time',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true,
    },
  ],
})
export class DateTimeComponent implements OnInit, ControlValueAccessor {
  editForm: FormGroup;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};

  // eslint-disable-next-line @typescript-eslint/member-ordering
  disabled = false;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() dateTimeLabel = 'Date-Time Label'; // Input property for the label
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() labelClass = 'default-label-class'; // Dynamic class for the label

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() timestampChange = new EventEmitter<number>(); // Emit the UTC timestamp

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() isValid = new EventEmitter<boolean>();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor() {
    this.editForm = new FormGroup(
      {
        date: new FormControl(null, Validators.required),
        hours: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(12)]),
        minutes: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(59)]),
        amPm: new FormControl(null, Validators.required),
        seconds: new FormControl(0),
        milliseconds: new FormControl(0),
      },
      { validators: this.dateTimeValidator }, // Attach the custom validator
    );
  }

  ngOnInit(): void {
    // Listen to changes on relevant fields and reset seconds and milliseconds
    this.editForm.valueChanges.subscribe(() => {
      this.updateTimestamp();
      this.onTouched();
      this.isValid.emit(this.editForm.valid); // Emit the valid property directly
    });
  }

  updateTimestamp(): void {
    const { date, hours, minutes, amPm } = this.editForm.value;

    if(amPm) {
      let adjustedHours = parseInt(hours, 10);
      if (amPm === 'PM' && adjustedHours !== 12) {
        adjustedHours += 12;
      } else if (amPm === 'AM' && adjustedHours === 12) {
        adjustedHours = 0;
      }

      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(adjustedHours);
      combinedDateTime.setMinutes(parseInt(minutes, 10));
      combinedDateTime.setSeconds(0);
      combinedDateTime.setMilliseconds(0);

      const timestamp = combinedDateTime.getTime();
      this.onChange(timestamp); // Notify Angular forms of the change
      this.timestampChange.emit(timestamp);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    if (value) {
      const newDate = new Date(value);
      this.editForm.setValue(
        {
          date: newDate,
          hours: this.padZero(newDate.getHours() % 12 || 12), // Format hours as 2 digits
          minutes: this.padZero(newDate.getMinutes()), // Format minutes as 2 digits
          amPm: newDate.getHours() >= 12 ? 'PM' : 'AM',
          seconds: newDate.getSeconds(),
          milliseconds: newDate.getMilliseconds(),
        },
        { emitEvent: false },
      );
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.editForm.disable(); // Disable all controls
    } else {
      this.editForm.enable(); // Enable all controls
    }
  }

  updateLabel(newLabel: string): void {
    this.dateTimeLabel = newLabel;
  }

  setLabelClass(newClass: string): void {
    this.labelClass = newClass;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  onInput(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    const paddedValue = this.padZero(parseInt(input.value, 10));
    this.editForm.get(field)?.setValue(paddedValue, { emitEvent: true });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dateTimeValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const date = formGroup.get('date')?.value;
    const hours = formGroup.get('hours')?.value;
    const minutes = formGroup.get('minutes')?.value;
    const amPm = formGroup.get('amPm')?.value;
  
    if (!date || !hours || !minutes || !amPm) {
      return { dateTimeInvalid: true }; // Return an error object
    }
    return null; // Return null if valid
  };
}
