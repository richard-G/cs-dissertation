import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavPayloadService {
  // used to pass any parameters/objects between pages.
  // parent page (sender) calls set(data), which can later be retrieved with get() by the child page
  payload: any = {};

  constructor() { }

  set(data) {
    Object.keys(data).forEach(key => {
      this.payload[key] = data[key];
    });
  }

  get() {
    return this.payload;
  }
}
