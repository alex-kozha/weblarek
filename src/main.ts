import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Request } from './components/Models/Request';
import { Products } from './components/Models/Products';
import { Busket } from './components/Models/Busket';
import { Buyer } from './components/Models/Buyer';
import { Header } from './components/Models/Header';
import { Gallery } from './components/Models/cards/Gallery.ts';
import { Modal } from './components/Models/modal/Modal';
import { Success } from './components/Models/modal/SuccessModal';
import { PreviewCard } from './components/Models/modal/PreviewCardModal';
import { BusketModal } from './components/Models/modal/BusketModal';
import { OrderForm } from './components/Models/Forms/OrderForm';
import { ContactsForm} from './components/Models/Forms/ContactsForm'
import { CatalogCard } from './components/Models/cards/CatalogCard';
import { BuskertCard } from './components/Models/cards/BasketCard';
import { cloneTemplate } from './utils/utils';
import { Api } from './components/base/Api';
import {API_URL} from './utils/constants.ts'
import { CDN_URL } from './utils/constants';
import { TPayment } from './types/index.ts';
import { IProduct } from './types/index.ts';

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const events = new EventEmitter();
const api = new Api(API_URL);
const request = new Request(api);

const productsModel = new Products(events);;
const busketModel = new Busket(events);
const buyerModel = new Buyer();

const headerContainer = document.querySelector('.header') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.getElementById('modal-container') as HTMLElement;

const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);

const catalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const basketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketModalTemplate = document.getElementById('basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

const previewCard = new PreviewCard(cloneTemplate(previewTemplate), events);
const basketModal = new BusketModal(cloneTemplate(basketModalTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate) as HTMLFormElement, events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate) as HTMLFormElement, events);
const successModal = new Success(cloneTemplate(successTemplate), events);
let currentOrderForm: OrderForm | null = orderForm;

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function updateBasketCounter() {
  header.counter = busketModel.lengthBusket();
}

function handleBasketChange() {
  updateBasketCounter();
  updateBasketView();
}

function updateBasketView() {
  const productsInBasket = busketModel.getBusket();
  const items = productsInBasket.map((product, index) => {
    const cardElement = cloneTemplate(basketTemplate);
    const card = new BuskertCard(cardElement, {
      onClick: () => events.emit('basket:remove', { id: product.id })
    });

    card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });

    return cardElement;
  });

  basketModal.items = items;
  basketModal.total = busketModel.fullPriceBusket();
}

function renderCatalog() {
  const products = productsModel.getProducts();
  const cardElements = products.map((product) => {
    const cardElement = cloneTemplate(catalogTemplate);
    const card = new CatalogCard(cardElement, {
      onClick: () => events.emit('card:select', { id: product.id })
    });

    card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image
    });

    return cardElement;
  });

  gallery.catalog = cardElements;
}

async function loadProducts() {
  try {
    const response = await request.getProducts();
    const productsWithCorrectPaths = response.items.map(product => ({
      ...product,
      image: `${CDN_URL}${product.image}`
    }));

    productsModel.pushProducts(productsWithCorrectPaths);
    renderCatalog();
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
}

// ========== СОБЫТИЯ КАТАЛОГА И КАРТОЧЕК ==========
events.on('card:select', (data: { id: string }) => {
  const product = productsModel.getProductId(data.id);
  if (!product) return;
  productsModel.saveCard(product);
});

function openPreview(product: IProduct) {
  previewCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description || ''
  });

  const inBasket = busketModel.checkProduct(product.id);
  const available = product.price !== null;

  if (!available) {
    previewCard.buttonText = 'Недоступно';
    previewCard.buttonDisabled = true;
  } else if (inBasket) {
    previewCard.buttonText = 'Удалить из корзины';
    previewCard.buttonDisabled = false;
  } else {
    previewCard.buttonText = 'В корзину';
    previewCard.buttonDisabled = false;
  }

  modal.open(previewCard.element);
}

events.on('preview:changed', (data: { product: IProduct }) => {
  openPreview(data.product);
});

events.on('preview:button-click', () => {
  const product = productsModel.getCard();
  if (!product) return;

  const inBasket = busketModel.checkProduct(product.id);
  const available = product.price !== null;

  if (!available) return;

  if (inBasket) {
    busketModel.deleteProduct(product);
  } else {
    busketModel.productToBusket(product);
  }

  modal.close();
});

// ========== СОБЫТИЯ КОРЗИНЫ ==========
events.on('basket:remove', (data: { id: string }) => {
  const product = productsModel.getProductId(data.id);
  if (product) {
    busketModel.deleteProduct(product);
  }
});

events.on('basket:changed', () => {
  handleBasketChange();
});

events.on('basket:open', () => {
  modal.open(basketModal.element);
});

events.on('basket:order', () => {
  if (busketModel.lengthBusket() === 0) return;

  const buyerData = buyerModel.buyerInformation();

  if (buyerData.address && currentOrderForm) {
    currentOrderForm.address = buyerData.address;
  }

  if (buyerData.payment && currentOrderForm) {
    const paymentMethod = buyerData.payment === 'online' ? 'card' : buyerData.payment;
    currentOrderForm.activePaymentMethod = paymentMethod as 'card' | 'cash';
  }

  modal.open(orderForm.element);
});

// ========== СОБЫТИЯ ФОРМЫ ЗАКАЗА ==========
events.on('order:change', (data: { field: string; value: string }) => {
  if (data.field === 'address') {
    buyerModel.pushAddress(data.value);
  }

  if (data.field === 'payment') {
    const paymentValue = data.value === 'card' ? 'online' : data.value;
    buyerModel.pushPayment(paymentValue as TPayment);
    orderForm.activePaymentMethod = data.value as 'card' | 'cash';
  }

  const errors = buyerModel.validation();
  const isValid = !errors.address && !errors.pay;

  orderForm.render({
    valid: isValid,
    errors: [errors.address, errors.pay].filter((e): e is string => !!e)
  });
});

events.on('order:submit', () => {
  const errors = buyerModel.validation() as any;
  const isValid = !errors.address && !errors.pay;

  if (isValid) {
    modal.open(contactsForm.element);
  }
});

// ========== СОБЫТИЯ ФОРМЫ КОНТАКТОВ ==========
events.on('contacts:change', (data: { field: string; value: string }) => {
  if (data.field === 'email') {
    buyerModel.pushEmail(data.value);
  } else if (data.field === 'phone') {
    buyerModel.pushPhone(data.value);
  }

  const errors = buyerModel.validation();
  const isValid = !errors.email && !errors.phone;

  contactsForm.render({
    valid: isValid,
    errors: [errors.email, errors.phone].filter(Boolean)
  });
});

events.on('contacts:submit', async () => {
  const errors = buyerModel.validation() as any;
  const isValid = !errors.email && !errors.phone;

  if (isValid) {
    try {
      const buyerData = buyerModel.buyerInformation();
      const orderData = {
        payment: buyerData.payment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: busketModel.fullPriceBusket(),
        items: busketModel.getBusket().map(item => item.id)
      };



      busketModel.cleanBusket();
      buyerModel.clearBuyerInformation();

      orderForm.clear();
      contactsForm.clear();

      const response = await request.postOrder(orderData);
      successModal.total = response.total;

      modal.open(successModal.element);
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
    }
  }
});

// ========== СОБЫТИЯ МОДАЛКИ ==========
events.on('success:close', () => {
  modal.close();
});

// ========== ЗАПУСК ==========
loadProducts();
updateBasketCounter();
