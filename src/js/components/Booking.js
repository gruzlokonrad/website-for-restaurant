import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(widgetBooking) {
    const thisWdigetBooking = this;

    thisWdigetBooking.element = widgetBooking;
    thisWdigetBooking.render(thisWdigetBooking.element);
    thisWdigetBooking.initWidgets();
    console.log('widget', this);
  }

  render(element) {
    const thisWdigetBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisWdigetBooking.dom = {};
    thisWdigetBooking.dom.wrapper = element;
    thisWdigetBooking.dom.wrapper.innerHTML = generatedHTML;
    thisWdigetBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisWdigetBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
  }

  initWidgets() {
    const thisWdigetBooking = this;

    new AmountWidget(thisWdigetBooking.dom.peopleAmount);
    thisWdigetBooking.dom.peopleAmount.addEventListener('click', function (event) {
      event.preventDefault();
    });

    new AmountWidget(thisWdigetBooking.dom.hoursAmount);
    thisWdigetBooking.dom.hoursAmount.addEventListener('click', function (event) {
      event.preventDefault();
    });
  }
}

export default Booking;