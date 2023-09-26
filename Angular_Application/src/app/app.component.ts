import { Component } from '@angular/core';
import { JwtService } from './jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular_Application';
  constructor( private jwtservice : JwtService){

  }

  getFirstId(){
    return this.jwtservice.getFirstId();
  }

}
