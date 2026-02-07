import { IProduct } from '../../types/index.ts';

export class Products{
  private products: IProduct[]
  private viewcard: IProduct
  constructor( ){
    this.viewcard = {
      id: '',
      description: '',
      image: '',
      title: '',
      category: '',
      price: null
    };
    this.products = []
  }

  getcard():IProduct {
    return this.viewcard
  }

  getproducts(): IProduct[]{
    return this.products
  }

  pushproducts(masproducts: IProduct[]){
    this.products = masproducts
  }

  getprid(id:string): IProduct | undefined{
    const result  = this.products.find((el)=> el.id===id)
    return result
  }

  savecard(card: IProduct){
    this.viewcard = card
  }

}
