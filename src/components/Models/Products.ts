import { IProduct } from '../../types/index.ts';

export class Products{
  private products: IProduct[]
  private viewcard: IProduct | null
  constructor( ){
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

  saveCard(card: IProduct){
    this.viewcard = card
  }

}
