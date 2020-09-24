import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private storage: Storage) { }

  async setLocalStorage(responseObj) {
    localStorage.setItem('id_token', responseObj.body.token);
    await this.storage.set('id_token', responseObj.body.token);
  }

  async logout() {
    localStorage.removeItem('id_token');
    await this.storage.remove('id_token');
  }
}
