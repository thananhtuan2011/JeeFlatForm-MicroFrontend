import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadThaoluanComponent } from './load-thaoluan.component';

describe('LoadThaoluanComponent', () => {
  let component: LoadThaoluanComponent;
  let fixture: ComponentFixture<LoadThaoluanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadThaoluanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadThaoluanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
