import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor( private storage: Storage) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let idToken = localStorage.getItem('id_token');
        if (!idToken) {
            this.storage.get('id_token').then(token => {
                if (token) {
                    idToken = token;
                }
            });
        }
        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', idToken)
            });
            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}
