import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private form: FormGroup;

  constructor(private formBuilder: FormBuilder, 
              private http: HttpClient,
              private authService: AuthService,
              public navCtrl: NavController,
              private storage: Storage,
              public alertController: AlertController) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

    // search for jwt in storage
    let idToken = localStorage.getItem("id_token");
    if (!idToken) {
      this.storage.get('id_token').then(token => {
        if (token) {
          idToken = token;
        }
      });
    }

    // if jwt in storage, navigate to home page
    if (idToken) {
      this.navCtrl.navigateRoot(['users/courses'], {animated: true, animationDirection: 'forward'});
    }
  }

  logForm() {
    // set url and headers
    const url = 'http://192.168.1.175:3000/login';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // post the request 
    this.http.post(url, this.form.value, { headers, observe: 'response' }).subscribe(
      async res => {
        // success, set jwt in storage and navigate to home page
        await this.authService.setLocalStorage(res);
        this.navCtrl.navigateRoot(['users/courses'], {animated: true, animationDirection: 'forward'});
      },
      err => {
        // error
        this.handleError(err);
      });
  }

  async handleError(error) {
    let message;
    if (error.status === 401) {
      message = 'Invalid login. Please try again.';
    } else {
      message = 'Network error. Please check your internet connection.';
    }
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: [{
        text: 'Okay',
        role: 'cancel'
      }]
    });
    await alert.present();
  }

}
