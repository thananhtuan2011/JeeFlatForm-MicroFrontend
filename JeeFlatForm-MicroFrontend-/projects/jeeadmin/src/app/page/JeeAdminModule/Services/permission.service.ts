
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { JeeAdminService } from './jeeadmin.service';

@Injectable()
export class PermissionUrl implements CanActivate {

	constructor(
        private router: Router,
        public jeeAdminService: JeeAdminService
	) { }

    isAdmin: boolean = false;
	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let res = await this.jeeAdminService.checkAdmin().toPromise();
		if (res) {
			if (res && res.status == 1) {
				this.isAdmin = res.data;
			}
		}

		if (!this.isAdmin) {
            this.router.navigate(['/Admin']);
            return false;
        }

        return true;
	}
}
