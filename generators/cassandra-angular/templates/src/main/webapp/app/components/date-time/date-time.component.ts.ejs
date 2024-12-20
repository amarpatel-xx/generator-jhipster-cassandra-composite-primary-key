import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
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
  constructor() {
    this.editForm = new FormGroup({
      date: new FormControl(null, Validators.required),
      hours: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(12)]),
      minutes: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(59)]),
      amPm: new FormControl(null, Validators.required),
      seconds: new FormControl(0),
      milliseconds: new FormControl(0),
    });
  }

  ngOnInit(): void {
    // Listen to changes on relevant fields and reset seconds and milliseconds
    this.editForm.valueChanges.subscribe(() => {
      this.updateTimestamp();
      this.onTouched();
    });
  }

  updateTimestamp(): void {
    const { date, hours, minutes, amPm } = this.editForm.value;

    let adjustedHours = hours;
    if (amPm === 'PM' && hours !== 12) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      adjustedHours += 12;
    } else if (amPm === 'AM' && hours === 12) {
      adjustedHours = 0;
    }

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(adjustedHours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0);
    combinedDateTime.setMilliseconds(0);

    const timestamp = combinedDateTime.getTime();
    this.onChange(timestamp); // Notify Angular forms of the change
    this.timestampChange.emit(timestamp);
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    if (value) {
      const newDate = new Date(value);
      this.editForm.setValue(
        {
          date: newDate,
          hours: newDate.getHours() % 12 || 12,
          minutes: newDate.getMinutes(),
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
}
