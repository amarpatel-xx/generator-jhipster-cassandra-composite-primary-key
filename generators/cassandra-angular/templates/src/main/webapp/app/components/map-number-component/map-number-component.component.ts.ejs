import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-map-number-component',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './map-number-component.component.html',
  styleUrls: ['./map-number-component.component.css'],
})
export class MapNumberComponent {
  @Input() inputFields: Map<string, number> = new Map<string, number>();
  @Output() dataChange = new EventEmitter<Map<string, number>>();

  mapDetails: Map<string, number> = new Map<string, number>();

  constructor() {
    this.mapDetails = new Map(this.inputFields);
  }

  ngOnChanges(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.inputFields) {
      this.mapDetails = new Map(this.inputFields);
    }
  }

  addRow(key: string, value: number): void {
    if (key) {
      this.mapDetails.set(key, value);
      this.emitData();
    }
  }

  updateValue(key: string, value: number): void {
    if (this.mapDetails.has(key)) {
      this.mapDetails.set(key, value);
      this.emitData();
    }
  }

  handleInputChange(event: Event, key: string): void {
    const inputElement = event.target as HTMLInputElement;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const value: number = Number(inputElement.value); // Convert to number
    this.updateValue(key, value);
  }

  private emitData(): void {
    this.dataChange.emit(new Map(this.mapDetails));
  }
}
