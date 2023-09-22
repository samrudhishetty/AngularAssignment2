import { Component } from '@angular/core';
import { Employee } from './employee.model';
import { EmployeeRestService } from '../services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent {
  displayedColumns: string[] = ['fullName', 'contact', 'email', 'dob', 'address', 'actions'];
  empObject: Employee = new Employee();

  employees: Array<Employee> = new Array<Employee>();
  isUpdateMode: any;
  isRecordSelected: boolean = false;
  

  constructor(private employeeRestService: EmployeeRestService) {
    
    this.loadqueryEmployees();
  }

  clear() {
    this.empObject = new Employee();
    
  }
  
  /* Loading Employee's */
  /* Loading Employee's via db.json*/
  // loadEmployees() {
  //   return this.employeeRestService.getEmployees().subscribe((data: Employee[]) => {
      
  //     this.employees = new Array<Employee>();
  //     for (let item of data) {
  //       let employee: Employee = new Employee();
  //       employee.id = item.id;
  //       employee.first_name = item.first_name;
  //       employee.last_name = item.last_name;
  //       employee.contact = item.contact;
  //       employee.email = item.email;
  //       employee.dob = item.dob;
  //       employee.address = item.address;
  //       this.employees.push(employee)
  //     }
  //     this.clear();
  //   });
  // }
  
  /* Loading Employee's via mysql*/
  loadqueryEmployees() {
    return this.employeeRestService.getqueryEmployees().subscribe((data: Employee[]) => {

      this.employees = new Array<Employee>();
      for (let item of data) {
        let employee: Employee = new Employee();
        employee.id = item.id;
        employee.first_name = item.first_name;
        employee.last_name = item.last_name;
        employee.contact = item.contact;
        employee.email = item.email;
        // const dob = new Date(item.dob)
        // const formatdob = dob.toLocaleDateString();
        employee.dob = item.dob;
        employee.address = item.address;
        this.employees.push(employee)
      }
      this.clear();
    });
  }

  /* Selecting a particular Record either in db.json / mysql */
  select(selectedEmployees: Employee) {
    this.empObject = Object.assign({}, selectedEmployees);
    
  }




  

  /* Insertion */
  /* Insertion within db.json*/
  // submit() {
  //   var employeedto: any = {};
  //   employeedto.first_name = this.empObject.first_name;
  //   employeedto.last_name = this.empObject.last_name;
  //   employeedto.contact = this.empObject.contact;
  //   employeedto.email = this.empObject.email;
  //   employeedto.dob = this.empObject.dob;
  //   employeedto.address = this.empObject.address;
    
  //   this.employeeRestService.createEmployees(employeedto).subscribe((data: {}) => {
  //     window.alert("Data Inserted Successfully!!!")
  //   });
  //   this.loadEmployees();
  // }
  
  /* Insertion within mysql*/
  insertEmployee() {
    var employeedto: any = {};
    employeedto.first_name = this.empObject.first_name;
    employeedto.last_name = this.empObject.last_name;
    employeedto.contact = this.empObject.contact;
    employeedto.email = this.empObject.email;
    employeedto.dob = this.empObject.dob;
    employeedto.address = this.empObject.address;

    this.employeeRestService.insertqueryEmployees(employeedto).subscribe(
      (response) => {
        console.log('Employee inserted successfully', response);
      },
      (error) => {
        console.error('Error inserting employee', error);
    });
    
    this.loadqueryEmployees();
  }







  /* Deletion */
  /* Deletion within db.json*/
  // delete() {
  //   let id = this.empObject.id;
  //   this.employeeRestService.deleteEmployees(id).subscribe((data: {}) => {
  //     window.alert("Data Deleted Successfully!!!")
  //   });
  //   this.loadEmployees();
  // }

  /* Deletion within mysql*/
  // deleteEmployee() {
  //   let id = this.empObject.id;
  //   this.employeeRestService.deletequeryEmployees(id).subscribe((data: {}) => {
  //     window.alert("Data Deleted Successfully!!!")
  //   });
  //   this.loadqueryEmployees();
  // }

  selectAndDelete(selectedEmployee: Employee) {
    if (window.confirm('Are you sure you want to delete this employee?')) {
        this.employeeRestService.deletequeryEmployees(selectedEmployee.id).subscribe((data: {}) => {
            window.alert("Data Deleted Successfully!!!");
            this.loadqueryEmployees();
        });
    }
}


  /* Updation */
  /* Updation within db.json*/
  // update() {
  //   var employeedto: any = {};
  //   employeedto.id = this.empObject.id;
  //   employeedto.first_name = this.empObject.first_name;
  //   employeedto.last_name = this.empObject.last_name;
  //   employeedto.contact = this.empObject.contact;
  //   employeedto.email = this.empObject.email;
  //   employeedto.dob = this.empObject.dob;
  //   employeedto.address = this.empObject.address;
    
    
  //   this.employeeRestService.updateEmployees(employeedto.id, employeedto).subscribe((data: {}) => {
  //     window.alert("Data Updated Successfully!!!")
  //   });
  //   this.loadEmployees();
  // }
  
  /* Updation within mysql*/
  
  selectAndUpdate(selectedEmployee: Employee) {
    // Assuming you want to confirm the update action
    if (window.confirm('Are you sure you want to update this employee?')) {
      // Assign the selected employee to empObject for editing
      this.empObject = Object.assign({}, selectedEmployee);
  
      // Set a flag to indicate that you're in update mode
      this.isRecordSelected = true;
    }
  }

  insertOrUpdateEmployee() {
    // Check if a record is selected (update mode)
    if (this.isRecordSelected) {
      // Perform the update
      var employeedto: any = {
        id: this.empObject.id,
        first_name: this.empObject.first_name,
        last_name: this.empObject.last_name,
        contact: this.empObject.contact,
        email: this.empObject.email,
        dob: this.empObject.dob,
        address: this.empObject.address
      };
  
      this.employeeRestService.updatequeryEmployees(employeedto.id, employeedto).subscribe((data: {}) => {
        window.alert("Data Updated Successfully!!!");
        this.loadqueryEmployees();
        this.clear(); // Clear the form after updating
        this.isRecordSelected = false; // Reset the flag
      });
    } else {
      // Check the form validity for insertion
      if (!this.empObject.formCustomerGroup.valid) {
        alert('Please fill all valid employee details');
        return;
      }
  
      // Perform the insertion
      var employeedto: any = {
        first_name: this.empObject.first_name,
        last_name: this.empObject.last_name,
        contact: this.empObject.contact,
        email: this.empObject.email,
        dob: this.empObject.dob,
        address: this.empObject.address
      };
  
      this.employeeRestService.insertqueryEmployees(employeedto).subscribe((response) => {
        console.log('Employee inserted successfully', response);
        this.loadqueryEmployees();
        this.clear(); // Clear the form after inserting
      });
    }
  }
  

  hasError(typeofvalidator: string, controlname: string): boolean {
    return this.empObject
      .formCustomerGroup
      .controls[controlname]
      .hasError(typeofvalidator)
  }
}