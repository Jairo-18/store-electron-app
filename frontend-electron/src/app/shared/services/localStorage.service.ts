import { Injectable } from '@angular/core';
//import { UserDataInterface } from '../interfaces/local-storage.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  }

  getUserData() {
    const allData = localStorage.getItem('_sessionData');
    if (allData) {
      try {
        const parsedData = JSON.parse(allData);
        return parsedData?.user || null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_e) {
        return null;
      }
    }
    return null;
  }

  cleanLocalStorage(): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    localStorage.clear();
  }

  getItem(key: string) {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    return localStorage.getItem(key);
  }

  setRedirectUrl(url: string): void {
    localStorage.setItem('redirectUrl', url);
  }

  getRedirectUrl(): string {
    return localStorage.getItem('redirectUrl') || '';
  }

  cleanRedirectUrl(): void {
    localStorage.removeItem('redirectUrl');
  }
}
