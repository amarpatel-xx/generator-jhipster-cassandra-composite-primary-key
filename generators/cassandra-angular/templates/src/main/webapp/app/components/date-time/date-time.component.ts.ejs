import { Component, EventEmitter, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-date-time',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
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
  @Output() timestampChange = new EventEmitter<number>(); // Emit the UTC timestamp

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor() {
    const now = new Date();

    this.editForm = new FormGroup({
      date: new FormControl(new Date(now.getFullYear(), now.getMonth(), now.getDate())),
      hours: new FormControl(now.getHours() % 12 || 12), // Convert to 12-hour format
      minutes: new FormControl(now.getMinutes()),
      amPm: new FormControl(now.getHours() >= 12 ? 'PM' : 'AM'),
      seconds: new FormControl(now.getSeconds()), // Hidden default value
      milliseconds: new FormControl(now.getMilliseconds()), // Hidden default value
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
    const { date, hours, minutes, amPm, seconds, milliseconds } = this.editForm.value;

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
    combinedDateTime.setSeconds(seconds);
    combinedDateTime.setMilliseconds(milliseconds);

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
}
