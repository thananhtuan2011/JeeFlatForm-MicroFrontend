import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMenuWorkComponent } from './list-menu-work.component';

describe('ListMenuWorkComponent', () => {
  let component: ListMenuWorkComponent;
  let fixture: ComponentFixture<ListMenuWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMenuWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMenuWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
