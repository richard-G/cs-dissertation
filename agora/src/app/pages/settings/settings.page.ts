import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private authService: AuthService,
              public router: Router,
              public storage: StorageService) { }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logout();
    await this.storage.clearCache();
    this.router.navigate(['login'], { replaceUrl: true });
  }

}
