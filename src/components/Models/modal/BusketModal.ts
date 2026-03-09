import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class BusketModal extends Component<IBasketData> {
  protected list: HTMLElement;
  protected button: HTMLButtonElement;
  protected price: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.list = ensureElement<HTMLElement>('.basket__list', container);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', container);
    this.price = ensureElement<HTMLElement>('.basket__price', container);

    this.button.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

  set items(items: HTMLElement[]) {
    this.list.innerHTML = '';

    if (items.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Корзина пуста';
      emptyMessage.classList.add('basket__empty');
      this.list.appendChild(emptyMessage);
      this.button.disabled = true;
    } else {
      items.forEach(item => this.list.appendChild(item));
      this.button.disabled = false;
    }
  }

  set total(value: number) {
    this.price.textContent = `${value} синапсов`;
  }

  clear() {
    this.list.innerHTML = '';
    this.total = 0;
    this.button.disabled = true;
  }
}
