import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AutenticarService } from '../service/autenticar.service';

@Injectable()
export class CanActivateAuthGuard implements CanActivate {

  constructor(private router: Router, private autenticarService: AutenticarService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.autenticarService.isLoggedIn()) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}