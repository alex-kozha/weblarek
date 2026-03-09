import { ImgCard } from "./ImgCard";
import { ICardActions } from "../../../types";

export class CatalogCard extends ImgCard {
  constructor(container: HTMLElement, private actions?: ICardActions) {
    super(container);
    if (this.actions?.onClick) {
      container.addEventListener('click', this.actions.onClick);
    }
  }
}
