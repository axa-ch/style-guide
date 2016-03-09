import $ from 'jquery'

class BirthdayDatepicker {
  constructor(element, options) {
    this.$element = $(element)

    this.defaults = {
      "maxAge"        : 120,
      "minAge"        : 18
    };
    
    this.$day = $(element).find('.birthday--day select')
    this.$month = $(element).find('.birthday--month select')
    this.$year = $(element).find('.birthday--year select')
    this.$input = $(element).find('input')

    this.day = ''
    this.month = ''
    this.year = ''

    this.options = $.extend({}, this.defaults, options)

    this.init()
  }

  init() {
    
    this.generateOptions()

    this.$day.on('change', () => this.handleChange() )
    this.$month.on('change', () => this.handleChange() )
    this.$year.on('change', () => this.handleChange() )

  }

  generateOptions() {
    
    var x, currentYear;

    // Days:
    for (x = 1; x <= 31; x++) {
      let $option = $('<option />').text(x).appendTo(this.$day)
    }
    
    // Years:
    currentYear = new Date().getFullYear()
    for (x = (currentYear - this.options.minAge); x >= (currentYear - this.options.minAge - this.options.maxAge); x--) {
      let $option = $('<option />').text(x).appendTo(this.$year)
    }

  }

  handleChange() {

    this.day = this.$day.val()
    this.month = this.$month.val()
    this.year = this.$year.val()

    if (this.day !== '' && this.month !== '' && this.year !== ''){
      this.$input.val(`${this.year}-${this.addLeadingZero(this.month)}-${this.addLeadingZero(this.day)}`)
    }

  }

  addLeadingZero(num) {
    if (num < 10) num = '0' + num;
    return num;
  }

}

function Plugin() {
  let params = arguments

  return this.each(function () {
    let $this = $(this)
    let data = $this.data('axa.datepicker-birthday')

    if (!data) {
      data = new BirthdayDatepicker(this)
      $this.data('axa.datepicker-birthday', data)
    }

    let method = params[0]
    if (typeof(method) === 'string') {
      data[method](...params.slice(1))
    }
  })
}

$.fn.birthdayDatepicker = Plugin
$.fn.birthdayDatepicker.Constructor = BirthdayDatepicker

$(function () {
  $('[data-datepicker-birthday]').each(function () {
    let $birthdayDatepicker = $(this)
    let data = $birthdayDatepicker.data()
    Plugin.call($birthdayDatepicker, data)
  })
})

// Copyright AXA Versicherungen AG 2015