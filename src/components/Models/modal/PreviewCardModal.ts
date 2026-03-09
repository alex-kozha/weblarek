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
  private currentProduct: IPreviewData | null = null;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

    this.buttonElement.addEventListener('click', () => {
      if (!this.currentProduct) return;

      if (this.buttonElement.textContent === 'В корзину') {
        this.events.emit('preview:add-to-basket', { product: this.currentProduct });
      } else {
        this.events.emit('preview:remove-from-basket', { product: this.currentProduct });
      }
    });
  }

  render(data: IPreviewData): HTMLElement {
    super.render(data);
    this.descriptionElement.textContent = data.description;
    return this.container;
  }

  setButtonState(inBasket: boolean, available: boolean = true) {
    if (!available) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = 'Недоступно';
    } else if (inBasket) {
      this.buttonElement.disabled = false;
      this.buttonElement.textContent = 'Удалить из корзины';
    } else {
      this.buttonElement.disabled = false;
      this.buttonElement.textContent = 'В корзину';
    }
  }

  setProduct(product: IPreviewData) {
    this.currentProduct = product;
  }
}
