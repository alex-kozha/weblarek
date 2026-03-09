import { ensureElement, ensureAllElements } from "../../../utils/utils";
import { Form } from './Form';
import { IEvents } from "../../base/Events";

export class OrderForm extends Form {
  protected addressInput: HTMLInputElement;
  protected paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');

        this.events.emit('order:change', {
          field: 'payment',
          value: button.name
        });
      });
    });
  }

  setActivePaymentMethod(method: 'card' | 'cash') {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.name === method);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
