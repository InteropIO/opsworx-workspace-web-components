import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  debugLog(message: string) {
    console.log(`[DEBUG] ${message}`);
  }
}
