import { Card, ICardData } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export interface IImgCardData extends ICardData {
  category: string;
  image: string;
}

export abstract class ImgCard extends Card {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
  }

  render(data: IImgCardData): HTMLElement {
    super.render(data);


    this.categoryElement.textContent = data.category;
    const modifier = categoryMap[data.category as keyof typeof categoryMap] || 'other';
     this.categoryElement.className = `card__category ${modifier}`;


    this.imageElement.src = data.image;

    return this.container;
  }
}
