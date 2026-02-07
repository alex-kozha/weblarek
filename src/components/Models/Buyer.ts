import { IBuyer, TPayment, Er} from '../../types/index.ts';

export class Buyer{
protected buyer: IBuyer
  constructor(){
    this.buyer = {
      payment: '',
      email: '',
      phone: '',
      address: ''
    }
  }

  clearinf(){
    this.buyer = {
      payment: '',
      email: '',
      phone: '',
      address: ''
    }
  }

  validation(): object{
    let er: Partial   <Er> = {

    }
    if(!this.buyer.address){
      er.address =  'Заполните поле адреса'
    }
    if(!this.buyer.email){
      er.email =  'Заполните поле емэйла'
    }
    if(!this.buyer.payment){
      er.pay =  'Выберите вид оплаты'
    }
    if(!this.buyer.phone){
      er.phone =  'Заполните поле телефона'
    }
    return er
  }

  getinf(): IBuyer{
    return this.buyer
  }

  pushad(ad: string){
    this.buyer.address = ad
  }

  pushem(em: string){
    this.buyer.email = em
  }

  pushpho(pho: string){
    this.buyer.phone = pho
  }

  pushpay(pay: TPayment){
    this.buyer.payment = pay
  }
}
