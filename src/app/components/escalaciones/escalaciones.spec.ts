import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Escalaciones } from './escalaciones';

describe('Escalaciones', () => {
  let component: Escalaciones;
  let fixture: ComponentFixture<Escalaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Escalaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Escalaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
