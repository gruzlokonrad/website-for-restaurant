import { select, settings } from '../settings.js';
import BaseWidget from '../BaseWidget.js';


class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;

    thisWidget.getElements(element);
    // thisWidget.setValue(thisWidget.dom.input.value || settings.amountWidget.defaultValue);
    thisWidget.initAction();
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value) {
    return !isNaN(value)
      && settings.amountWidget.defaultMin <= value
      && value <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }

  initAction() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      // thisWidget.setValue(thisWidget.dom.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function (e) {
      e.preventDefault();
      if (thisWidget.value > settings.amountWidget.defaultMin)
        thisWidget.setValue(thisWidget.value -= 1);
      thisWidget.announce();
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function (e) {
      e.preventDefault();
      if (thisWidget.value < settings.amountWidget.defaultMax)
        thisWidget.setValue(thisWidget.value += 1);
      thisWidget.announce();
    });
  }
}

export default AmountWidget;