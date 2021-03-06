/*!
 * react-split-date-input 1.0.0 (dev build at Sat, 27 Dec 2014 20:28:16 GMT) - https://github.com/insin/react-split-date-input
 * MIT Licensed
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.SplitDateInput=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null)

var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

var MONTH_NAMES = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')

var MONTH_NAME_LOOKUP = MONTH_NAMES.reduce(function(l, m, i)  {return l[m] = i, l;}, {})

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)
}

function daysInMonth(month, year) {
  return (month === 1 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month])
}

var SplitDateInput = React.createClass({displayName: "SplitDateInput",
  statics: {
    valueFromData:function(data, files, name) {
      var $__0=    'year month day'.split(' ').map(function(f)  {return (name + "_" + f);}),year=$__0[0],month=$__0[1],day=$__0[2]
      if (!data[year] || !data[month] || !data[day]) {
        return ''
      }
      return (data[year] + "-" + data[month] + "-" + data[day])
    }
  },

  propTypes: {
    name: React.PropTypes.string
  , onChange: React.PropTypes.func.isRequired
  , noButtons: React.PropTypes.bool
  , value: React.PropTypes.instanceOf(Date)
  },

  getDefaultProps:function() {
    return {
      name: 'splitDateInput'
    , noButtons: false
    }
  },

  getInitialState:function(date) {
    if (typeof date == 'undefined') {
      date = this.props.value
    }
    return {
      month: date.getMonth()
    , year: date.getFullYear()
    , day: date.getDate()
    // Separate *Text state for input values allow the user to type whatever
    // they want, including invalid values. If an invalid value is present
    // onBlur, we will replace it.
    , monthText: MONTH_NAMES[date.getMonth()]
    , dayText: String(date.getDate())
    , yearText: String(date.getFullYear())
    }
  },

  // Shared
  // ======

  triggerChange:function() {
    var $__0=    this.state,year=$__0.year,month=$__0.month,day=$__0.day
    this.props.onChange(new Date(year, month, day))
  },

  getAdjustedDay:function(month, year) {
    var daysInNewMonth = daysInMonth(month, year)
    return this.state.day > daysInNewMonth ? daysInNewMonth : this.state.day
  },

  // Month
  // =====

  decreaseMonth:function() {
    var month = this.state.month === 0 ? 11 : this.state.month - 1
    var day = this.getAdjustedDay(month, this.state.year)
    var monthText = MONTH_NAMES[month]
    this.setState({day:day, dayText: String(day), month:month, monthText:monthText}, this.triggerChange)
  },

  increaseMonth:function() {
    var month = this.state.month === 11 ? 0 : this.state.month + 1
    var day = this.getAdjustedDay(month, this.state.year)
    var monthText = MONTH_NAMES[month]
    this.setState({day:day, dayText: String(day), month:month, monthText:monthText}, this.triggerChange)
  },

  onMonthBlur:function(e) {
    if (this.state.monthText != MONTH_NAMES[this.state.month]) {
      this.setState({monthText: MONTH_NAMES[this.state.month]})
    }
  },

  onMonthChange:function(e) {
    var monthText = e.target.value
    if (monthText in MONTH_NAME_LOOKUP) {
      var month = MONTH_NAME_LOOKUP[monthText]
      var day = this.getAdjustedDay(month)
      this.setState({day:day, dayText: String(day), month:month, monthText:monthText}, this.triggerChange)
    }
    else {
      this.setState({monthText:monthText})
    }
  },

  onMonthKeyDown:function(e) {
    if ((e.key == 'ArrowDown' || e.key == 'ArrowUp') &&
        e.target.value in MONTH_NAME_LOOKUP) {
      e.preventDefault()
      if (e.key == 'ArrowUp') {
        this.increaseMonth()
      }
      else {
        this.decreaseMonth()
      }
    }
  },

  // Day
  // ===

  increaseDay:function() {
    var day = (this.state.day === daysInMonth(this.state.month, this.state.year)
               ? 1
               : this.state.day + 1)
    this.setState({day:day, dayText: String(day)}, this.triggerChange)
  },

  decreaseDay:function() {
    var day = (this.state.day === 1
               ? daysInMonth(this.state.month, this.state.year)
               : this.state.day - 1)
    this.setState({day:day, dayText: String(day)}, this.triggerChange)
  },

  onDayKeyDown:function(e) {
    if (e.key == 'ArrowUp') {
      e.preventDefault()
      this.increaseDay()
    }
    else if (e.key == 'ArrowDown') {
      e.preventDefault()
      this.decreaseDay()
    }
  },

  onDayChange:function(e) {
    var dayText = e.target.value
    if (/^(?:0?[1-9]|[12][0-9]|3[01])$/.test(dayText) &&
        Number(dayText) <= daysInMonth(this.state.month, this.state.year)) {
      this.setState({day: Number(dayText), dayText:dayText}, this.triggerChange)
    }
    else {
      this.setState({dayText:dayText})
    }
  },

  onDayBlur:function(e) {
    if (this.state.dayText != String(this.state.day)) {
      this.setState({dayText: String(this.state.day)})
    }
  },

  // Year
  // ====

  increaseYear:function() {
    var year = this.state.year + 1
    var day = this.getAdjustedDay(this.state.month, year)
    this.setState({day:day, dayText: String(day), year:year, yearText: String(year)}, this.triggerChange)
  },

  decreaseYear:function() {
    var year = this.state.year - 1
    var day = this.getAdjustedDay(this.state.month, year)
    this.setState({day:day, dayText: String(day), year:year, yearText: String(year)}, this.triggerChange)
  },

  onYearKeyDown:function(e) {
    if (e.key == 'ArrowUp') {
      e.preventDefault()
      this.increaseYear()
    }
    else if (e.key == 'ArrowDown') {
      e.preventDefault()
      this.decreaseYear()
    }
  },

  onYearChange:function(e) {
    var yearText = e.target.value
    if (/^\d{4,}$/.test(yearText)) {
      var year = Number(yearText)
      var day = this.getAdjustedDay(this.state.month, year)
      this.setState({day:day, dayText: String(day), year:year, yearText:yearText}, this.triggerChange)
    }
    else {
      this.setState({yearText:yearText})
    }
  },

  onYearBlur:function(e) {
    if (this.state.yearText != String(this.state.year)) {
      this.setState({yearText: String(this.state.year)})
    }
  },

  render:function() {
    var $__0=   this.props,name=$__0.name,noButtons=$__0.noButtons
    var $__1=       this.state,monthText=$__1.monthText,month=$__1.month,dayText=$__1.dayText,day=$__1.day,yearText=$__1.yearText,year=$__1.year
    var showButtons = !noButtons
    var daysInCurrentMonth = daysInMonth(month, year)
    return React.createElement("div", {className: ("SplitDateInput SplitDateInput--" + (noButtons ? 'no' : '') + "buttons")},
      React.createElement("div", {className: "SplitDateInput__part SplitDateInput__month"},
        showButtons && React.createElement("button", {type: "button", onClick: this.increaseMonth, tabIndex: "-1"},
          "+"
        ),
        React.createElement("datalist", {id: (name + "-months")},
          MONTH_NAMES.map(function(month)  {return React.createElement("option", {value: month, key: month});})
        ),
        React.createElement("input", {type: "text", name: ("S{name}_month"), value: monthText, size: "3",
          onKeyDown: this.onMonthKeyDown, onChange: this.onMonthChange, onBlur: this.onMonthBlur,
          tabIndex: "0", maxLength: "3", autoComplete: "off", list: (name + "-months"),
          role: "spinbutton", "aria-label": "Month", "aria-valuenow": month,
          "aria-valuetext": monthText, "aria-valuemin": "0", "aria-valuemax": "11"}
        ),
        showButtons && React.createElement("button", {type: "button", onClick: this.decreaseMonth, tabIndex: "-1"},
          "−"
        )
      ),
      React.createElement("div", {className: "SplitDateInput__part SplitDateInput__day"},
        showButtons && React.createElement("button", {type: "button", onClick: this.increaseDay, tabIndex: "-1"},
          "+"
        ),
        React.createElement("input", {type: "text", name: ("S{name}_day"), value: dayText, size: "2",
          onKeyDown: this.onDayKeyDown, onChange: this.onDayChange, onBlur: this.onDayBlur,
          tabIndex: "0", maxLength: "2", autoComplete: "off",
          role: "spinbutton", "aria-label": "Day", "aria-valuenow": day,
          "aria-valuemin": "1", "aria-valuemax": daysInCurrentMonth}
        ),
        showButtons && React.createElement("button", {type: "button", onClick: this.decreaseDay, tabIndex: "-1"},
          "−"
        )
      ),
      React.createElement("div", {className: "SplitDateInput__part SplitDateInput__year"},
        showButtons && React.createElement("button", {type: "button", onClick: this.increaseYear, tabIndex: "-1"},
          "+"
        ),
        React.createElement("input", {type: "text", name: ("S{name}_year"), value: yearText, size: "4",
          onKeyDown: this.onYearKeyDown, onChange: this.onYearChange, onBlur: this.onYearBlur,
          tabIndex: "0", maxLength: "4", autoComplete: "off",
          role: "spinbutton", "aria-label": "Year", "aria-valuenow": year,
          "aria-valuemin": "-999", "aria-valuemax": "9999"}
        ),
        showButtons && React.createElement("button", {type: "button", onClick: this.decreaseYear, tabIndex: "-1"},
          "−"
        )
      )
    )
  }
})

module.exports = SplitDateInput
},{}]},{},[1])(1)
});