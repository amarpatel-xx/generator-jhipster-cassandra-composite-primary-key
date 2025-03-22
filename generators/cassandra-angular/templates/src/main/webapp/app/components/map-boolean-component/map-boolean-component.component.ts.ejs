import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-map-boolean-component',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './map-boolean-component.component.html',
  styleUrls: ['./map-boolean-component.component.css'],
})
export class MapBooleanComponent {
  @Input() inputFields: Map<string, boolean> = new Map<string, boolean>();
  @Output() dataChange = new EventEmitter<Map<string, boolean>>();

  mapDetails: Map<string, boolean> = new Map<string, boolean>();

  constructor() {
    this.mapDetails = new Map(this.inputFields);
  }

  ngOnChanges(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.inputFields) {
      this.mapDetails = new Map(this.inputFields);
    }
  }

  addRow(key: string, value: boolean): void {
    if (key) {
      this.mapDetails.set(key, value);
      this.emitData();
    }
  }

  updateValue(key: string, value: boolean): void {
    if (this.mapDetails.has(key)) {
      this.mapDetails.set(key, value);
      this.emitData();
    }
  }

  handleInputChange(event: Event, key: string): void {
    const inputElement = event.target as HTMLInputElement;
    const value: boolean = inputElement.value.toLowerCase() === 'true'; // Convert to boolean
    this.updateValue(key, value);
  }

  private emitData(): void {
    this.dataChange.emit(new Map(this.mapDetails));
  }
}
