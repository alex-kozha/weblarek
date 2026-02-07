import {ProductsPost,ProductsResponse,IApi, ProductsPostAnswer} from '../../types/index.ts'


export class Request{


  constructor(private api: IApi){}

  getProducts(){
   return this.api.get<ProductsResponse>('/product/')
  }

  postOrder(data: ProductsPost){
    return this.api.post<ProductsPostAnswer>('/order/', data, 'POST')
  }
}

