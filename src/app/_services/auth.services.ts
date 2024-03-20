import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isAuthenticated(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }
  isAdmin(): boolean {
    var user:any = localStorage.getItem('user')
    if(user){
        var user = JSON.parse(user)
        console.log('user.role',user.role)
        if(user.role==0){
            return true
        }
    }
    return false;
  }
}