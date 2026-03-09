import { IEvents } from "../base/Events.ts";
import { Component } from "../base/Component.ts";
import { ensureElement } from "../../utils/utils";

interface HeaderData {
  counter: string;
}


export class Header extends Component<HeaderData>{
  protected counterElement: HTMLElement;
  protected busketElement: HTMLButtonElement;

  constructor(protected events: IEvents, container:HTMLElement){
    super(container);

    this.counterElement  = ensureElement<HTMLElement>('.header__basket-counter', this.container)

    this.busketElement = ensureElement<HTMLButtonElement>('.header__basket', container)

    this.busketElement.addEventListener('click', ()=> {
      this.events.emit('basket:open')
    })
  }

  set counter(value:number){
    this.counterElement.textContent = String(value)
  }

 }

