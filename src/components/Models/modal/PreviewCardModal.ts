import { ImgCard } from "../cards/ImgCard";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IPreviewData {
  title: string;
  price: number | null;
  category: string;
  image: string;
  description: string;
  inBasket?: boolean;
}

export class PreviewCard extends ImgCard {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

    this.buttonElement.addEventListener('click', () => {
  this.events.emit('preview:button-click');
});
  }

  render(data: IPreviewData): HTMLElement {
    super.render(data);
    this.descriptionElement.textContent = data.description;
    return this.container;
  }

  set buttonText(value: string) {
  this.buttonElement.textContent = value;
}

set buttonDisabled(value: boolean) {
  this.buttonElement.disabled = value;
}
}
