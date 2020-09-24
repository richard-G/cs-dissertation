import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { AuthInterceptor } from './interceptors/auth-interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { ComponentsModule } from './components/components.module';
import { StorageService } from './services/storage.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
            IonicModule.forRoot(), 
            AppRoutingModule,
            HttpClientModule,
            IonicStorageModule.forRoot(),
            ComponentsModule
          ],
  providers: [
    // StatusBar,
    // SplashScreen,
    { provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy },
      AuthService,
      StorageService,
      {
        provide: HTTP_INTERCEPTORS  ,
        useClass: AuthInterceptor,
        multi: true
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
