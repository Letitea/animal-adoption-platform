import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Animal {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  status: string;
  description: string;
}

interface HealthResponse {
  status: string;
  database: string;
  timestamp: string;
}

interface AnimalsResponse {
  count: number;
  data: Animal[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly animals = signal<Animal[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly healthStatus = signal<'checking' | 'ok' | 'error'>('checking');
  readonly databaseStatus = signal('檢查中...');

  ngOnInit(): void {
    this.loadPlatformData();
  }

  loadPlatformData(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.healthStatus.set('checking');
    this.databaseStatus.set('檢查中...');

    this.http.get<HealthResponse>('/api/health').subscribe({
      next: (res) => {
        this.healthStatus.set(res.status === 'ok' ? 'ok' : 'error');
        this.databaseStatus.set(
          res.database === 'connected' ? 'PostgreSQL 已連線' : '資料庫未連線'
        );
      },
      error: () => {
        this.healthStatus.set('error');
        this.databaseStatus.set('API 連線失敗');
      },
    });

    this.http.get<AnimalsResponse>('/api/animals').subscribe({
      next: (res) => {
        this.animals.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          '無法取得待領養動物資料，請確認後端 API 與資料庫是否已啟動。'
        );
        this.loading.set(false);
      },
    });
  }

  getSpeciesEmoji(species: string): string {
    if (species.includes('貓')) {
      return '🐱';
    }
    if (species.includes('狗')) {
      return '🐶';
    }
    return '🐾';
  }
}
