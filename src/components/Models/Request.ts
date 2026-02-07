import {Postreq,Getreq,IApi, ApiPostMethods} from '../../types/index.ts'


export class Request{


  constructor(private ob: IApi){}

  gets(uri: string){
   return this.ob.get<Getreq>(uri)
  }

  posts(uri: string, data: Postreq, method: ApiPostMethods = 'POST') {
    return this.ob.post<Postreq>(uri, data, method)
  }
}
