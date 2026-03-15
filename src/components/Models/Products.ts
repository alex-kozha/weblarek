import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events';

export class Products{
  private products: IProduct[]
  private viewcard: IProduct | null
  private events: IEvents;

  constructor(events: IEvents){
    this.events = events;
    this.viewcard = null
    this.products = []
  }

  getCard():IProduct | null{
    return this.viewcard
  }

  getProducts(): IProduct[]{
    return this.products
  }

  pushProducts(masproducts: IProduct[]){
    this.products = masproducts
  }

  getProductId(id:string): IProduct | undefined{
    const result  = this.products.find((el)=> el.id===id)
    return result
  }

  saveCard(card: IProduct) {
    this.viewcard = card;
    this.events.emit('preview:changed', { product: card });
  }

}
