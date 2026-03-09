import { ensureElement, ensureAllElements } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
  valid: boolean;
  errors: string[];
}

export abstract class Form extends Component<IForm> {
  protected submitButton: HTMLButtonElement;
  protected errorcontainer: HTMLElement;
  private name: string;
  private inputs: HTMLElement[];

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    this.errorcontainer = ensureElement<HTMLElement>('.form__errors', container);
    this.name = container.name;
    this.inputs = ensureAllElements('input, .button_alt', container);

    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.name}:submit`);
    });

    this.inputs.forEach(input => {
      if (input instanceof HTMLInputElement) {
        input.addEventListener('input', () => {
          this.events.emit(`${this.name}:change`, {
            field: input.name,
            value: input.value
          });
        });
      } else if (input instanceof HTMLButtonElement && input.classList.contains('button_alt')) {
        input.addEventListener('click', () => {
          this.events.emit(`${this.name}:change`, {
            field: 'payment',
            value: input.name
          });
        });
      }
    });
  }

  set errors(value: string[]) {
    this.errorcontainer.textContent = value.join('; ');
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  clear() {
    (this.container as HTMLFormElement).reset();
    this.errors = [];
    this.valid = false;
  }

  render(data: IForm): HTMLElement {
    super.render(data);
    if (data?.valid !== undefined) this.valid = data.valid;
    if (data?.errors !== undefined) this.errors = data.errors;
    return this.container;
  }
}
