import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-map-string-component',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './map-string-component.component.html',
  styleUrls: ['./map-string-component.component.css'],
})
export class MapStringComponent {
  @Input() inputFields: Map<string, string> = new Map<string, string>();
  @Output() dataChange = new EventEmitter<Map<string, string>>();

  mapDetails: Map<string, string> = new Map<string, string>();

  constructor() {
    this.mapDetails = new Map(this.inputFields);
  }

  ngOnChanges(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.inputFields) {
      this.mapDetails = new Map(this.inputFields);
    }
  }

  addRow(key: string, value: string): void {
    if (key) {
      this.mapDetails.set(key, value);
      this.emitData();
    }
  }

  updateValue(key: string, value: string): void {
    if (this.mapDetails.has(key)) {
      this.mapDetails.set(key, value);
      this.emitData();
    }
  }

  handleInputChange(event: Event, key: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.updateValue(key, inputElement.value);
  }

  private emitData(): void {
    this.dataChange.emit(new Map(this.mapDetails));
  }
}
