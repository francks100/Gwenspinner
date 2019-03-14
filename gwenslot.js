const SLOTS_PER_REEL = 12;
// radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) ); 
// current settings give a value of 149, rounded to 150
const REEL_RADIUS = 150;

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}


function createSlots (ring, posqs) {
	
	var slotAngle = 360 / SLOTS_PER_REEL;

	var seed = getSeed();
	

	for (var i = 0; i < SLOTS_PER_REEL; i ++) {
		var slot = document.createElement('div');
		
		slot.className = 'slot';

		// compute and assign the transform for this slot
		var transform = 'rotateX(' + (slotAngle * i) + 'deg) translateZ(' + REEL_RADIUS + 'px)';

		slot.style.transform = transform;

		// setup the number to show inside the slots
		// the position is randomized to 

//		var content = $(slot).append('<p>' + ((seed + i)%12)+ '</p>');
		
		var imagesInReel = 9;
		if (ring[0].id == "ring4") {
			imagesInReel = 10;
		}
		
	 
		var number = i+1;
		if (posqs != null && i == 0) {
			number = posqs;
		} else if (number > imagesInReel) {
			number = ((seed + i)%imagesInReel)+1;
		} 
		//var content = $(slot).append('<img src="images/jon' + number + '.png" width="75" height="75"  />');
	
		var content = $(slot).append('<img src="images/' + ring[0].id +'/' + number + '.png" width="75" height="75"  />');
		
		
		// add the poster to the row
		ring.append(slot);
	}
}

function getSeed() {
	// generate random number smaller than 13 then floor it to settle between 0 and 12 inclusive
	return Math.floor(Math.random()*(SLOTS_PER_REEL));
}

function spin(timer, spinid) {
	if (spinid ==undefined) {
	for(var i = 1; i < 7; i ++) {
		var oldSeed = -1;
		/*
		checking that the old seed from the previous iteration is not the same as the current iteration;
		if this happens then the reel will not spin at all
		*/
		var oldClass = $('#ring'+i).attr('class');
		if(oldClass.length > 4) {
			oldSeed = parseInt(oldClass.slice(10));
			
		}
		
					var seed = getSeed();
		while(oldSeed == seed) {
			seed = getSeed();
		}

		
		$('#ring'+i)
			.css('animation','back-spin 1s, spin-' + seed + ' ' + (timer + i*0.5) + 's')
			.attr('class','ring spin-' + seed);

		console.log('#ring'+i);
		console.log('animation,back-spin 1s, spin-' + seed + ' ' + (timer + i*0.5) + 's');

		}
	} else 
	{
	console.log(spinid);

		var oldSeed = -1;
		var oldClass = $('#'+spinid).attr('class');
		if(oldClass.length > 4) {
			oldSeed = parseInt(oldClass.slice(10));
			
		}
		
		var seed = getSeed();
		while(oldSeed == seed) {
			seed = getSeed();
			console.log('Seeds match!');
		}

		var ringindex = spinid.substring(4,6);
		
		$('#'+spinid)
			.css('animation','back-spin 1s, spin-' + seed + ' ' + (timer + ringindex*0.5) + 's')
			.attr('class','ring spin-' + seed);

	}

}

$(document).ready(function() {


	var query = window.location.search.substring(1);
	var qs = parse_query_string(query);
	console.log(qs);


	// initiate slots
	createSlots($('#ring1'),qs.r1);
 	createSlots($('#ring2'),qs.r2);
 	createSlots($('#ring3'),qs.r3);
 	createSlots($('#ring4'),qs.r4);
 	createSlots($('#ring5'),qs.r5);
	createSlots($('#ring6'),qs.r6);
	
 	// hook start button
 	$('.go').on('click',function(){
 		var timer = 2;
 		spin(timer);
 	})
	
	$('.ring').on('click',function(){
		console.log(this.id);
 		var timer = 2;
 		spin(timer, this.id);
 	})


 	// hook xray checkbox
 	$('#xray').on('click',function(){
 		//var isChecked = $('#xray:checked');
 		var tilt = 'tiltout';
 		
    if($(this).is(':checked')) {
 			tilt = 'tiltin';
 			$('.slot').addClass('backface-on');
 			$('#rotate').css('animation',tilt + ' 2s 1');

			setTimeout(function(){
			  $('#rotate').toggleClass('tilted');
			},2000);
 		} else {
      tilt = 'tiltout';
 			$('#rotate').css({'animation':tilt + ' 2s 1'});

			setTimeout(function(){
	 			$('#rotate').toggleClass('tilted');
	 			$('.slot').removeClass('backface-on');
	 		},1900);
 		}
 	})

 	// hook perspective
 	$('#perspective').on('click',function(){
 		$('#stage').toggleClass('perspective-on perspective-off');
 	})	
 });