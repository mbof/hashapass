import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HashapassService } from './services/hashapass.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly hashapassService = inject(HashapassService);

  parameter = '';
  seed = '';
  result = signal('');
  copied = signal(false);
  showBanner = signal(true);

  zippyWhy = signal(false);
  zippyHow = signal(false);
  zippyWhere = signal(false);

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const dismissed = localStorage.getItem('hashapass_banner_dismissed');
      if (dismissed === '1') {
        this.showBanner.set(false);
      }
    }
  }

  onUpdate(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (!this.seed || !this.parameter) {
      return;
    }

    const output = this.hashapassService.generate(this.seed, this.parameter);
    this.result.set(output);
    this.seed = ''; // Clear master password for security, matching original behavior

    setTimeout(() => {
      const resultElem = document.getElementById('resultId') as HTMLInputElement | null;
      if (resultElem) {
        resultElem.focus();
        resultElem.select();
      }
    }, 0);
  }

  selectResult(event: MouseEvent): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      target.select();
    }
  }

  async copyToClipboard(): Promise<void> {
    const text = this.result();
    if (!text) {
      return;
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      }
    } catch {
      // Fallback: select element
      const resultElem = document.getElementById('resultId') as HTMLInputElement | null;
      if (resultElem) {
        resultElem.select();
      }
    }
  }

  dismissBanner(): void {
    this.showBanner.set(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('hashapass_banner_dismissed', '1');
    }
  }

  toggleZippy(section: 'why' | 'how' | 'where'): void {
    if (section === 'why') {
      this.zippyWhy.update((v) => !v);
    } else if (section === 'how') {
      this.zippyHow.update((v) => !v);
    } else if (section === 'where') {
      this.zippyWhere.update((v) => !v);
    }
  }
}
