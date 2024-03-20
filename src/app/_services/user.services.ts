import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Photos } from "../_interfaces/photos";

@Injectable({
  providedIn: "root",
})

export class UserService {
  apiRoot: string = "https://jsonplaceholder.typicode.com/";
  photosObs = new Subject();

  constructor(private http: HttpClient) {}

  photos(page:number,limit:number) {
    this.http
      .get<Photos>(this.apiRoot + "photos?_page="+page+"&_limit="+limit, {})
      .subscribe(
        (res) => {
          this.photosObs.next(res);
        },
        (err) => {
          console.log("err", err);
          alert('oops something wrong')
        }
      );
  }

  getPhotos(page:number,limit:number){
    this.photosObs = new Subject();
    this.photos(page,limit);
    return this.photosObs.asObservable();
  }

}