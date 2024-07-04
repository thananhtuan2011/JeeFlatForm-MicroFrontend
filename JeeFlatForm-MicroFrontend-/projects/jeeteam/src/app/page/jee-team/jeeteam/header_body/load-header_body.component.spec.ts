import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadHeaderBodyComponent } from './load-header_body.component';

describe('LoadThaoluanGroupComponent', () => {
  let component: LoadHeaderBodyComponent;
  let fixture: ComponentFixture<LoadHeaderBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadHeaderBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadHeaderBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
