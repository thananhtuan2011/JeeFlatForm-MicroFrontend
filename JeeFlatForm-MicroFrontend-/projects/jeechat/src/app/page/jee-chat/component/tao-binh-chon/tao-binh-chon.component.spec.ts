import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaoBinhChonComponent } from './tao-binh-chon.component';

describe('TaoBinhChonComponent', () => {
  let component: TaoBinhChonComponent;
  let fixture: ComponentFixture<TaoBinhChonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaoBinhChonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaoBinhChonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
