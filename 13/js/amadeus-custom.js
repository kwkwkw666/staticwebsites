jQuery(function($) {
  var domain_url = "https://zepflight.com";

	$(".andy_datepicker_from").datepicker({
    numberOfMonths: 1,
    dateFormat: 'yy-mm-dd',
    minDate: new Date(),
    onSelect: function(selected) {
      $(".andy_datepicker_to").datepicker("option","minDate", selected)
    }
  });
  $(".andy_datepicker_to").datepicker({ 
    numberOfMonths: 1,
    dateFormat: 'yy-mm-dd',
    onSelect: function(selected) {
       $(".andy_datepicker_from").datepicker("option","maxDate", selected)
    }
  }); 

  $('.andy_datepicker').datepicker({
    dateFormat: 'dd-M-yy',
  });
  $(".andy_datepicker_current").datepicker({
    dateFormat: 'dd-M-yy',
    minDate: new Date(),
  });
  $(".andy_datepicker_current_max").datepicker({
    dateFormat: 'dd-M-yy',
    maxDate: new Date(),
  });

  autoComplete = [];
  $.getJSON(domain_url+'/library/airport.json', function(data) {
    $.each(data, function(key, value) {
      var codes = value.substring(0,3);
      if ($.inArray(value, autoComplete) === -1) {
          autoComplete.push(value);
      }
    })
  });
  $(".andy_autocomplete").autocomplete({
      source: function( request, response ) {
      var stringLength = $.ui.autocomplete.escapeRegex( request.term ).length;
      var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
      var matcher2 = new RegExp( $.ui.autocomplete.escapeRegex( request.term )+"+", "i" );
            
      var isData = 1;
      response( $.grep( autoComplete, function( item ) {
               
        if(stringLength<=3) {
            if(matcher.test( item )) {
               isData = 22;
            }
            return matcher.test( item );
        } else {
            if(matcher2.test( item )) {
                isData = 22;
            }
            return matcher2.test( item ); 
        }
               
      }) );
      if(stringLength==3 && isData == 1 ) {
        response( $.grep( autoComplete, function( item ){                 
          return matcher2.test( item );                 
        }) );
      }
    },
    minLength: 1,
  });

  $('.andy_search_form').submit(function(e){
  	let p = $(this).parent();
    let tr = p.find('input[name="flight-trip"]:checked').val();
  	let fr = p.find('input[name="flightFrom"]').val();
  	let to = p.find('input[name="flightTo"]').val();
  	let de = p.find('input[name="flightDepart"]').val();
  	let re = p.find('input[name="flightReturn"]').val();
  	let ad = p.find('input[name="adults"]').val();
  	let ch = p.find('input[name="children"]').val();
  	let inf = p.find('input[name="infants"]').val();
  	let cl = p.find('input[name="flight-class"]').val();
  	let total = parseInt(ad) + parseInt(ch) + parseInt(inf);
  	if( (tr == '') || (fr == '') || (to == '') || (de == '') || ((re == '') && (tr == 'round')) || (ad == '') || (ch == '') ||  (inf == '') || (cl == '') ) {
  		e.preventDefault();
  		swal("", "All fields are required", "warning");
  	}
  	else if( (ad <= 0) || ad > 9 ) {
  		e.preventDefault();
  		swal("", "Invalid input", "warning");
  	}
  	else if( (ch < 0) || ch > 9 ) {
  		e.preventDefault();
  		swal("", "Invalid input", "warning");
  	}
  	else if( (inf < 0) || inf > 9 ) {
  		e.preventDefault();
  		swal("", "Invalid input", "warning");
  	}
  	else if( total > 9 ) {
  		e.preventDefault();
  		swal("", "Maximum 9 passengers are allowed", "warning");
  	} else {
      $('#search_preloader_home').modal({
        show : true,
        backdrop : 'static',
        keyboard : false,
      });
    }
  })

  $('#AmadeusTravellersClass').on('click', function() {
    $('.travellers-dropdown').slideToggle('fast');    
  });
  function changetraveller() {
    let ad = $('input[name="adults"]').val();
    let ch = $('input[name="children"]').val();
    let inf = $('input[name="infants"]').val();
    let totalCount = parseInt(ad) + parseInt(ch) + parseInt(inf);
    var fc = $('input[name="flight-class"]:checked  + label').text();
    $('#AmadeusTravellersClass').val(totalCount + ' - ' + fc);
  }
  $('.spinnerbtn').find('input').on('change', function() {
    changetraveller();
  }).trigger('change');

  $('input[name="flight-class"]').click(function(e){
    changetraveller();
  })

  $('.spinnerbtn .btn:first-of-type').on('click', function() {
    var btn = $(this);
    var input = btn.closest('.spinnerbtn').find('input');
    if (input.attr('max') == undefined || parseInt(input.val()) < parseInt(input.attr('max'))) {    
      input.val(parseInt(input.val(), 10) + 1).change();
    } else {
      btn.next("disabled", true);
    }
  });
  $('.spinnerbtn .btn:last-of-type').on('click', function() {
    var btn = $(this);
    var input = btn.closest('.spinnerbtn').find('input');
    if (input.attr('min') == undefined || parseInt(input.val()) > parseInt(input.attr('min'))) {    
      input.val(parseInt(input.val(), 10) - 1).change();
    } else {
      btn.prev("disabled", true);
    }
  });

  // Booking
  $('#bookingForm').submit(function(e){
    e.preventDefault();
    var $this = $(this);
    var attr = $('#ptp').attr('disabled');
    if (typeof attr !== typeof undefined && attr !== false) {
      
    }
    else
    {
      $.ajax({
        url : domain_url+'/library/ajax.php?action=bookingData',
        type : 'POST',
        data : new FormData(this),
        cache : false,
        processData : false,
        contentType : false,
        beforeSend : function(){
          $('#ptperror').html('<span class="text-info">Processing...</span>');
          $('#ptp').attr('disabled', 'disabled');
        },
        success: function( json ) {
          //alert(json); 
          var data = JSON.parse( json );
          if( data.msg == 'success' ) {
			window.location = data.redirect; 
          } else {
            $('#ptperror').html('<span class="text-danger">'+data.msg+'</span>');
            $('#ptp').removeAttr('disabled');
          }
        }
      })
    }
  })

  $('.customPreloader').click(function(){
    $('#search_preloader_home').modal({
      show : true,
      backdrop : 'static',
      keyboard : false,
    });
  })
})

// FILTER
jQuery(document).ready(function($){

  function timeConvert(num) {
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "H" + rminutes + "M";
  }

  function removeDuplicates( data ) {
    return data.filter(( value, index ) => data.indexOf(value) === index);
  }

  function removeArrayVal( array, val ){
    var index = array.indexOf(val);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }

  function custom_pagination( item = ".fly-in"  ) {
    $(item).hide();
    $('#noresult').hide();
    $('#search_preloader').fadeIn();
    var size_li = $(item).length;
    var increase =  10;
    $(item+':lt('+increase+')').show();
    $('.amadeus-pagination').attr('data-total', size_li);
    $('.amadeus-pagination').attr('data-offset', increase);
    $('.amadeus-pagination').attr('data-increase', increase);
    $('#totalResult').text(size_li+' Results found');

    if( size_li > 0 ) $('#noresult').hide();
    else $('#noresult').show();

    if( size_li <= increase )
      $('.amadeus-pagination').css("display", "none");
    else
      $('.amadeus-pagination').css("display", "inline-block");

    setTimeout(function(){$('#search_preloader').fadeOut();},2000);
  }
  function load_stops() {
    let s = $('input[name="stops[]"]').map(function(){return $(this).val();}).get();
    let i;
    let h = '<option value="EMPTY">Stops</option>';
    let a;
    let min = Math.min(...s);
    let max = Math.max(...s);
    for ( i = min;i <= max; i++ ) {
      if( i > 1 ) a = (i-1)+' Stops';
      else a = 'Non Stop';
      h += '<option value="'+i+'">'+a+'</option>';
    }
    $('#stops_list').html(h);
  }
  function load_fare() {
    let f = $('input[name="fare[]"]').map(function(){return $(this).val();}).get();
    f = removeDuplicates(f);
    let min = Math.min(...f);
    let max = Math.max(...f);
    $( "#slider-range" ).attr('data-min', parseInt(min));
    $( "#slider-range" ).attr('data-max', parseInt(max));

    $("#ammount-from").text(parseInt(min));
    $("#ammount-to").text(parseInt(max)+10);
    $('input[name="minfare"]').val(parseInt(min));
    $('input[name="maxfare"]').val(parseInt(max)+10);
    
  }

  function load_travel() {
    let t = $('input[name="travel[]"]').map(function(){return $(this).val();}).get();
    let min = Math.min(...t);
    let max = Math.max(...t);

    $( "#slider-duration" ).attr('data-min', parseInt(min));
    $( "#slider-duration" ).attr('data-max', parseInt(max));

    $("#duration-from").text(timeConvert(min));
    $("#duration-to").text(timeConvert(max));
    $('input[name="minduration"]').val(parseInt(min));
    $('input[name="maxduration"]').val(parseInt(max));
  }

  $('.amadeus-pagination').click(function () {
    let t = $(this).attr('data-total');
    let o = $(this).attr('data-offset');
    let i = $(this).attr('data-increase');
    let a = parseInt(o)+parseInt(i);
    $('.fly-in:lt('+a+')').show(100);
    $(this).attr('data-offset', (parseInt(o)+parseInt(i)));
    if(parseInt(o) >= parseInt(t)){
      $(this).hide();
    } else {
      $(this).show();
    }
  });

  custom_pagination();
  load_stops();
  load_fare();
  load_travel();

  var min_val = $( "#slider-range" ).attr('data-min');
  var max_val = $( "#slider-range" ).attr('data-max');
  $( "#slider-range" ).slider({
    range: true,
    min: parseInt(min_val),
    max: parseInt(max_val)+10,
    values: [ min_val,max_val ],
    slide: function( event, ui ) {
      $("#ammount-from").text(ui.values[0]);
      $("#ammount-to").text(ui.values[1]);
      $('input[name="minfare"]').val(ui.values[0]).change();
      $('input[name="maxfare"]').val(ui.values[1]).change();
    }
  });

  var min_val_duration = $( "#slider-duration" ).attr('data-min');
  var max_val_duration = $( "#slider-duration" ).attr('data-max');
  $( "#slider-duration" ).slider({
    range: true,
    min: parseInt(min_val_duration),
    max: parseInt(max_val_duration),
    values: [ min_val_duration,max_val_duration ],
    slide: function( event, ui ) {
      $("#duration-from").text(timeConvert(ui.values[0]));
      $("#duration-to").text(timeConvert(ui.values[1]));
      $('input[name="minduration"]').val(ui.values[0]).change();
      $('input[name="maxduration"]').val(ui.values[1]).change();
    }
  });

  function data_attr( attr, val ) {
    if( val == 'EMPTY' || val == '' || val == null || attr == '' ) return '';
    else return '[data-'+attr+'="'+val+'"]';
  }

  function applyfilter() {
    let s = $('#stops_list').val();
    let a = $('#airline_list').val();

    if( s == 'EMPTY' || s == '' ) {
      $('#clearStop').removeClass('andy_di');
      $('#clearStop .clearText').html('Stops<span>×</span>');
    } else {
      $('#clearStop').addClass('andy_di');
      let s_n = $("#stops_list option:selected").text();
      $('#clearStop .clearText').html(s_n+'<span>×</span>');
    }

    if( a == 'EMPTY' || a == '' ) {
      $('#clearAirline').removeClass('andy_di');
      $('#clearAirline .clearText').html('Airline<span>×</span>');
    }
    else {
      $('#clearAirline').addClass('andy_di');
      let a_n = $("#airline_list option:selected").text();
      $('#clearAirline .clearText').html(a_n+'<span>×</span>');
    }

    let minf = parseInt($('input[name="minfare"]').val());
    let maxf = parseInt($('input[name="maxfare"]').val());

    let mind = parseInt($('input[name="minduration"]').val());
    let maxd = parseInt($('input[name="maxduration"]').val());

    $('.flight-item').removeClass('fly-in');
    $('.flight-item').hide();
    let element = $('.flight-item'+data_attr('stop', s)+data_attr('airline', a));

    element.filter(function() {
      let data_fare = parseInt($(this).attr("data-fare"));
      let data_travel = parseInt($(this).attr("data-travel"));
      let data_dep = parseInt($(this).attr("data-departure"));
      let de = $('#departure_time').val();

      if( de == 'EMPTY' || de == '' ) {
        $('#clearDeparture').removeClass('andy_di');
        $('#clearDeparture .clearText').html('Departure Time<span>×</span>');
        if( (data_fare >= minf) && (data_fare <= maxf) && (data_travel >= mind) && (data_travel <= maxd) )
          $(this).addClass('fly-in');
      } else {
        de = de.split(',');
        $('#clearDeparture').addClass('andy_di');
        let s_n = $('input[name="flight_time"][data-starttime="'+de[0]+'"][data-endtime="'+de[1]+'"]').parent().find('label').text();
        $('#clearDeparture .clearText').html(s_n+'<span>×</span>');
        if( (data_fare >= minf) && (data_fare <= maxf) && (data_travel >= mind) && (data_travel <= maxd) && (data_dep >= parseInt(de[0].trim())) && (data_dep <= parseInt(de[1].trim())) )
          $(this).addClass('fly-in');
      }
    }); 

    custom_pagination();
  }

  $('.selectfilter').change(function(e){
    applyfilter();
    var min_val = parseInt( $( "#slider-range" ).attr('data-min') );
    var max_val = parseInt( $( "#slider-range" ).attr('data-max') );
    let minf = parseInt( $('input[name="minfare"]').val() );
    let maxf = parseInt( $('input[name="maxfare"]').val() );

    var min_val_duration = $( "#slider-duration" ).attr('data-min');
    var max_val_duration = $( "#slider-duration" ).attr('data-max');
    let mind = parseInt( $('input[name="minduration"]').val() );
    let maxd = parseInt( $('input[name="maxduration"]').val() );

    if( minf > min_val || maxf < max_val ) {
      $('#clearPrice').addClass('andy_di');
      $('#clearPrice .clearText').html('Price ' +minf+ ' - ' +maxf+ '<span>×</span>');
    } else {
      $('#clearPrice').removeClass('andy_di');
      $('#clearPrice .clearText').html('Price<span>×</span>');
    }

    if( mind > min_val_duration || maxd < max_val_duration )
      $('#clearDuration').addClass('andy_di');
    else
      $('#clearDuration').removeClass('andy_di');

  });
  $('input[name="flight_time"]').click(function() {
    let i = $(this).attr('data-id');
    if( $(this).is(':checked') ) {
      $('#clearDeparture').click();
      $(this).prop('checked', true);
      let s = $(this).attr('data-startTime');
      let e = $(this).attr('data-endTime');
      $(i).val(s+','+e).change();
    } else {
      $(i).val('EMPTY').change();
    }
  });

  $('.chooseFlight').click(function(e){
    e.preventDefault();
    let id = $(this).attr('href');
    $(id).submit();
  })

  $('.toggleDetails').click(function(e){
    e.preventDefault();
    let id = $(this).attr('href');
    $(id).slideToggle();
  })

  $('#clearStop').click(function(e){
    $('#stops_list').val('EMPTY').change();
  })
  $('#clearAirline').click(function(e){
    $('#airline_list').val('EMPTY').change();
  })
  $('#clearDeparture').click(function(e){
    $('input[name="flight_time"]').each(function(){
      $(this).prop('checked', false);
    });
    $('#departure_time').val('EMPTY').change();
  })
  $('#clearDuration').click(function(e){
    let min_val_duration = $( "#slider-duration" ).attr('data-min');
    let max_val_duration = $( "#slider-duration" ).attr('data-max');
    load_travel();
    $('.selectfilter').change();
    var $slider = $("#slider-duration");
    $slider.slider({values: [ min_val_duration,max_val_duration ]});
  })
  $('#clearPrice').click(function(e){
    load_fare();
    $('.selectfilter').change();
    var $slider = $("#slider-range");
    $slider.slider({values: [ min_val,max_val ]});
  })
  $('#clearFilter').click(function(e){
    e.preventDefault();
    $('.clearBox').click();
  })

  // $("#airline_list option").each(function(e){
  //   var v = $(this).val();
  //   if( v == 'EMPTY' || v == '' ) {
  //     $(this).text('Airline Name');
  //   } else {
  //     let s = $('.flight-item'+data_attr( 'airline', v )).length;
  //     $(this).append(' ('+s+')');
  //   }
  // });

})