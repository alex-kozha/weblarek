import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events';

export class Busket{
  private busket: IProduct[]
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.busket = [];
  }

  getBusket(): IProduct[]{
    return this.busket
  }

  productToBusket(pr: IProduct) {
    this.busket.push(pr);
    this.events.emit('basket:changed');
  }

  cleanBusket() {
    this.busket = [];
    this.events.emit('basket:changed');
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

  deleteProduct(pr: IProduct) {
    const ind = this.busket.indexOf(pr);
    if (ind !== -1) {
      this.busket.splice(ind, 1);
      this.events.emit('basket:changed');
    }
  }

}
