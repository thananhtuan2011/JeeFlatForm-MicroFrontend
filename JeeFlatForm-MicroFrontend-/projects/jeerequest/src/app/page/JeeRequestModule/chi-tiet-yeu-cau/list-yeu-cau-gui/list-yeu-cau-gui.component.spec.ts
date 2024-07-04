import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListYeuCauGuiComponent } from './list-yeu-cau-gui.component';

describe('ListYeuCauGuiComponent', () => {
  let component: ListYeuCauGuiComponent;
  let fixture: ComponentFixture<ListYeuCauGuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListYeuCauGuiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListYeuCauGuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
