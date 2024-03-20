import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Photos } from 'src/app/_interfaces/photos';
import { UserService } from 'src/app/_services/user.services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  page = 1;
  perPage = 10; // 2600
  isLoading:boolean=false; 
  isFullyLoaded:boolean=false;
  photos:any=[]


  constructor(
		private userServices: UserService,
    private router: Router
	) {}

	ngOnInit(): void {
    if(localStorage.getItem('token')){
      this.getListPhotos()
    } else {
      this.router.navigate(['/login']);
    }
		
	}

  getListPhotos(){
    this.isLoading=true
    this.userServices.getPhotos(this.page,this.perPage).subscribe((res:any) => {

      setTimeout(()=>{ 
        if(res.length>0){
          res.forEach((element:Photos) => {
            this.photos.push(element)
          });
        } else {
          this.isFullyLoaded=true
        }
        this.isLoading=false
      }, 1000) 

    },
    (err) => {
      this.isLoading=false
    }
    
    );
	}

  @HostListener('window:scroll',['$event'])
  onWindowScroll(event:any){

    // if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading){
    if(window.innerHeight+window.scrollY>=(document.body.offsetHeight*90/100)&&!this.isLoading){
      console.log(event);
      if(!this.isFullyLoaded){
        if(this.photos?.length>0){
          this.page++
          this.getListPhotos()
        }
      }
    }

  }
}
