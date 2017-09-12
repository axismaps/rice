// timeline 
let Timeline = (function($, dispatch) {
  
  let T = {};

  let timeline;
  let stepper;
  let years;
  let yearRange = [];
  let year = 2015;

  function init_events () {
    $('.timeline-slider, .timeline-track', timeline).on('mousedown', function (e) {
      let y = getDataForMouseEvent(e).year;
      $(document)
        .on('mousemove.timeslide', function (e) {
          let d = getDataForMouseEvent(e);
          $('.timeline-slider', timeline).css('left', d.pct * 100 + '%');
          y = d.year;
        })
        .on('mouseup.timeslide mouseleave.timeslide', function (){
          $(document).off('mousemove.timeslide mouseup.timeline mouseleave.timeslide');
          updateYear(y);
        })
    });

    $('.timeline-track, .timeline-slider', timeline)
      .on('mousemove.timeline', function (e) {
        let d = getDataForMouseEvent(e);
        $('.timeline-probe', timeline)
          .show()
          .css('left', d.pct * 100 + '%')
          .html(d.year);
      })
      .on('mouseleave', function () {
        $('.timeline-probe', timeline).hide();
      });
  }

  $(window).resize(function () {
    addTicks();
  });

  function getDataForMouseEvent (e) {
    let t = $('.timeline-track', timeline);
    let x = e.pageX - t.offset().left;
    let pct = x / t.width();
    pct = Math.max(0, Math.min(pct, 1));
    let y = Math.round(pct * (yearRange[1] - yearRange[0]) + yearRange[0]);
    return {pct: pct, year: y};
  }

  function addTicks () {
    $('.ticks', timeline).remove()
    let major = window.innerWidth >= 800 ? 10 : 20;
    let minor = major / 2;
    let ticksContainer = $('<div class="ticks">').prependTo($('.timeline-track'), timeline);
    appendTick('major', yearRange[0], ticksContainer);
    let next = Math.ceil(yearRange[0] / minor) * minor;
    if (next === yearRange[0]) next += minor;
    while (next < yearRange[1]) {
      appendTick(next % major === 0 ? 'major' : 'minor', next, ticksContainer);
      next += minor;
    }
    let last = $('.tick:last-child', ticksContainer);
    if (last.hasClass('tick-major') && last.position().left > $('.timeline-track', timeline).width() - 55)
      $('span', last).remove();
    let first = $('.tick-major', ticksContainer).eq(1);
    if (first.position().left < 55)
      $('span', first).remove();
    appendTick('major', yearRange[1], ticksContainer);
  }

  function appendTick (type, value, container) {
    var pct = (value - yearRange[0]) / (yearRange[1] - yearRange[0]);
    var t = $('<div>')
      .attr('class', 'tick tick-' + type)
      .css('left', pct * 100 + '%')
      .appendTo(container);
    if (type == 'major') t.append('<span>' + value + '</span>');
  }
/*
  function snapToYear (y) {
    if (years.indexOf(y) !== -1) updateYear(y);
    else if (y <= yearRange[0]) updateYear(yearRange[0]);
    else if (y >= yearRange[1]) updateYear(yearRange[1]);
    else {
      for (let i=0; i<years.length -1; i++) {
        if (years[i] < y && years[i+1] > y) {
          +y - years[i] > years[i+1] - +y ?
            updateYear(years[i+1]) :
            updateYear(years[i]);
        }
      }
    }
  }
*/
  function updateYear (y) {
    y = Math.max(yearRange[0], Math.min(+y, yearRange[1]));
    year = y;
    $('.year', stepper).html(year);
    var pct = (year - yearRange[0]) / (yearRange[1] - yearRange[0]);
    $('.timeline-slider', timeline).css('left', pct * 100 + '%');
    dispatch.call('changeyear', this, year);
  }

  T.initialize = function (yearsData, containerId) {
    if (timeline) return;
    let container = $('#' + containerId);
    years = yearsData;
    year = yearsData[0];
    yearRange = [+years[0], +years[years.length-1]];
    stepper = $('<div>')
      .attr('class', 'year-stepper')
      .appendTo(container);
    stepper.append('<i class="icon-angle-left">')
      .append('<div class="year">' + year + '</div>')
      .append('<i class="icon-angle-right">');
    timeline = $('<div>')
      .attr('class', 'timeline')
      .appendTo(container);
    timeline.append('<div class="timeline-track">')
      .append('<div class="timeline-slider">');
    timeline
      .append('<div class="timeline-probe">' + year + '<div>');

    addTicks();

    init_events();
  }

  T.setYear = function (newYear) {
    if (newYear == year) return;
    year = newYear;
    $('.year', stepper).html(year);
  }

  return T;
})(jQuery, Dispatch);