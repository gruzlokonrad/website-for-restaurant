import { classNames, select, settings, templates } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(widgetBooking) {
    const thisWdigetBooking = this;
    thisWdigetBooking.selectedTable = null;


    thisWdigetBooking.element = widgetBooking;
    thisWdigetBooking.render(thisWdigetBooking.element);
    thisWdigetBooking.initWidgets();
    thisWdigetBooking.getData();
    console.log('widget', this);
  }

  getData() {
    const thisWdigetBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisWdigetBooking.datePicker.minDate);
    const endDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisWdigetBooking.datePicker.maxDate);
    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        endDateParam,
        startDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        startDateParam,
      ],
    };

    // console.log('get params:', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };

    // console.log('getData urls', urls);



    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisWdigetBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisWdigetBooking = this;

    thisWdigetBooking.booked = {};

    for (const item of bookings) {
      thisWdigetBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (const item of eventsRepeat) {
      if (item.repeat == 'daily') {
        thisWdigetBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      }
    }

    const minDate = thisWdigetBooking.datePicker.minDate;
    const maxDate = thisWdigetBooking.datePicker.maxDate;

    for (const item of eventsCurrent) {
      for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
        thisWdigetBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
      }
    }

    // console.log('thisWidgetBooking.booked', thisWdigetBooking.booked);
    thisWdigetBooking.updateDom();
  }

  makeBooked(date, hour, duration, table) {
    const thisWdigetBooking = this;

    if (typeof thisWdigetBooking.booked[date] == 'undefined') {
      thisWdigetBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {

      if (typeof thisWdigetBooking.booked[date][hourBlock] == 'undefined') {
        thisWdigetBooking.booked[date][hourBlock] = [];
      }

      thisWdigetBooking.booked[date][hourBlock].push(table);

    }
  }

  updateDom() {
    const thisWidgetBooking = this;

    thisWidgetBooking.date = thisWidgetBooking.datePicker.value;
    thisWidgetBooking.hour = utils.hourToNumber(thisWidgetBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisWidgetBooking.booked[thisWidgetBooking.date] === 'undefined'
      ||
      typeof thisWidgetBooking.booked[thisWidgetBooking.date][thisWidgetBooking.hour] === 'undefined'
    ) {
      allAvailable = true;
    }

    console.log('thisWidgetBooking.dom.tables :>> ', thisWidgetBooking.dom.tables);

    for (let table of thisWidgetBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }


      if (
        !allAvailable
        &&
        thisWidgetBooking.booked[thisWidgetBooking.date][thisWidgetBooking.hour].includes(tableId)) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
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
    thisWdigetBooking.dom.tables = thisWdigetBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisWdigetBooking.dom.floor = thisWdigetBooking.dom.wrapper.querySelector(select.booking.floorPlan);
    thisWdigetBooking.dom.form = thisWdigetBooking.dom.wrapper.querySelector(select.booking.form);
    thisWdigetBooking.dom.address = thisWdigetBooking.dom.wrapper.querySelector(select.booking.address);
    thisWdigetBooking.dom.phone = thisWdigetBooking.dom.wrapper.querySelector(select.booking.phone);
  }

  handleTableClick(clickedTable) {
    const thisWdigetBooking = this;
    if (clickedTable.classList.contains(classNames.booking.tableBooked)) {
      return alert('Table is already booked!');
    }

    if (clickedTable.classList.contains(classNames.booking.selected)) {
      clickedTable.classList.remove(classNames.booking.selected);
      thisWdigetBooking.selectedTable = null;

    } else {
      const activeTable = thisWdigetBooking.dom.floor.querySelector(select.booking.tableSelected);
      if (activeTable) {
        activeTable.classList.remove(classNames.booking.selected);
      }

      clickedTable.classList.add(classNames.booking.selected);
      thisWdigetBooking.selectedTable = clickedTable.getAttribute(settings.booking.tableIdAttribute);


    }
  }

  sendBooking() {
    const payload = {
      address: this.dom.address.value,
      phone: this.dom.phone.value,
      table: this.selectedTable,
      date: this.datePicker.value,
      hour: this.hourPicker.value,
      ppl: this.dom.peopleAmount.value,
      duration: this.dom.hoursAmount.value
    };

    fetch(settings.db.url + '/' + settings.db.booking, {
      method: 'POST',
      headers: {'Content-Type':  'application/json'},
      body: JSON.stringify(payload),
    });
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

    thisWdigetBooking.datePicker = new DatePicker(thisWdigetBooking.dom.datePicker);
    thisWdigetBooking.hourPicker = new HourPicker(thisWdigetBooking.dom.hourPicker);

    thisWdigetBooking.dom.wrapper.addEventListener('updated', function () {
      thisWdigetBooking.updateDom();
      thisWdigetBooking.selectedTable = null;
      const activeTable = thisWdigetBooking.dom.floor.querySelector(select.booking.tableSelected);
      if (activeTable) {
        activeTable.classList.remove(classNames.booking.selected);
      }

    });

    thisWdigetBooking.dom.floor.addEventListener('click', function (event) {
      event.preventDefault();
      if (event.target.classList.contains(classNames.booking.table)) {
        thisWdigetBooking.handleTableClick(event.target);
      }
    });
    thisWdigetBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisWdigetBooking.sendBooking();
    });
  }
}

export default Booking;