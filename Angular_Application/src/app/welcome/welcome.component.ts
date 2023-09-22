import { Component } from '@angular/core';
import { EmployeeRestService } from '../services/employee.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Employee } from '../employee/employee.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  first_id : number;
  employeeObj : Employee = new Employee();

  constructor(private route: ActivatedRoute,private employeeRestService: EmployeeRestService, private router: Router) {
    this.route.params.subscribe(params => this.first_id = params['id'])
    this.getEmployeesById(this.first_id);
  }
  
  
  getEmployeesById(first_id: number) {
    return this.employeeRestService.getEmployeesByQuery(first_id).subscribe((data : Employee) => {
    
      this.employeeObj = data;
      console.log(this.employeeObj);
    
    })
  }

  logout() {
    this.router.navigate(['login']);
  }

}
