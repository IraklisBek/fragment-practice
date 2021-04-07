import { TestBed } from '@angular/core/testing';

import { FragmentLibService } from './fragment-lib.service';

describe('FragmentLibService', () => {
  let service: FragmentLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FragmentLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
