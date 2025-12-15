import { Component, Input } from '@angular/core';

export type AlertType = 'info' | 'warning' | 'error' | 'success';

@Component({
  selector: 'perc-alert',
  templateUrl: './perc-alert.component.html',
  styleUrls: ['./perc-alert.component.css']
})
export class PercAlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message: string = '';
  @Input() icon?: string;
  @Input() class?: string;

  get defaultIcon(): string {
    switch (this.type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'check_circle';
      default:
        return 'info';
    }
  }

  get displayIcon(): string {
    return this.icon || this.defaultIcon;
  }

  getAlertClasses(): string {
    const typeClasses = {
      info: 'bg-blue-50/60 border border-blue-200/50',
      warning: 'bg-amber-50/60 border border-amber-200/50',
      error: 'bg-red-50/60 border border-red-200/50',
      success: 'bg-green-50/60 border border-green-200/50'
    };
    return typeClasses[this.type] || typeClasses.info;
  }

  getIconClasses(): string {
    const typeClasses = {
      info: 'text-blue-600',
      warning: 'text-amber-600',
      error: 'text-red-600',
      success: 'text-green-600'
    };
    return `text-[20px] w-5 h-5 ${typeClasses[this.type] || typeClasses.info}`;
  }

  getTextClasses(): string {
    const typeClasses = {
      info: 'text-slate-600',
      warning: 'text-amber-700',
      error: 'text-red-700',
      success: 'text-green-700'
    };
    return `text-center ${typeClasses[this.type] || typeClasses.info}`;
  }
}
