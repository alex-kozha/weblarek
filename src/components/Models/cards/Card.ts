import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICardData {
  title: string;
  price: number | null;
}

export abstract class Card extends Component<ICardData> {
  protected titleELement: HTMLElement;
  protected priceElement: HTMLElement;
  title: string = '';
  price: number | null = null;

  constructor(container: HTMLElement) {
    super(container);
    this.titleELement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
  }

  render(data: ICardData): HTMLElement {
    super.render(data);
    this.titleELement.textContent = this.title;
    this.priceElement.textContent = this.price === null ? 'Бесценно' : `${this.price} синапсов`;
    return this.container;
  }
}
