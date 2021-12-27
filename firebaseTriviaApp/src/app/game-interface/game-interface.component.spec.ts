import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInterfaceComponent } from './game-interface.component';

describe('GameInterfaceComponent', () => {
  let component: GameInterfaceComponent;
  let fixture: ComponentFixture<GameInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
