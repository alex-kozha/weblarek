import { IProduct } from '../../types/index.ts';

export class Busket{
  private busket: IProduct[]
  constructor(){
    this.busket =[]
  }

  getbusket(): IProduct[]{
    return this.busket
  }

  prtobusket(pr: IProduct){
    this.busket.push(pr)
  }

  cleanbusket(){
    this.busket = []
  }

  checkproduct(id: string): boolean{
     const res  = this.busket.find((el)=> el.id === id)
     return res ? true : false
  }

  lenbusket(): number{
    return this.busket.length
  }

  fullpricebusket(): number {
    const result = this.busket.reduce((acc, el): number=>{
      if (el.price  && typeof(acc)==='number'){
        acc+=el.price
        return acc
      }
      return acc
    }, 0)
    return result
  }

  dellpr(pr: IProduct){
    const ind  = this.busket.indexOf(pr)
    this.busket.splice(ind,1)
  }

}
