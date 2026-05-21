const DATE_PICKER_VIEW_NAMES = ["day", "month", "year"] as const;
type CustomDatepickerView = typeof DATE_PICKER_VIEW_NAMES[number];

function isCustomDatePickerView(value: unknown): value is CustomDatepickerView {
    if (typeof value !== "string") {
        return false;
    }
    return DATE_PICKER_VIEW_NAMES.includes(value as CustomDatepickerView);
}



export class CustomDatepicker extends HTMLElement {
  static get observedAttributes() {
    return ['view', 'selectedDate', 'anchorDate'] as const;
  }

  constructor() {
    super();
    console.log('test');
  }

  connectedCallback() {
    const test = this.view;
    console.log(test);
  }

  attributeChangedCallback(
    name: typeof CustomDatepicker.observedAttributes[number], 
    oldValue: unknown, 
    newValue: unknown
  ) {
    if (oldValue === newValue) {
        return;
    }

    this[name] = newValue;
  }

  get view(): CustomDatepickerView {
      const view = this.getAttribute('view');

      return isCustomDatePickerView(view)
        ? view
        : (() => {
          const result = DATE_PICKER_VIEW_NAMES[0];
          this.view = result;
          return result;
        })()
  }



  set view(view: unknown) {
    this.setAttribute(
      'view', 
      isCustomDatePickerView(view) ? view : DATE_PICKER_VIEW_NAMES[0]
    );
  }

  set selectedDate(value: unknown) {}

  set anchorDate(value: unknown) {}
}

customElements.define("custom-datepicker", CustomDatepicker);