// events
const getDispatch = (components) => {
  const Dispatch = d3.dispatch(
    'changeyear',
    'setyear',
    'setera',
    'highlightfeature',
    'removehighlight',
    'addoverlay',
    'removeoverlay',
    'addviews',
    'showviews',
    'hideviews',
    'resetviews',
    'setopacity',
    'setlayers',
    'viewshedclick',
    'showresults',
    'removeprobe',
    'drawfeature',
    'removeall',
    'statechange',
    'cancelmemory',
    'showaddmemory',
);

  Dispatch.on('changeyear', (newYear) => {
    const {
      Legend,
      Search,
      Filmstrip,
      init,
      Map,
    } = components;

    const {
      updateEra,
      updateHash,
    } = init;

    Map.setYear(newYear);
    Legend.setYear(newYear);
    Filmstrip.setYear(newYear);
    Search.setYear(newYear);
    init.setYear(newYear);
    Dispatch.call('removeoverlay', this);
    updateEra();
    updateHash();
  });

  Dispatch.on('setyear', (newYear) => {
    const { Timeline } = components;

    Timeline.setYear(newYear);
    Dispatch.call('changeyear', this, newYear);
  });

  Dispatch.on('highlightfeature', (json) => {
    const { Map } = components;

    Map.highlightFeature(json);
  });

  Dispatch.on('removehighlight', () => {
    const { Map } = components;

    Map.removeHighlight();
    $('.layer-existing.highlighted, .layer-plans.highlighted').removeClass('highlighted');
    $('.layer-plans').data('selected-plan', null);
  });

  Dispatch.on('addoverlay', (p) => {
    const {
      Map,
      init,
      probes,
    } = components;
    const { updateHash } = init;
    const { rasterProbe } = probes;
    Map.addOverlay(p.data.overlay);
    rasterProbe(p);
    $('#overlay-info').data('p', p).show();
    // $('.probe-hint').css('margin-right', '65px');
    updateHash();
  });

  Dispatch.on('removeoverlay', () => {
    const { Map, init } = components;
    const { updateHash } = init;
    Map.removeOverlay();
    $('#fixed-probe').hide();
    $('#overlay-info').data('p', null).hide();
    // $('.probe-hint').css('margin-right', '0');
    updateHash();
  });

  Dispatch.on('setopacity', (val) => {
    const { Map } = components;
    Map.setOverlayOpacity(val);
  });

  // set layers on map
  Dispatch.on('setlayers', (list) => {
    const { Map, init } = components;
    const { updateHash } = init;
    Map.setLayers(list);
    updateHash();
  });

  Dispatch.on('viewshedclick', (id) => {
    const { Filmstrip, probes } = components;
    const { rasterProbe } = probes;
    const raster = _.find(Filmstrip.getRasters(), r => r.id == id);
    if (raster) rasterProbe(raster.photo);
  });

  Dispatch.on('showresults', (results, clicked) => {
    const { Search } = components;
    Search.showResults(results, clicked);
  });

  Dispatch.on('removeprobe', () => {
    const { Search, Map } = components;
    Search.clear();
    Map.clearSelected();
    $('#fixed-probe').hide();
  });

  Dispatch.on('drawfeature', (data) => {
    const { Map, init, probes } = components;
    const { mobile, server } = init;
    const { detailsProbe } = probes;
    Map.drawFeature(data.name);
    if (mobile) $('#search .icon-left-big').click();
    $.getJSON(server + 'details/' + data.id[0], (response) => {
      let content = '';
      if (response.length) {
        if (response[0].creator) content += '<p>Creator: <span>' + response[0].creator + '</span></p>';
        if (response[0].year) content += '<p>Mapped: <span>' + response[0].year + '</span></p>';
      }
      if (mobile) detailsProbe(data.name, content);
    });
  });

  Dispatch.on('removeall', () => {
    const { Map } = components;
    $('.probe').hide();
    $('.lightbox').hide();
    $('main').removeClass('eras');
    Map.clearSelected();
  });

  Dispatch.on('statechange', () => {
    const { init } = components;
    const { updateHash } = init;
    updateHash();
  });

  Dispatch.on('addviews', () => {
    const { Legend } = components;
    Legend.addViews();
  });

  Dispatch.on('showviews', () => {
    const { Map } = components;
    Map.showViews();
  });

  Dispatch.on('hideviews', () => {
    const { Map } = components;
    Map.hideViews();
  });

  Dispatch.on('resetviews', () => {
    const { Map, Legend } = components;
    Map.showViews();
    Legend.hasViews = true;
  });

  Dispatch.on('cancelmemory', () => {
    $('.memory-icon').hide();
  });

  Dispatch.on('showaddmemory', (lat, lng) => {
    // this doesn't exist anywhere???
    showAddMemory(lat, lng);
  });
  return Dispatch;
};

export default getDispatch;
