import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenDTO} from '../../model/TokenDTO';

const API_URL = 'http://localhost:8080/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(API_URL + 'login', credentials, httpOptions);
  }
  public google(tokenDTO: TokenDTO): Observable<any> {
    return this.http.post<any>(API_URL + 'login-google', tokenDTO, httpOptions);
  }

  public facebook(tokenDTO: TokenDTO): Observable<any> {
    // console.log(this.httpOptions);
    return this.http.post<any>(API_URL + 'login-facebook', tokenDTO, httpOptions);
  }
  public send(value: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('to', value);
    return this.http.get<any>(API_URL + 'send', {params});
  }

  public confirm(value: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('code', value);
    return this.http.get<any>(API_URL + 'confirm', {params});
  }

  public resetPassWord(value: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('password', value);
    return this.http.get<any>(API_URL + 'resetPassWord', {params});
  }
}
