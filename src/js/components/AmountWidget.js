import { select, settings } from '../settings.js';


class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue);
    thisWidget.initAction();
  }

  getElements(element) {
    const thisWidget = this;
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);

    // TODO: Add validation
    if (thisWidget.value !== newValue && !isNaN(newValue) && (settings.amountWidget.defaultMin <= newValue && newValue <= settings.amountWidget.defaultMax)) {
      thisWidget.value = newValue;
      thisWidget.announce();
    }

    thisWidget.input.value = thisWidget.value;
  }

  initAction() {
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function (e) {
      e.preventDefault();
      if (thisWidget.value > settings.amountWidget.defaultMin)
        thisWidget.setValue(thisWidget.value -= 1);
      thisWidget.announce();
    });
    thisWidget.linkIncrease.addEventListener('click', function (e) {
      e.preventDefault();
      if (thisWidget.value < settings.amountWidget.defaultMax)
        thisWidget.setValue(thisWidget.value += 1);
      thisWidget.announce();
    });
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;