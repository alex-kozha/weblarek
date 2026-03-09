import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected description: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.description = ensureElement<HTMLElement>('.order-success__description', container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }

  render(data: ISuccessData): HTMLElement {
    super.render(data);
    return this.container;
  }
}
