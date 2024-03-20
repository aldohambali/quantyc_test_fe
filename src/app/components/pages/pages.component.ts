import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/_services/admin.services';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
  name:string=''
  loading:boolean=false
	constructor(
		private adminServices: AdminService,
    private router: Router
	) {}
	ngOnInit(): void {
    var dataUser = localStorage.getItem('user')
    if(dataUser){
      var user = JSON.parse(dataUser);
      if(user.name){
        this.name = user.name
      } else {
        this.name = user.username
      }
    }
    
	}

  logout(){
    this.adminServices.postLogout().subscribe(
      (res:any) => {

        this.loading=false
        if(res.success){
          localStorage.clear()
          this.router.navigate(['/login']);
        }
      
      }
    );
  }

}
