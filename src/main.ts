import './scss/styles.scss';
import {apiProducts} from  './utils/data.ts'
import {Buyer} from './components/Models/Buyer.ts'
import {Busket} from './components/Models/Busket.ts'
import {Products} from './components/Models/Products.ts'
import {Request} from './components/Models/Request.ts'
import { Api } from './components/base/Api.ts'
import {API_URL} from './utils/constants.ts'
// Тест класса покупателя

const bu = new Buyer();
//адрес
bu.pushAddress('s')
//вид оплаты
bu.pushPayment('cash')
//емейл
bu.pushEmail('dx@adfa')
//телефон
bu.pushPhone('+7937')
console.log('Просмотр добавленных данных пользователей', bu.buyerInformation())
//проверка очистки поля покупателя
bu.clearBuyerInformation()
console.log('Просмотр данных после полной очистки',bu.buyerInformation())
console.log('Валидация',bu.validation())


//Тест корзины

const ba = new Busket()
// добавление товара в корзину
ba.productToBusket(apiProducts.items[0])
ba.productToBusket(apiProducts.items[1])
console.log('Товары в корзине')
console.table(ba.getBusket())
console.log('------------------')
console.log('Проверка находится ли элемент в корзине по айди', ba.checkProduct("854cef69-976d-4c2a-a18c-2aa45046c390"))
console.log('Количество товаров',ba.lengthBusket())
console.log('Сумма стоимости товаров в корзине',ba.fullPriceBusket())
ba.deleteProduct({
            "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
            "description": "Если планируете решать задачи в тренажёре, берите два.",
            "image": "/5_Dots.svg",
            "title": "+1 час в сутках",
            "category": "софт-скил",
            "price": 750
        })
console.log('Просмотор корзины после удаления 1 товара из корзины',ba.getBusket())
ba.cleanBusket()
console.log('Просмотр корзины после полной очистки',ba.getBusket())


//Проверка  класса Products

const pr = new Products()
pr.pushProducts(apiProducts.items)
console.log('просмотр данных',pr.getProducts())
console.log('товар найденный по айди',pr.getProductId('854cef69-976d-4c2a-a18c-2aa45046c390'))
pr.saveCard(apiProducts.items[3])
console.log('получения сохраненной карточки', pr.getCard())

// Проверка класса Request


const api  = new Api(API_URL)
const re = new Request(api)


console.log(`${API_URL}/product/`)
re.getProducts().then(data => console.log('Запрос данных', data))
re.postOrder({
    "payment": "online",
    "email": "test@test.ru",
    "phone": "+71234567890",
    "address": "Spb Vosstania 1",
    "total": 2200,
    "items": [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
    ]
}).then(answer => console.log('Ответ сервера на отправку данных', answer))

//финальная проверка сохранения каталога полученного из запроса
const f = re.getProducts()
const  res= new Products()
  f.then(data=> {
    res.pushProducts(data.items)
    console.log('финальная проверка', res.getProducts())
  }
  )





