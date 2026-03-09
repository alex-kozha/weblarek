import { IProduct } from '../../types/index.ts';

export class Busket{
  private busket: IProduct[]
  constructor(){
    this.busket =[]
  }

  getBusket(): IProduct[]{
    return this.busket
  }

  productToBusket(pr: IProduct){
    this.busket.push(pr)
  }

  cleanBusket(){
    this.busket = []
  }

  checkProduct(id: string): boolean{
     const res  = this.busket.find((el)=> el.id === id)
     return res ? true : false
  }

  lengthBusket(): number{
    return this.busket.length
  }

  fullPriceBusket(): number {
    const result = this.busket.reduce((acc, el): number=>{
      acc+=(el.price || 0)
      return acc
    }, 0)
    return result
  }

  deleteProduct(pr: IProduct){
      this.busket = this.busket.filter(item => item.id !== pr.id);
  }

}
