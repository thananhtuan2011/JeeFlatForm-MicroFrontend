import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListYeuCauDuyetComponent } from './list-yeu-cau-duyet.component';

describe('ListYeuCauDuyetComponent', () => {
  let component: ListYeuCauDuyetComponent;
  let fixture: ComponentFixture<ListYeuCauDuyetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListYeuCauDuyetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListYeuCauDuyetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
