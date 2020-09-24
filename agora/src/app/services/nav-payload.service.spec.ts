import { TestBed } from '@angular/core/testing';

import { NavPayloadService } from './nav-payload.service';

describe('NavPayloadService', () => {
  let service: NavPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavPayloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
