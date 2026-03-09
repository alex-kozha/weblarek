import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class Modal extends Component<{}> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);

    this.closeButton.addEventListener('click', () => this.close());

    container.addEventListener('click', (e) => {
      if (e.target === container) {
        this.close();
      }
    });

    this.container.classList.add('modal_closed');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.container.classList.add('modal_closed');
    this.contentContainer.innerHTML = '';
    this.events.emit('modal:close');
  }

  open(content: HTMLElement) {
    this.contentContainer.innerHTML = '';
    this.contentContainer.appendChild(content);
    this.container.classList.remove('modal_closed');
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }
}
