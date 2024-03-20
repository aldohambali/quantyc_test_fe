import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.services';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const user = this.authService.isAuthenticated()
      if (user) {
          // // authorised so return true
          // return true;

          //cek authorised page
          var isadmin = this.authService.isAdmin()
          if(!isadmin){ //if user
            if(state.url=='/page/admin'){
              localStorage.clear()
              this.router.navigate(['/login']);
              return false
            } 
          }
          return true


      }
  
      // not logged in so redirect to login page with the return url

      localStorage.clear()
      this.router.navigate(['/login']);
      return false;
  }

  canLoad() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    return this.authService.isAuthenticated();
  }
  
}
