import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MychatContactComponent } from './mychat-contact.component';

describe('MychatContactComponent', () => {
  let component: MychatContactComponent;
  let fixture: ComponentFixture<MychatContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MychatContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MychatContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
