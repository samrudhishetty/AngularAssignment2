import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";


@Injectable({providedIn:  'root'})
export class AuthGuard {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(state.url === '/welcome') {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }

}