import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})

export class AdminService {
  apiRoot: string = "/api/";

  usersObs = new Subject();
  topicDetailObs = new Subject();
  
  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('token');
    console.log('authToken : ',authToken)
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    });
  }

  login(data:any) {
    return this.http.post<any>(
      this.apiRoot + "login",
      data,{}
    );
  }

  users() {
    const headers = this.getHeaders();
    console.log('headers : ',headers)
    this.http
      .get<any>(this.apiRoot + "users", {headers})
      .subscribe(
        (res) => {
          this.usersObs.next(res);
        },
        (err) => {
          console.log("err", err);
          if(err.status=='401'){
            //alert('redirect login')

            localStorage.clear()

            this.router.navigate(['/login']);
          } else {
            alert(err.message)
          }
          //alert('oops something wrong')
        }
      );
  }

  getUsers(){
    this.usersObs = new Subject();
    this.users();
    return this.usersObs.asObservable();
  }


  postRegis(data:any) {
    const headers = { 'Content-Type': 'application/json'};
    return this.http.post<any>(
      this.apiRoot + "register",
      data,{headers}
    );
  }

  postUpdateUser(data:any) {
    console.log('data:::',data)
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.apiRoot + "users",
      data,{headers}
    );
  }

  postDelete(data:any) {
    console.log('data:::',data)
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.apiRoot + "users/delete",
      data,{headers}
    );
  }
  
  postLogout() {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.apiRoot + "logout",
      null,{headers}
    );
  }
  
}