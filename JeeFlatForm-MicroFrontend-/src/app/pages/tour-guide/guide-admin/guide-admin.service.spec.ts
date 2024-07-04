import { TestBed } from '@angular/core/testing';

import { GuideAdminService } from './guide-admin.service';

describe('GuideAdminService', () => {
  let service: GuideAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuideAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
