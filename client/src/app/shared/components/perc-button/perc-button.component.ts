import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'perc-button',
  templateUrl: './perc-button.component.html',
  styleUrls: ['./perc-button.component.css']
})
export class PercButtonComponent {
  @Input() label?: string = '';
  @Input() icon?: string;
  @Input() color: 'primary' | 'accent' | 'warn' | '' = 'primary';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() class?: string;
  
  @Output() clicked = new EventEmitter<void>();

  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      event.stopPropagation();
      this.clicked.emit();
    }
  }
}
