import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

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
    thisWdigetBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisWdigetBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
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

    new DatePicker(thisWdigetBooking.dom.datePicker);
    new HourPicker(thisWdigetBooking.dom.hourPicker);
  }
}

export default Booking;