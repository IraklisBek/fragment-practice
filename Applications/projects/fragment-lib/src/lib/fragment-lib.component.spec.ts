import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FragmentLibComponent } from './fragment-lib.component';

describe('FragmentLibComponent', () => {
  let component: FragmentLibComponent;
  let fixture: ComponentFixture<FragmentLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FragmentLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FragmentLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
