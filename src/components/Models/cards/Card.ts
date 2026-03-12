import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICardData {
  title: string;
  price: number | null;
}

export abstract class Card extends Component<ICardData> {
  protected titleELement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleELement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
  }


  set title(value: string) {
    this.titleELement.textContent = value;
  }


  set price(value: number | null) {
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }

  render(data: ICardData): HTMLElement {
    super.render(data);
    this.title = data.title;
    this.price = data.price;
    return this.container;
  }
}
