import { Card, ICardData } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { ICardActions } from "../../../types";

interface IBasketCardData extends ICardData {
  index: number;
}

export class BuskertCard extends Card {
  busketDeleteButton: HTMLButtonElement;
  indexElement: HTMLElement;
  index: number = 0;

  constructor(container: HTMLElement, action?: ICardActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.busketDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    if (action?.onClick) {
      this.busketDeleteButton.addEventListener('click', action.onClick);
    }
  }

  render(data: IBasketCardData): HTMLElement {
    super.render(data);
    this.indexElement.textContent = String(this.index);
    return this.container;
  }
}
