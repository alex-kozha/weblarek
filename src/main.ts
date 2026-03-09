import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Request } from './components/Models/Request';
import { Products } from './components/Models/Products';
import { Busket } from './components/Models/Busket';
import { Buyer } from './components/Models/Buyer';
import { Header } from './components/Models/Header';
import { Gallery } from './components/Models/Gallery';
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
import { TPayment } from './types/index.ts';

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const events = new EventEmitter();
const api = new Api(API_URL);
const request = new Request(api);

const productsModel = new Products();
const busketModel = new Busket();
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

let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function updateBasketCounter() {
  header.counter = busketModel.lengthBusket();
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
      image: `productsimg${product.image}`
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

  const previewElement = cloneTemplate(previewTemplate);
  const previewCard = new PreviewCard(previewElement, events);
  previewCard.setProduct(product);

  previewCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description || ''
  });

  const inBasket = busketModel.checkProduct(product.id);
  const available = product.price !== null;
  previewCard.setButtonState(inBasket, available);

  modal.open(previewElement);
});

events.on('preview:add-to-basket', (data: { product: any }) => {
  if (!busketModel.checkProduct(data.product.id)) {
    busketModel.productToBusket(data.product);
    updateBasketCounter();
    modal.close();
  }
});

events.on('preview:remove-from-basket', (data: { product: any }) => {
  const product = data.product;
  if (product && busketModel.checkProduct(product.id)) {
    busketModel.deleteProduct(product);
    updateBasketCounter();
    modal.close();
  }
});

// ========== СОБЫТИЯ КОРЗИНЫ ==========
events.on('basket:open', () => {
  const basketElement = cloneTemplate(basketModalTemplate);
  const basketModal = new BusketModal(basketElement, events);

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
  modal.open(basketElement);
});

events.on('basket:remove', (data: { id: string }) => {
  const product = productsModel.getProductId(data.id);
  if (product) {
    busketModel.deleteProduct(product);
    updateBasketCounter();
    events.emit('basket:open');
  }
});

events.on('basket:order', () => {
  if (busketModel.lengthBusket() === 0) return;

  const orderElement = cloneTemplate(orderTemplate);
  currentOrderForm = new OrderForm(orderElement as HTMLFormElement, events);

  const buyerData = buyerModel.buyerInformation();
  if (buyerData.address) {
    (currentOrderForm as any).setAddress?.(buyerData.address);
  }
  if (buyerData.payment) {
    (currentOrderForm as any).setActivePaymentMethod?.(buyerData.payment);
  }

  modal.open(orderElement);
});

// ========== СОБЫТИЯ ФОРМЫ ЗАКАЗА ==========
events.on('order:change', (data: { field: string; value: string }) => {
  if (data.field === 'address') {
    buyerModel.pushAddress(data.value);
  }

  if (data.field === 'payment') {
    const paymentValue = data.value === 'card' ? 'online' : data.value;
    buyerModel.pushPayment(paymentValue as TPayment);
  }

  const errors = buyerModel.validation();
  const isValid = !errors.address && !errors.pay;

  if (currentOrderForm) {
    currentOrderForm.render({
      valid: isValid,
      errors: [errors.address, errors.pay].filter((e): e is string => !!e)
    });
  }
});

events.on('order:submit', () => {
  const errors = buyerModel.validation() as any;
  const isValid = !errors.address && !errors.pay;

  if (isValid) {
    const contactsElement = cloneTemplate(contactsTemplate);
    currentContactsForm = new ContactsForm(contactsElement as HTMLFormElement, events);
    modal.open(contactsElement);
  }
});

// ========== СОБЫТИЯ ФОРМЫ КОНТАКТОВ ==========
events.on('contacts:change', (data: { field: string; value: string }) => {
  if (data.field === 'email') {
    buyerModel.pushEmail(data.value);
  } else if (data.field === 'phone') {
    buyerModel.pushPhone(data.value);
  }

  const errors = buyerModel.validation() as any;
  const isValid = !errors.email && !errors.phone;

  if (currentContactsForm) {
    currentContactsForm.render({
      valid: isValid,
      errors: [errors.email, errors.phone].filter(Boolean)
    });
  }
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

      await request.postOrder(orderData);

      busketModel.cleanBusket();
      buyerModel.clearBuyerInformation();
      updateBasketCounter();

      const successElement = cloneTemplate(successTemplate);
      const success = new Success(successElement, events);
      success.total = orderData.total;
      modal.open(successElement);
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
