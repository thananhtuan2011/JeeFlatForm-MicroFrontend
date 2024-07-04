import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCuocHopComponent } from './menu-cuoc-hop.component';

describe('MenuCuocHopComponent', () => {
  let component: MenuCuocHopComponent;
  let fixture: ComponentFixture<MenuCuocHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuCuocHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCuocHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
