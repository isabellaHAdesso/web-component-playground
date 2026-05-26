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
  #abortController = new AbortController();

  static get observedAttributes() {
    return ['view'] as const;
  }

  constructor() {
    super();
  }

  disconnectedCallback() {
    this.#abortController.abort()
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


  setViewEventListner = (e: PointerEvent) => {
    const view = (e.target as HTMLButtonElement).dataset.view;
    this.#setView(view);
  };

  #renderDay() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'row';

    const main = document.createElement('div');
    main.innerText = "Day";
    main.style.marginTop = '30px';
    main.style.backgroundColor = '#fbfbfb';

    const button = document.createElement('button');
    button.style.padding = '10px';
    button.style.backgroundColor = 'magenta';

    const year = button.cloneNode(true) as HTMLButtonElement;
    year.textContent = "Year";
    year.dataset.view = 'year';
    year.addEventListener("click", this.setViewEventListner
    , {signal: this.#abortController.signal}
  );

    // year.removeEventListener('click', this.setViewEventListner)

    const month = button.cloneNode(true) as HTMLButtonElement;
    month.textContent = 'Month';
    month.style.backgroundColor = 'red';
    month.dataset.view = 'month';
    month.addEventListener("click", this.setViewEventListner
    , {signal: this.#abortController.signal}
  );

    buttonContainer.appendChild(month);
    buttonContainer.appendChild(year);

    this.innerHTML = "";

    this.appendChild(buttonContainer);
    this.appendChild(main);
  }

  #renderMonth() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'row';

    const button = document.createElement('button');
    button.style.padding = '10px';
    button.style.backgroundColor = 'magenta';

    const year = button.cloneNode(true) as HTMLButtonElement;
    year.textContent = "Year";
    year.dataset.view = 'year';
    year.addEventListener("click", this.setViewEventListner
    , {signal: this.#abortController.signal}
  );
    
    const day = button.cloneNode(true) as HTMLButtonElement;
    day.textContent = 'Day';
    day.style.backgroundColor = 'red';
    day.dataset.view = 'day';
    day.addEventListener("click", this.setViewEventListner
    , {signal: this.#abortController.signal}
  );


    const main = document.createElement('div');
    main.innerText = "Month";
    main.style.marginTop = '30px';
    main.style.backgroundColor = '#fbfbfb';

    buttonContainer.appendChild(day);
    buttonContainer.appendChild(year);

    this.innerHTML = "";

    this.appendChild(buttonContainer);
    this.appendChild(main);
  }

  #renderYear() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'row';

    const month = document.createElement('button');
    month.innerText = 'Month';
    month.style.padding = '10px';
    month.style.backgroundColor = 'forestgreen';
    month.style.color = 'white';
    month.style.marginRight = '10px';
    month.dataset.view = 'month';
    month.addEventListener("click", this.setViewEventListner
    , {signal: this.#abortController.signal}
  );

    const day = document.createElement('button');
    day.innerText = "Day";
    day.style.padding = '10px';
    day.style.backgroundColor = "magenta";
    day.dataset.view = 'day';
    day.addEventListener("click", this.setViewEventListner
    , {signal: this.#abortController.signal}
  );

    buttonContainer.appendChild(month);
    buttonContainer.appendChild(day);

    const main = document.createElement('div');
    main.innerText = "Year";
    main.style.marginTop = '30px';
    main.style.backgroundColor = '#fbfbfb';

    this.innerHTML = "";

    this.appendChild(buttonContainer);
    this.appendChild(main);
  }
}

customElements.define("custom-datepicker", CustomDatepicker);
