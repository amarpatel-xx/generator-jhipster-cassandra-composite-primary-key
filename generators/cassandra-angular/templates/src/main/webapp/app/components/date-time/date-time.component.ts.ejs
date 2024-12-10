import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-date-time',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.css'],
})
export class DateTimeComponent implements OnInit {
  editForm: FormGroup;

  @Output() timestampChange = new EventEmitter<number>(); // Emit the UTC timestamp

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
    this.editForm.get('date')?.valueChanges.subscribe(() => this.resetTime());
    this.editForm.get('hours')?.valueChanges.subscribe(() => this.resetTime());
    this.editForm.get('minutes')?.valueChanges.subscribe(() => this.resetTime());
    this.editForm.get('amPm')?.valueChanges.subscribe(() => this.resetTime());
  }

  resetTime(): void {
    this.editForm.patchValue({
      seconds: 0,
      milliseconds: 0,
    });
    this.updateTimestamp();
  }

  updateTimestamp(): void {
    const { date, hours, minutes, amPm, seconds, milliseconds } = this.editForm.value;

    let adjustedHours = hours;
    if (amPm === 'PM' && hours !== 12) {
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
    this.timestampChange.emit(timestamp);
  }
}
