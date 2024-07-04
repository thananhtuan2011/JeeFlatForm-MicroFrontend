import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadTailieuGroupComponent } from './load-tailieu-group.component';

describe('LoadTailieuGroupComponent', () => {
  let component: LoadTailieuGroupComponent;
  let fixture: ComponentFixture<LoadTailieuGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadTailieuGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadTailieuGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
