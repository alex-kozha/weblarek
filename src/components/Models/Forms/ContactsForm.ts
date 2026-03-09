import { ensureElement } from "../../../utils/utils.ts";
import { Form } from './Form.ts';
import { IEvents } from "../../base/Events.ts";

export class ContactsForm extends Form {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
  }

  render(data: any): HTMLElement {
    return super.render(data);
  }
}
