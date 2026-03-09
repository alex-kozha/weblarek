import { IBuyer, TPayment, Er} from '../../types/index.ts';

export class Buyer{
  private buyer: IBuyer
  constructor(){
    this.buyer = {
      payment: '',
      email: '',
      phone: '',
      address: ''
    }
  }

  clearBuyerInformation(){
    this.buyer = {
      payment: '',
      email: '',
      phone: '',
      address: ''
    }
  }

 validation(): Er {
  const er: Er = {};

  if (!this.buyer.address) {
    er.address = 'Заполните поле адреса';
  }
  if (!this.buyer.email) {
    er.email = 'Заполните поле емэйла';
  }
  if (!this.buyer.payment) {
    er.pay = 'Выберите вид оплаты';
  }
  if (!this.buyer.phone) {
    er.phone = 'Заполните поле телефона';
  }
  return er;
}
  buyerInformation(): IBuyer{
    return this.buyer
  }

  pushAddress(ad: string){
    this.buyer.address = ad
  }

  pushEmail(em: string){
    this.buyer.email = em
  }

  pushPhone(pho: string){
    this.buyer.phone = pho
  }

  pushPayment(pay: TPayment){
    this.buyer.payment = pay
  }
}
