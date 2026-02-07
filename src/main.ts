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
bu.pushad('s')
//вид оплаты
bu.pushpay('cash')
//емейл
bu.pushem('dx@adfa')
//телефон
bu.pushpho('+7937')
console.log('Просмотр добавленных данных пользователей', bu.getinf())
//проверка очистки поля покупателя
bu.clearinf()
console.log('Просмотр данных после полной очистки',bu.getinf())
console.log('Валидация',bu.validation())


//Тест корзины

const ba = new Busket()
// добавление товара в корзину
ba.prtobusket(apiProducts.items[0])
ba.prtobusket(apiProducts.items[1])
console.log('Товары в корзине')
console.table(ba.getbusket())
console.log('------------------')
console.log('Проверка находится ли элемент в корзине по айди', ba.checkproduct("854cef69-976d-4c2a-a18c-2aa45046c390"))
console.log('Количество товаров',ba.lenbusket())
console.log('Сумма стоимости товаров в корзине',ba.fullpricebusket())
ba.dellpr({
            "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
            "description": "Если планируете решать задачи в тренажёре, берите два.",
            "image": "/5_Dots.svg",
            "title": "+1 час в сутках",
            "category": "софт-скил",
            "price": 750
        })
console.log('Просмотор корзины после удаления 1 товара из корзины',ba.getbusket())
ba.cleanbusket()
console.log('Просмотр корзины после полной очистки',ba.getbusket())


//Проверка  класса Products

const pr = new Products()
pr.pushproducts(apiProducts.items)
console.log('просмотр данных',pr.getproducts())
console.log('товар найденный по айди',pr.getprid('854cef69-976d-4c2a-a18c-2aa45046c390'))
pr.savecard(apiProducts.items[3])
console.log('получения сохраненной карточки', pr.getcard())

// Проверка класса Request


const api  = new Api(API_URL)
const re = new Request(api)


console.log(`${API_URL}/product/`)
console.log('Запрос данных', re.gets('/product/'))
console.log('отправка данных /order/', re.posts('/order/',{
    "payment": "online",
    "email": "test@test.ru",
    "phone": "+71234567890",
    "address": "Spb Vosstania 1",
    "total": 2200,
    "items": [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
    ]
} ))

//финальная проверка сохранения каталога полученного из запроса
const f = re.gets('/product/')
const  res= new Products()
f.then(data=> res.pushproducts(data.items)).then(f=> console.log(res.getproducts()))





