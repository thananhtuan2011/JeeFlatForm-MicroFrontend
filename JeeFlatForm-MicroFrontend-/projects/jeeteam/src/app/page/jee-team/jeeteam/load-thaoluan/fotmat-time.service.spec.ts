import { TestBed } from '@angular/core/testing';

import { FotmatTimeService } from './fotmat-time.service';

describe('FotmatTimeService', () => {
  let service: FotmatTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FotmatTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
