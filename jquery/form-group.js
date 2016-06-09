import $ from 'jquery'

class FormGroup {

  constructor(element, options) {
    this.$element = $(element)
    this.$label = this.$element.find('label')
    this.$input = this.$element.find('.form__group__control')
    this.$info = this.$element.find('.form__group__info')
    this.$error = this.$element.find('.form__group__error')

    this.defaults = {}

    this.options = $.extend({}, this.defaults, options)

    this.init()
  }

  init() {

    let that = this

    // Manage input field specialities:

    if (this.$element.find('.datepicker--birthday-v2').length > 0) {

      this.$element.addClass('material-datepicker')
      this.$label.detach().appendTo(this.$element)

      this.$element.find('input').each(function() {

        $(this).on('focus blur', function() {

          that.$element.removeClass('focused')

          that.$element.find('input').each(function() {
            if ($(this).is(':focus')) {
              that.$element.addClass('focused')
            }
          })

        })

      })

      return

    }

    if (this.$element.find('.dropdown').length > 0) {

      this.$element.addClass('material')

      this.$input.find('.dropdown').each(function(){
        that.$element
          .addClass('form__group__dropdown')
      })

      if (this.$element.find('.form__group__label__info-icon').length > 0) {
        this.$element.addClass('has-icon')
      }

      let $icon = this.$element.find('.form__group__label__info-icon').clone()
      this.$element.find('.form__group__label__info-icon').remove()
      this.$element.prepend($icon)

    }

    if (this.$element.find('.control--input, .control--textarea').length > 0) {

      this.$element.addClass('material')

      // Reorder elements:

      this.$element
        .html('')
        .append(this.$input)
        .append(this.$label)
        .append(this.$info)
        .append(this.$error)

      let $icon = this.$element.find('.form__group__label__info-icon').clone().remove()
      this.$element.prepend($icon)

      // Manage extra classes:

      if (this.$input.val() != '') {
        this.$element.addClass('filled')
      }

      this.$input.find('input, textarea')
        .on('keyup', function() {
          if ($(this).val() != "") {
            that.$element.addClass('filled')
          } else {
            that.$element.removeClass('filled')
          }
        })
        .on('focus', function() {
          that.$element.addClass('focused')
        })
        .on('blur', function() {
          that.$element.removeClass('focused')
        })

      this.$input.find('input:disabled, textarea:disabled').each(function(){
        that.$element.addClass('disabled')
      })

      this.$input.find('input.has-error, textarea.has-error').each(function(){
        that.$element.addClass('has-error')
      })

      this.$input.find('input, textarea').each(function(){
        if ($(this).val() != "") {
          that.$element.addClass('filled')
        }
        if ($(this).is('textarea')) {
          that.$element.addClass('is-textarea')
        }
      })

      if (this.$element.find('.control--input').length > 0 && this.$element.find('.form__group__label__info-icon').length > 0) {
        this.$input.find('input').addClass('has-icon')
      }

      // Bind info icon:

      this.$element.find('a.info-icon').on('click', function(e) {
        this.$element.find('.form__group__info').toggleClass('is-open')
      }.bind(this))

    } else {
      this.$element.addClass('default')
    }

  }

}

function Plugin() {
  let params = arguments

  return this.each(function () {
    let $this = $(this)
    let data = $this.data('axa.form-group')

    if (!data) {
      data = new FormGroup(this)
      $this.data('axa.form-group', data)
    }

    let method = params[0]
    if (typeof(method) === 'string') {
      data[method](...params.slice(1))
    }
  })
}

$.fn.formGroup = Plugin
$.fn.formGroup.Constructor = FormGroup

$(function () {
  $('[data-form-group]').each(function () {
    let $formGroup = $(this)
    let data = $formGroup.data()
    Plugin.call($formGroup, data)
  })
})

// Copyright AXA Versicherungen AG 2015
