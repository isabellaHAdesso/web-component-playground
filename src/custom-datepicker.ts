const DATE_PICKER_VIEW_NAMES = ["day", "month", "year"] as const;
const DEFAULT_VIEW = DATE_PICKER_VIEW_NAMES[0];
type CustomDatepickerView = typeof DATE_PICKER_VIEW_NAMES[number];

function isCustomDatePickerView(value: unknown): value is CustomDatepickerView {
    if (typeof value !== "string") {
        return false;
    }
    return DATE_PICKER_VIEW_NAMES.includes(value as CustomDatepickerView);
}

export class CustomDatepicker extends HTMLElement {
  static get observedAttributes() {
    return ['view'] as const;
  }

  constructor() {
    super();
    console.log('test');
  }

  attributeChangedCallback(
    name: (typeof CustomDatepicker.observedAttributes)[number],
    oldValue: unknown,
    newValue: unknown,
  ) {
    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case 'view':
        return this.#setView(newValue);
    }
  }

  #view: CustomDatepickerView = DEFAULT_VIEW;

  get view(): CustomDatepickerView {
      return this.#view;
  }

  set view(view: CustomDatepickerView) {
    this.#setView(view);
  }

  #setView(view: unknown) {
    const next = isCustomDatePickerView(view) ? view : DEFAULT_VIEW;

    if (this.getAttribute('view') !== next) {
      this.setAttribute('view', next);
    }

    if (next === this.#view) return;
    this.#view = next;

    this.#render();
  }

  connectedCallback() {
    if (this.hasAttribute('view')) {
      this.#setView(this.getAttribute('view'));
    } else {
      this.setAttribute('view', this.#view);
    }

    this.#render();
  }

  #render() {
    switch (this.#view) {
      case 'day':
        return this.#renderDay();
      case 'month':
        return this.#renderMonth();
      case 'year':
        return this.#renderYear();
    }
  }

  #renderDay() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'row';

    // const month = document.createElement('button');
    // month.innerText = 'Month';
    // month.style.padding = '10px';
    // month.style.backgroundColor = 'forestgreen';
    // month.style.color = 'white';
    // month.style.marginRight = '10px';

    // const year = document.createElement('button');
    // year.innerText = "Year";
    // year.style.padding = '10px';
    // year.style.backgroundColor = "magenta";

    // buttonContainer.appendChild(month.cloneNode(true));
    // buttonContainer.appendChild(year.cloneNode(true));

    const main = document.createElement('div');
    main.innerText = "Day";
    main.style.marginTop = '30px';
    main.style.backgroundColor = '#fbfbfb';

    const button = document.createElement('button');
    button.style.padding = '10px';
    button.style.backgroundColor = 'magenta';

    const year = button.cloneNode(true) as HTMLElement;
    year.textContent = "Year";

    const month = button.cloneNode(true) as HTMLElement;
    month.textContent = 'Month';
    month.style.backgroundColor = 'red';

    buttonContainer.appendChild(month);
    buttonContainer.appendChild(year);

    this.innerHTML = "";

    this.appendChild(buttonContainer);
    this.appendChild(main);
  }

  #renderMonth() {
    this.innerHTML = '';
    this.appendChild(document.createTextNode('Month'));
  }

  #renderYear() {
    this.innerHTML = '';
    this.appendChild(document.createTextNode('Year'));
  }
}

customElements.define("custom-datepicker", CustomDatepicker);
