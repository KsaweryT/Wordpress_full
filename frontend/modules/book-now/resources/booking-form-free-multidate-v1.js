/*****************************************************************************

*

*	copyright(c) - aonetheme.com - Service Finder Team

*	More Info: http://aonetheme.com/

*	Coder: Service Finder Team

*	Email: contact@aonetheme.com

*

******************************************************************************/

// When the browser is ready...

  jQuery(function() {

	'use strict';				  

  	

	var map = null;

	var marker = null;

	var provider_id = '';

	var scost = '';

	var sid = '';

	var totalservicecost = 0;

	var totalhours = 0;

	var date = '';
	
	var mysetdate = '';

	var oldzipcode = '';

	var oldregion = '';

	

	var daynumarr = [];

	var datearr = [];

	var bookedarr = [];
	
	var disabledates = [];

	var service_flag = 0;

	var servicearr = '';

	var member_flag = 1;

	var serviceslot = '';

	var singleservicehour = 0;
	var totalcost = 0;
	
	var unavl_type;
	var numberofdays;
	provider_id = jQuery('#provider').attr('data-provider');
	
	jQuery('body').on('change', '#servicedate-Modal select[name="members_list"]', function(){
		var memberid = jQuery(this).val();
		var avatarurl = jQuery('#servicedate-Modal select[name="members_list"] option:selected').data('avatar');
		if(avatarurl != "" && avatarurl != "undefined" && avatarurl != undefined){
			jQuery("#sf-bookingmember-image").show();	
			jQuery("#sf-bookingmember-image").html('<img src="'+avatarurl+'">');	
		}else{
			jQuery("#sf-bookingmember-image").hide();	
			jQuery("#sf-bookingmember-image").html('');
		}
	});
	
	/*Display Services*/
	jQuery('form.book-now').on('change', 'select[name="region"]', function(){

		var region = jQuery('select[name="region"]').val();

		if(region != ""){

			jQuery("#bookingservices").show();	

		}else{

			jQuery("#bookingservices").hide();	

		}

	});

	jQuery(document).on('click','.set-marker-popup-close',function(){

		jQuery('.set-marker-popup').hide();

	});															   

	jQuery(document).on('click','#viewmylocation',function(){

     jQuery('.set-marker-popup').show();

	 

	 var providerlat = jQuery(this).data('providerlat');

	 var providerlng = jQuery(this).data('providerlng');

  	 var zooml = jQuery(this).data('locationzoomlevel');

	 

	 if(zooml == ""){

		zooml = 14;	 

	 }

	 if(providerlat != "" && providerlng != ""){

	 initMap(providerlat,providerlng,zooml);

	 }else{

	 initMap(parseFloat(defaultlat),parseFloat(defaultlng),parseInt(defaultzoomlevel));	

	 }

	 

	 });

	function initMap(lat,lng,zoom) {

	var map = new google.maps.Map(document.getElementById('marker-map'), {

	  zoom: zoom,

	  center: {lat: lat, lng: lng}

	});

	

	marker = new google.maps.Marker({

	  map: map,

	  draggable: true,

	  animation: google.maps.Animation.DROP,

	  position: {lat: lat, lng: lng}

	});



	}

	function loadservicecalendar(){
		
		jQuery('.dow-clickable').removeClass("selected");
		service_finder_deleteCookie('setselecteddate');
		jQuery('.timeslots').html('');
		
		jQuery("#service-calendar").zabuto_calendar({

						today: true,

						show_previous: false,

						mode : 'add',

						daynum : daynumarr,

						datearr : datearr,

						bookedarr : bookedarr,
						
						show_next: disablemonths,
						
						disabledates : disabledates,

                        action: function () {
							
							jQuery('.alert').remove();
							
							jQuery('.dow-clickable').removeClass("selected");

							jQuery(this).addClass("selected");

							date = jQuery("#" + this.id).data("date");

							service_finder_setCookie('setselecteddate', date); 

							if(jQuery.inArray("availability", caps) > -1 && jQuery.inArray("staff-members", caps) > -1 && staffmember == 'yes'){

								return service_finder_timeslotCallback(this.id, provider_id, totalhours, sid, datearr, daynumarr, bookedarr);

							}else if(jQuery.inArray("availability", caps) > -1 && jQuery.inArray("staff-members", caps) > -1 && (staffmember == 'no' || staffmember == "")){

								return service_finder_timeslotCallback(this.id, provider_id, totalhours, sid, datearr, daynumarr, bookedarr);

							}else if(jQuery.inArray("availability", caps) > -1 && (jQuery.inArray("staff-members", caps) == -1 || (staffmember == 'no' || staffmember == ""))){

								return service_finder_timeslotCallback(this.id, provider_id, totalhours, sid, datearr, daynumarr, bookedarr);

							}else if(jQuery.inArray("availability", caps) == -1 && jQuery.inArray("staff-members", caps) > -1 && staffmember == 'yes'){

								return service_finder_memberCallback(this.id, provider_id);	

							}else if(jQuery.inArray("availability", caps) == -1 && (jQuery.inArray("staff-members", caps) == -1 || (staffmember == 'no' || staffmember == ""))){

								jQuery('#selecteddate').attr('data-seldate',date);

								jQuery('#selecteddate').val(date);

							}

                        },

                    });		

	}

	jQuery('#servicedate-Modal').on('click', 'input[name="nextstepbox"]', function(){
		jQuery(".alert-success,.alert-danger").remove();																				   
		var costtype = jQuery("#serbx-" + sid).data("costtype");
		var providerhours = jQuery("#serbx-" + sid).data('hours');
		var oldproviderhours = jQuery("#serbx-" + sid).attr('data-hours');
		
		if(costtype == 'hourly' || costtype == 'perperson'){
			singleservicehour = jQuery('#servicedate-Modal input[name="number_of_hours"]').val();	
			if(!oldproviderhours > 0 && (!singleservicehour > 0 || !jQuery.isNumeric(singleservicehour))){
				jQuery( "<div class='alert alert-danger'>"+param.valid_number+"</div>" ).insertBefore( "#memberslist" );
				return false;
			}
			jQuery('#servicedate-Modal input[name="providerhours"]').val(singleservicehour);
			if(singleservicehour > 0){
			jQuery("#serbx-" + sid).data("hours",singleservicehour);
			}
		}else if(!oldproviderhours > 0 && costtype == 'days'){
			var utype = jQuery('input[name="unavl_type"]:checked').val();
			var nod = jQuery('input[name="number_of_days"]').val();
			
			if(utype == "" || (!nod > 0 || !jQuery.isNumeric(nod))){
				jQuery( "<div class='alert alert-danger'>"+param.valid_number+"</div>" ).insertBefore( "#memberslist" );
				return false;	
			}
		}
		
		if(members_available == true){
		var memberid = jQuery('#servicedate-Modal select[name="members_list"]').val();		
		jQuery('#serbx-'+sid).data('memberid',memberid);
		
		//reset_calendar(memberid);
		}
		
		show_hide_stepbox('stepbox1','hide');
		show_hide_stepbox('stepbox2','show');
		
		afternextstep();
																						 
	});
	
	jQuery('#servicedate-Modal').on('click', 'input[name="backstepbox"]', function(){
		
		show_hide_stepbox('stepbox1','show');
		show_hide_stepbox('stepbox2','hide');
		//jQuery("#serbx-" + sid).data("hours",0);
																						 
	});
	
	function show_hide_stepbox(id,visibility){
		if(visibility == 'show'){
			jQuery('#'+id).show();	
			
			if(id == 'stepbox1'){
				jQuery('#servicedate-Modal .add-service-date').hide();
				jQuery('#servicedate-Modal input[name="nextstepbox"]').show();
				jQuery('#servicedate-Modal input[name="backstepbox"]').hide();
			}else if(id == 'stepbox2'){
				jQuery('#servicedate-Modal .add-service-date').show();
				jQuery('#servicedate-Modal input[name="nextstepbox"]').hide();
				jQuery('#servicedate-Modal input[name="backstepbox"]').show();
			}
		}else if(visibility == 'hide'){
			jQuery('#'+id).hide();
			
			if(id == 'stepbox1'){
				jQuery('#servicedate-Modal .add-service-date').show();
				jQuery('#servicedate-Modal input[name="backstepbox"]').show();
				jQuery('#servicedate-Modal input[name="nextstepbox"]').hide();
			}else if(id == 'stepbox2'){
				jQuery('#servicedate-Modal .add-service-date').hide();
				jQuery('#servicedate-Modal input[name="backstepbox"]').hide();
				jQuery('#servicedate-Modal input[name="nextstepbox"]').show();
			}
		}
	}
	
	function afternextstep(){
		jQuery('#servicedate-Modal').modal('show'); 

		jQuery("#servicedate-Modal .servicedate-error-bx").html('');

		loadservicecalendar();

		getservices();
	}
	
	function load_members_list(){
		var zipcode = jQuery('input[name="zipcode"]').val();
		var region = jQuery('select[name="region"]').val();
		var provider_id = jQuery('#provider').data('provider');
	
		var data = {
					  "action": "load_members_list",
					  "zipcode": zipcode,
					  "region": region,
					  "provider_id": provider_id,
					  "sid": sid,
					};

		var formdata = jQuery.param(data);

		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: formdata,
			dataType: "json",
			beforeSend: function() {
				jQuery('.loading-area').show();
			},
			success:function (data, textStatus) {
					jQuery('.loading-area').hide();
					if(data != null){
						if(data['status'] == 'success'){
							jQuery("#sf-bookingmember-image").hide();
							jQuery("#sf-bookingmember-image").html('');
							jQuery('select[name="members_list"]').html(data['members']);
							jQuery('.sf-select-box').selectpicker('refresh');
						}

					}
			}

		});		
	}

	/*Update booking price according to services selected*/

	jQuery('#bookingservices').on('click', '.aon-service-bx', function(){
		jQuery(".alert-success,.alert-danger").remove();
		
		var serviceid = jQuery(this).data('id');

		var costtype = jQuery(this).data('costtype');

		var providerhours = jQuery(this).data('hours');
		
		var oldhours = jQuery(this).attr('data-hours');
		
		oldhours = parseFloat(oldhours);

		sid = serviceid;
		show_hide_stepbox('stepbox1','hide');
		show_hide_stepbox('stepbox2','hide');
		

		if(jQuery('#serbx-'+sid).hasClass('selected')) { 

		jQuery('#servicedate-Modal input[name="serviceid"]').val(serviceid);

		jQuery('#servicedate-Modal input[name="costtype"]').val(costtype);
		
		if(members_available == true){
			
			var zipcode = jQuery('input[name="zipcode"]').val();
			var region = jQuery('select[name="region"]').val();
			
			if(booking_basedon == 'zipcode' && zipcode == ""){
				jQuery( "<div class='alert alert-danger'>"+param.insert_zipcode+"</div>" ).insertBefore( "form.book-now" );
				jQuery(this).removeClass('selected').addClass('unselected');
				jQuery("html, body").animate({
					scrollTop: jQuery(".alert-danger").offset().top
				}, 1000);
				return false;	
			}else if(booking_basedon == 'region' && region == ""){
				jQuery( "<div class='alert alert-danger'>"+param.select_region+"</div>" ).insertBefore( "form.book-now" );
				jQuery(this).removeClass('selected').addClass('unselected');
				jQuery("html, body").animate({
					scrollTop: jQuery(".alert-danger").offset().top
				}, 1000);
				return false;
			}
			
			jQuery('#memberslist').show();
			jQuery('#numberofdays').hide();
			jQuery('#numberofhours').hide();
		
			load_members_list();	
			show_hide_stepbox('stepbox1','show');
		}

		if(!oldhours > 0 && (costtype == "hourly" || costtype == "perperson")){

		show_hide_stepbox('stepbox1','show');
		jQuery('#numberofdays').hide();
		jQuery('#numberofhours').show();
		
		afternextstep();
		
		}else if(!oldhours > 0 && costtype == "days"){

		show_hide_stepbox('stepbox1','show');
		jQuery('#numberofdays').show();
		jQuery('#numberofhours').hide();
		
		afternextstep();
		
		}else{

		singleservicehour = providerhours;	

		jQuery('#servicedate-Modal input[name="providerhours"]').val(singleservicehour);
		if(singleservicehour > 0){
		jQuery("#serbx-" + sid).data("hours",singleservicehour);
		}

		if(members_available == false){
		show_hide_stepbox('stepbox2','show');
		
		if(oldhours > 0 || costtype == "fixed"){
		jQuery('#servicedate-Modal input[name="backstepbox"]').hide();
		}
		
		jQuery('#numberofhours').hide();
		jQuery('#numberofdays').hide();
		}
		
		afternextstep();

		}

		}else{ 

			if(providerhours > 0){

				jQuery('#hours-outer-bx-'+serviceid).hide();

				jQuery('#hours-'+serviceid).hide();	

				jQuery('#hours-'+serviceid).val('');

				jQuery('#hours-'+serviceid).removeAttr('readonly','readonly');	

			}else{

				jQuery('#hours-'+serviceid).closest('.bootstrap-touchspin').hide();

			}

			getservices(true);

		}

	});

	jQuery('#servicedate-Modal').on('hide.bs.modal', function() {
		
		var costtype = jQuery('#serbx-'+sid).data('costtype');
		if(costtype == 'days'){
			var datesval = jQuery('#servicedate-Modal input[name="dates"]').val();
			if(datesval == ''){
	
			jQuery('#serbx-'+sid).removeClass('selected');
	
			}
			
		}else{
		if(serviceslot == ''){

		jQuery('#serbx-'+sid).removeClass('selected');

		}
		}

	});

	jQuery('#servicedate-Modal').on('click', '.add-service-date', function(){

		jQuery('.alert').remove();

		var serviceid = jQuery('#servicedate-Modal input[name="serviceid"]').val();

		var costtype = jQuery('#servicedate-Modal input[name="costtype"]').val();

		var providerhours = jQuery('#servicedate-Modal input[name="providerhours"]').val();
		
		if(jQuery("#serbx-" + sid).data("date") == undefined){
			jQuery( "<div class='alert alert-danger'>"+param.booking_dates+"</div>" ).insertBefore( "#loadservicecalendar" );
			return false;	
		}
		
		if(costtype == 'days'){
			
			jQuery('#bookingslot-box').hide();
			jQuery("#servicedate-Modal .servicedate-error-bx").html('');	
			jQuery('#servicedate-Modal').modal('hide');
		}else{
		if(serviceslot == ''){

			jQuery( "<div class='alert alert-danger'>"+param.booking_dates+"</div>" ).insertBefore( "#loadservicecalendar" );

			return false;

		}else{

			jQuery("#servicedate-Modal .servicedate-error-bx").html('');	

			jQuery('#servicedate-Modal').modal('hide'); 

		}
		}

		

		if(jQuery('#serbx-'+sid).hasClass('selected') && (costtype == 'hourly' || costtype == 'perperson' || costtype == 'days')) { 

			if(providerhours > 0){

				//jQuery('#hours-outer-bx-'+serviceid).show();

				//jQuery('#hours-'+serviceid).show();

				jQuery('#hours-'+serviceid).val(providerhours);

				jQuery('#hours-'+serviceid).attr('readonly','readonly');	

			}

		}else{ 

			if(providerhours > 0){

				jQuery('#hours-outer-bx-'+serviceid).hide();

				jQuery('#hours-'+serviceid).hide();	

				jQuery('#hours-'+serviceid).val('');

				jQuery('#hours-'+serviceid).removeAttr('readonly','readonly');	

			}else{

				jQuery('#hours-'+serviceid).closest('.bootstrap-touchspin').hide();

			}

		}
		
		jQuery('#serbx-'+sid).data('serviceslot',serviceslot);

		getservices(true);

	});

	/*Save services to a variable*/
	function getservices($param = false){

		servicearr = '';

		service_flag = 0;	

		var servicehours = 0;

		jQuery("#bookingservices .aon-service-bx").each( function() {

			if(jQuery(this).hasClass('selected')) { 

			service_flag = 1;

				var costtype = jQuery(this).data('costtype');

				var serviceid = jQuery(this).data('id');
				
				var memberid = jQuery(this).data('memberid');
				
				var discount = jQuery('#serbx-'+serviceid).attr('data-discount');
				
				var couponcode = jQuery('#serbx-'+serviceid).attr('data-couponcode');

				var hours;

				if(costtype == 'fixed'){

					var hours = 0;
					var date = jQuery(this).data("date");
					var serviceslot = jQuery(this).data("serviceslot");
					
					reset_calendar(memberid);

					servicearr = addto_service_array(servicearr,serviceid,hours,date,serviceslot,memberid,couponcode,discount);

				}else if(costtype == 'hourly' || costtype == 'perperson'){

					var hours = jQuery(this).data('hours');
					var date = jQuery(this).data("date");
					var serviceslot = jQuery(this).data("serviceslot");
					
					reset_calendar(memberid);

					servicearr = addto_service_array(servicearr,serviceid,hours,date,serviceslot,memberid,couponcode,discount);

					servicehours = parseFloat(servicehours) + parseFloat(hours);

				}else if(costtype == 'days'){

					var dates = jQuery(this).data("date");
					
					reset_calendar(memberid,serviceid);

					servicearr = addto_service_array(servicearr,serviceid,'',dates,'',memberid,couponcode,discount);

					servicehours = parseFloat(servicehours) + parseFloat(hours);

				}

			}

        });

		jQuery('#servicearr').val(servicearr);

		date = '';

		serviceslot = '';

		jQuery("#service-calendar").html();

		totalhours = servicehours;

		if($param == true){
			calculate_servicecost();
		}
	}
	
	jQuery('body').on('click', '.addcouponcode', function(){
		jQuery('.alert').remove();
		jQuery('#addcouponcode input[name="couponcode"]').val('');
		
		var sid = jQuery(this).data('sid');														  
		jQuery('#addcouponcode,.sf-couponcode-popup-overlay').fadeIn("slow");
		jQuery('#addcouponcode input[name="couponcode"]').attr('id','couponcode-'+sid);
		jQuery('.verifycoupon').attr('data-sid',sid);
	})
	
	jQuery('body').on('click', '.verifycoupon', function(){
		jQuery('.alert').remove();
		var sid = jQuery(this).attr('data-sid');	
		var userid = jQuery(this).data('userid');
		var couponcode = jQuery('#couponcode-'+sid).val();
		var cost = jQuery('#serbx-'+sid).data('cost');
		var costtype = jQuery('#serbx-'+sid).data('costtype');
		var hours = jQuery('#serbx-'+sid).data('hours');
		
		if(couponcode == ""){
			jQuery( "<div class='alert alert-danger'>"+param.req+"</div>" ).insertAfter( "#addcouponcode" );	
			return false;
		}else{
			var data = {
					  "action": "verify_couponcode",
					  "serviceid": sid,
					  "userid": userid,
					  "couponcode": couponcode,
					  "cost": cost,
					  "costtype": costtype,
					  "hours": hours,
					};
					
			var formdata = jQuery.param(data);
			
			jQuery.ajax({

					type: 'POST',

					url: ajaxurl,
					
					beforeSend: function() {
						jQuery('.loading-area').show();
						jQuery('.alert').remove();
					},
					
					data: formdata,
					
					dataType: "json",

					success:function (data, textStatus) {
						
						jQuery('.loading-area').hide();
						if(data['status'] == 'success'){
							jQuery( "<div class='alert alert-success'>"+data['suc_message']+"</div>" ).insertAfter( "#addcouponcode" );	
							jQuery('#addcouponcode,.sf-couponcode-popup-overlay').fadeOut("slow");
							jQuery('#serbx-'+sid).attr('data-discounttype',data['discount_type']);
							jQuery('#serbx-'+sid).attr('data-discountvalue',data['discount_value']);
							jQuery('#serbx-'+sid).attr('data-coupon','verified');
							jQuery('#serbx-'+sid).attr('data-couponcode',couponcode);
							if(costtype == 'fixed'){
							jQuery('#serbx-'+sid+' .aon-service-price').html(data['discountedcost']);
							}
							calculate_servicecost();
						}else{
							jQuery( "<div class='alert alert-danger'>"+data['err_message']+"</div>" ).insertAfter( "#addcouponcode" );	
						}

						return false;
					}

				});		
		}
		return false;
	});
	
	function calculate_discount(coupon,discounttype,discountvalue,cost){
		var discount = 0; 
		if(coupon == 'verified'){
					
			if(discounttype == 'percentage'){
				discount = parseFloat(cost) * (parseFloat(discountvalue)/100);
			}else if(discounttype == 'fixed'){
				discount = parseFloat(discountvalue);	
			}
			
		}
		return discount.toFixed(2);
	}
	
	function calculate_discount_cost(discount,cost){
		
		if(parseFloat(cost) >= parseFloat(discount)){
		cost = parseFloat(cost) - parseFloat(discount);
		}
		
		return cost;
	}

	function calculate_servicecost(){

		var servicecost = 0;

		var servicehours = 0;

		service_flag = 0;

		servicearr = '';

		jQuery("#bookingservices .aon-service-bx").each( function() {

            if(jQuery(this).hasClass('selected')) { 

			service_flag = 1;

				var service = jQuery(this).val();

				var costtype = jQuery(this).data('costtype');

				var cost = jQuery(this).data('cost');

				var serviceid = jQuery(this).data('id');
				
				var discounttype = jQuery('#serbx-'+serviceid).attr('data-discounttype');
				var discountvalue = jQuery('#serbx-'+serviceid).attr('data-discountvalue');
				var coupon = jQuery('#serbx-'+serviceid).attr('data-coupon');
				var couponcode = jQuery('#serbx-'+serviceid).attr('data-couponcode');
				
				if(costtype == 'fixed'){

					var hours = 0;

					var discount = calculate_discount(coupon,discounttype,discountvalue,cost);	
					cost = calculate_discount_cost(discount,cost);
					
					servicecost = parseFloat(servicecost) + parseFloat(cost);
					jQuery('#serbx-'+serviceid).attr('data-discount',discount);

				}else if(costtype == 'hourly' || costtype == 'perperson' || costtype == 'days'){
					
					var $hourflag = jQuery(this).data('hours');
					

					if($hourflag > 0){

					var tcost = parseFloat(cost) * parseFloat($hourflag);	
					var discount = calculate_discount(coupon,discounttype,discountvalue,tcost);	
					cost = calculate_discount_cost(discount,tcost);
					servicecost = parseFloat(servicecost) + parseFloat(cost);
				
					}else{

					var discount = calculate_discount(coupon,discounttype,discountvalue,cost);	
					cost = calculate_discount_cost(discount,cost);
					servicecost = parseFloat(servicecost) + (parseFloat(cost));	

					}

					jQuery('#serbx-'+serviceid).attr('data-discount',discount);
					servicehours = parseFloat(servicehours) + parseFloat($hourflag);

				}

			}

			

        });

		//jQuery('#servicearr').val(servicearr);

		totalservicecost = servicecost;

		totalhours = servicehours;

		calculate_totalcost();

	}
	
	function addto_service_array(servicearr,serviceid = '',hours = '',date  = '',serviceslot  = '',memberid  = '',couponcode  = '',discount = 0){
		servicearr = servicearr + serviceid +'||'+ hours +'||'+ date +'||'+ serviceslot + '||'+ memberid + '||'+ discount + '||'+ couponcode + '%%';
		return servicearr;
	}

	function calculate_totalcost(){

		totalcost = parseFloat(mincost) + parseFloat(totalservicecost);

		totalcost = totalcost.toFixed(2);

		jQuery('#bookingamount').html(currencysymbol+totalcost);

		jQuery("#totalcost").val(totalcost);																			

	}

	
	/*Get Time Slots*/

	jQuery('ul.timelist').on('click', 'li', function(){
													 
		jQuery('.alert').remove();															 

		jQuery(this).addClass('active').siblings().removeClass('active');

		service_finder_resetMembers();

		var slot = jQuery(this).attr('data-source');

		serviceslot = jQuery(this).attr('data-source');
		
		var t = jQuery(this).find("span").html();

		jQuery("#boking-slot").attr('data-slot',t);

		jQuery("#boking-slot").val(slot);

		jQuery("#servicedate-Modal .servicedate-error-bx").html('');

	});	

	/*Step 1 Start*/
	jQuery('body').on('click', '#panel-1 button.edit', function(){

		

		jQuery(this).parent("h6").parent("div").find(".panel-summary").html('');

		jQuery("#panel-2").find(".f-row").addClass('hidden');

		jQuery("#panel-3").find(".f-row").addClass('hidden');

		jQuery("#panel-4").find(".f-row").addClass('hidden');

		jQuery("#panel-1 .f-row").removeClass('hidden');

		

		jQuery("#panel-2 h6").find("button.edit").remove();

		jQuery("#panel-3 h6").find("button.edit").remove();

		jQuery("#panel-4 h6").find("button.edit").remove();

		

	});

	/*Step 2 Start*/
	jQuery('body').on('click', '#panel-2 button.edit', function(){

		

		jQuery(this).parent("h6").parent("div").find(".panel-summary").html('');

		jQuery("#panel-1").find(".f-row").addClass('hidden');

		jQuery("#panel-3").find(".f-row").addClass('hidden');

		jQuery("#panel-4").find(".f-row").addClass('hidden');

		jQuery("#panel-2 .f-row").removeClass('hidden');

		

		jQuery("#panel-3 h6").find("button.edit").remove();

		jQuery("#panel-4 h6").find("button.edit").remove();

		

	});

	/*Step 3 Start*/
	jQuery('body').on('click', '#panel-3 button.edit', function(){

		

		jQuery(this).parent("h6").parent("div").find(".panel-summary").html('');

		jQuery("#panel-1").find(".f-row").addClass('hidden');

		jQuery("#panel-2").find(".f-row").addClass('hidden');

		jQuery("#panel-4").find(".f-row").addClass('hidden');

		jQuery("#panel-3 .f-row").removeClass('hidden');

		

		jQuery("#panel-4 h6").find("button.edit").remove();

		

	});

	/*Step 4 Start*/
	jQuery('body').on('click', '#panel-4 button.edit', function(){

		

		jQuery(this).parent("h6").parent("div").find(".panel-summary").html('');

		jQuery("#panel-1").find(".f-row").addClass('hidden');

		jQuery("#panel-2").find(".f-row").addClass('hidden');

		jQuery("#panel-3").find(".f-row").addClass('hidden');

		jQuery("#panel-4 .f-row").removeClass('hidden');

		

	});

	/*Gallery*/

			jQuery('.gallery-thums').on('click', 'div.item a', function(){

				jQuery('.loading-cover').show();

				var src = jQuery(this).attr('data-src');	 

				jQuery('.galley-details').find('.item a img').load(function() {

				  jQuery('.loading-cover').hide();

				}).attr('src',src);

			});

			

	/*Add to Favorite*/

	jQuery('body').on('click', '.add-favorite', function(){



				var providerid = jQuery(this).attr('data-proid');

				var userid = jQuery(this).attr('data-userid');

				var data = {

						  "action": "addtofavorite",

						  "userid": userid,

						  "providerid": providerid

						};

						

				var formdata = jQuery.param(data);

				

				jQuery.ajax({



						type: 'POST',



						url: ajaxurl,

						

						beforeSend: function() {

							jQuery('.loading-area').show();

						},

						

						data: formdata,

						

						dataType: "json",



						success:function (data, textStatus) {

							

							jQuery('.loading-area').hide();

							if(data['status'] == 'success'){

								

								jQuery( '<a href="javascript:;" class="remove-favorite" data-proid="'+providerid+'" data-userid="'+userid+'"><i class="fa fa-heart"></i>'+param.my_fav+'</a>' ).insertBefore( ".add-favorite" );

								jQuery('.add-favorite').remove();



							}



							

						}



					});																

	});

	

	/*Remove from Favorite*/

	jQuery('body').on('click', '.remove-favorite', function(){



				var providerid = jQuery(this).attr('data-proid');

				var userid = jQuery(this).attr('data-userid');

				var data = {

						  "action": "removefromfavorite",

						  "userid": userid,

						  "providerid": providerid

						};

						

				var formdata = jQuery.param(data);

				

				jQuery.ajax({



						type: 'POST',



						url: ajaxurl,

						

						beforeSend: function() {

							jQuery('.loading-area').show();

						},

						

						data: formdata,

						

						dataType: "json",



						success:function (data, textStatus) {

							

							jQuery('.loading-area').hide();

							if(data['status'] == 'success'){

								

								jQuery( '<a href="javascript:;" class="add-favorite" data-proid="'+providerid+'" data-userid="'+userid+'"><i class="fa fa-heart"></i>'+param.add_to_fav+'</a>' ).insertBefore( ".remove-favorite" );

								jQuery('.remove-favorite').remove();



							}



							

						}



					});																

	});

	//reset_calendar();
	function reset_calendar(memberid = '',serviceid = 0){
	provider_id = jQuery('#provider').attr('data-provider');
	
	jQuery("#loadservicecalendar").html('<div id="service-calendar"></div>');

	var data = {

				  "action": "reset_bookingcalendar",

				  "provider_id": provider_id,
				  
				  "member_id": memberid,
				  
				  "serviceid": serviceid

				};

	var formdata = jQuery.param(data);
	jQuery.ajax({



				type: 'POST',



				url: ajaxurl,

				

				dataType: "json",

				

				beforeSend: function() {

					jQuery('.loading-area').show();

				},

				

				data: formdata,



				success:function (data, textStatus) {

					jQuery('.loading-area').hide();

					if(data['status'] == 'success'){

					daynumarr = jQuery.parseJSON(data['daynum']);

					datearr = jQuery.parseJSON(data['dates']);

					bookedarr = jQuery.parseJSON(data['bookeddates']);
					
					disabledates = jQuery.parseJSON(data['disabledates']);

					service_finder_deleteCookie('setselecteddate');
					
					jQuery("#loadservicecalendar").html('<div id="service-calendar"></div>');

					jQuery("#service-calendar").zabuto_calendar({

						today: true,

						show_previous: false,

						mode : 'add',

						daynum : daynumarr,

						datearr : datearr,

						bookedarr : bookedarr,
						
						show_next: disablemonths,
						
						disabledates : disabledates,

                        action: function () {
							
							jQuery('.alert').remove();
							
							jQuery('.dow-clickable').removeClass("selected");

							jQuery(this).addClass("selected");

							date = jQuery("#" + this.id).data("date");

							service_finder_setCookie('setselecteddate', date); 

							

							if(jQuery.inArray("availability", caps) > -1 && jQuery.inArray("staff-members", caps) > -1 && staffmember == 'yes'){

								return service_finder_timeslotCallback(this.id, provider_id, totalhours, sid, datearr, daynumarr, bookedarr);

							}else if(jQuery.inArray("availability", caps) > -1 && jQuery.inArray("staff-members", caps) > -1 && (staffmember == 'no' || staffmember == "")){

								return service_finder_timeslotCallback(this.id, provider_id, totalhours, sid, datearr, daynumarr, bookedarr);

							}else if(jQuery.inArray("availability", caps) > -1 && (jQuery.inArray("staff-members", caps) == -1 || (staffmember == 'no' || staffmember == ""))){

								return service_finder_timeslotCallback(this.id, provider_id, totalhours, sid, datearr, daynumarr, bookedarr);

							}else if(jQuery.inArray("availability", caps) == -1 && jQuery.inArray("staff-members", caps) > -1 && staffmember == 'yes'){

								return service_finder_memberCallback(this.id, provider_id);	

							}else if(jQuery.inArray("availability", caps) == -1 && (jQuery.inArray("staff-members", caps) == -1 || (staffmember == 'no' || staffmember == ""))){

								jQuery('#selecteddate').attr('data-seldate',date);	

							}

                        },

                    });

					

					}else if(data['status'] == 'error'){

					}

					

					

				

				}



			});	
	}

	

	

	

	/*Booknow wizard continue action*/

	jQuery('.book-now')

        .bootstrapValidator({

            message: param.not_valid,

            feedbackIcons: {

                valid: 'glyphicon glyphicon-ok',

                invalid: 'glyphicon glyphicon-remove',

                validating: 'glyphicon glyphicon-refresh'

            },

            fields: {

				zipcode: {

					validators: {

						notEmpty: {

							message: param.postal_code

						}

					}

				},

				region: {

					validators: {

						notEmpty: {

							message: param.region

						}

					}

				},

				'service[]': {

					validators: {

						choice: {

							min: 1,

							max: 100,

							message: param.select_service

						}

					}

				},

            }

        })

		.on('error.field.bv', function(e, data) {

            data.bv.disableSubmitButtons(false); // disable submit buttons on errors

	    })

		.on('status.field.bv', function(e, data) {

            data.bv.disableSubmitButtons(false); // disable submit buttons on valid

        })

		.on('click', '.otp', function() {

				

				var emailid = jQuery("#email").val();
				jQuery(".alert-danger").remove();
				if(emailid == ''){
					jQuery( '<div class="alert alert-danger">'+param.email_req+'</div>' ).insertAfter( ".otp-section .input-group" );
					return false;
				}
				var data = {

						  "action": "sendotp",

						  "emailid": emailid,

						};

						

				var formdata = jQuery.param(data);

				

				jQuery.ajax({



						type: 'POST',



						url: ajaxurl,

						

						beforeSend: function() {

							jQuery('.loading-area').show();

						},

						

						data: formdata,



						success:function (data, textStatus) {

							service_finder_clearconsole();

							jQuery('.loading-area').hide();

							jQuery( '<div class="alert alert-success padding-5 otpsuccess">'+param.otp_mail+'</div>' ).insertAfter( ".otp-section .input-group" );

							service_finder_setCookie('otppass', data); 

							service_finder_setCookie('vaildemail',emailid);

							jQuery(".otp").remove();

							

											jQuery('.book-now')

											.bootstrapValidator('addField', 'fillotp', {

												validators: {

															notEmpty: {

																message: param.otp_pass

															},

															callback: {

																message: param.otp_right,

																callback: function(value, validator, $field) {

																	if(service_finder_getCookie('otppass') == value){

																	return true;

																	}else{

																	return false;	

																	}

																}

															}

														}

											})

											.bootstrapValidator('addField', 'email', {

												validators: {

															emailAddress: {

																message: param.signup_user_email

															},

															callback: {

																message: param.reconfirm_email,

																callback: function(value, validator, $field) {

																	if(service_finder_getCookie('vaildemail') == value){

																	return true;

																	}else{

																	jQuery(".otp").remove();

																	jQuery(".otpsuccess").remove();	

																	jQuery( '<a href="javascript:;" class="otp">'+param.gen_otp+'</a>' ).insertAfter( ".otp-section .input-group" );

																	

																	return false;	

																	}

																}

															}

														}

											});

						}



					});					  

		})

		.on('click', '#save-zipcodes', function() {
						jQuery('.book-now').bootstrapValidator('validate');

						var zipcode = jQuery('input[name="zipcode"]').val();

						var region = jQuery('select[name="region"]').val();

						if(booking_basedon == 'zipcode'){

							if(zipcode != ""){	

							var data = {

								  "action": "check_zipcode",

								  "zipcode": zipcode,

								  "provider_id": provider_id,

								};

							var formdata = jQuery.param(data);

							  

							jQuery.ajax({

				

								type: 'POST',

				

								url: ajaxurl,

				

								data: formdata,

								

								dataType: "json",

								

								beforeSend: function() {

									jQuery('.loading-area').show();

								},

				

								success:function (data, textStatus) {

									jQuery('.loading-area').hide();

									jQuery("#panel-1").find(".alert").remove();

									if(data['status'] == 'success' && ((service_flag == 1 || checkjobauthor == 1 || checkquoteauthor == 1) || booking_charge_on_service == 'no')){

										jQuery("#panel-1 .f-row").addClass('hidden');

										jQuery("#panel-1").find(".panel-summary").html(zipcode);

										jQuery("#panel-1 h6").append('<button class="btn btn-border btn-xs edit"><i class="fa fa-pencil"></i>'+param.edit_text+'</button>');

										jQuery("#panel-3 .f-row").removeClass('hidden');

										jQuery("#panel-3").find(".panel-summary").html('');

										if(oldzipcode != zipcode){

											

										

										jQuery("#panel-3").find(".panel-summary").html('');

										

										jQuery('.timeslots').html('');

										jQuery('#members').html('');

										

										jQuery('#boking-slot').val('');

										jQuery('#memberid').val('');

										jQuery('#selecteddate').val('');

										}

										

										oldzipcode = zipcode;

										

										jQuery('.book-now')

										.bootstrapValidator('addField', 'firstname', {

											validators: {

												notEmpty: {

													message: param.signup_first_name

												}

											}

										})

										.bootstrapValidator('addField', 'lastname', {

											validators: {

												notEmpty: {

													message: param.signup_last_name

												}

											}

										})

										.bootstrapValidator('addField', 'email', {

											validators: {

												notEmpty: {

														message: param.req

													},

												emailAddress: {

													message: param.signup_user_email

												}

											}

										})

										.bootstrapValidator('addField', 'fillotp', {

											validators: {

												notEmpty: {

														message: param.req

													},

												callback: {

																message: 'Please insert correct otp',

																callback: function(value, validator, $field) {

																	if(service_finder_getCookie('otppass') == value && service_finder_getCookie('otppass') != ""){

																	return true;

																	}else{

																	return false;	

																	}

																}

															}

											}

										})

										.bootstrapValidator('addField', 'phone', {

											validators: {

												notEmpty: {

														message: param.req

													},

                   								digits: {message: param.only_digits},

											}

										})

										.bootstrapValidator('addField', 'address', {

											validators: {

												notEmpty: {

													message: param.signup_address

												}

											}

										})

										.bootstrapValidator('addField', 'city', {

											validators: {

												notEmpty: {

													message: param.city

												}

											}

										})

										.bootstrapValidator('addField', 'country', {

											validators: {

												notEmpty: {

													message: param.signup_country

												}

											}

										});

									}else{

										jQuery(".f-row").addClass('hidden');

										jQuery("#panel-1 .f-row").removeClass('hidden');

										jQuery(".panel-summary").html('');

										jQuery("button.edit").remove();

										if(checkquoteauthor == 1 || checkjobauthor == 1 || booking_charge_on_service == 'no'){

										jQuery("#panel-1").find('.form-step-bx').append('<div class="col-md-12 clearfix"><div class="alert alert-danger">'+param.service_not_avl+'</div></div>');

										}else{

										jQuery("#panel-1").find('.form-step-bx').append('<div class="col-md-12 clearfix"><div class="alert alert-danger">'+param.notavl_select_service+'</div></div>');	

										}

									}

								}

				

							});	

						}

						}else if(booking_basedon == 'region'){

								

									jQuery("#panel-1").find(".alert").remove();

									if(region != "" && ((service_flag == 1 || checkjobauthor == 1 || checkquoteauthor == 1) || booking_charge_on_service == 'no')){

										jQuery("#panel-1 .f-row").addClass('hidden');

										jQuery("#panel-1").find(".panel-summary").html(region);

										jQuery("#panel-1 h6").append('<button class="btn btn-border btn-xs edit"><i class="fa fa-pencil"></i>EDIT</button>');

										jQuery("#panel-3 .f-row").removeClass('hidden');

										jQuery("#panel-3").find(".panel-summary").html('');

										if(oldregion != region){

											

										

										jQuery("#panel-3").find(".panel-summary").html('');

										

										jQuery('.timeslots').html('');

										jQuery('#members').html('');

										

										jQuery('#boking-slot').val('');

										jQuery('#memberid').val('');

										jQuery('#selecteddate').val('');

										}

										

										oldregion = region;

										

										jQuery('.book-now')

										.bootstrapValidator('addField', 'firstname', {

											validators: {

												notEmpty: {

													message: param.signup_first_name

												}

											}

										})

										.bootstrapValidator('addField', 'lastname', {

											validators: {

												notEmpty: {

													message: param.signup_last_name

												}

											}

										})

										.bootstrapValidator('addField', 'email', {

											validators: {

												notEmpty: {

														message: param.req

													},

												emailAddress: {

													message: param.signup_user_email

												}

											}

										})

										.bootstrapValidator('addField', 'fillotp', {

											validators: {

												notEmpty: {

														message: param.req

													},

												callback: {

																message: param.otp_right,

																callback: function(value, validator, $field) {

																	if(service_finder_getCookie('otppass') == value && service_finder_getCookie('otppass') != ""){

																	return true;

																	}else{

																	return false;	

																	}

																}

															}

											}

										})

										.bootstrapValidator('addField', 'phone', {

											validators: {

												notEmpty: {

														message: param.req

													},

                   								digits: {message: param.only_digits},

											}

										})

										.bootstrapValidator('addField', 'address', {

											validators: {

												notEmpty: {

													message: param.signup_address

												}

											}

										})

										.bootstrapValidator('addField', 'city', {

											validators: {

												notEmpty: {

													message: param.city

												}

											}

										})

										.bootstrapValidator('addField', 'country', {

											validators: {

												notEmpty: {

													message: param.signup_country

												}

											}

										});

									}else{

										jQuery(".f-row").addClass('hidden');

										jQuery("#panel-1 .f-row").removeClass('hidden');

										jQuery(".panel-summary").html('');

										jQuery("button.edit").remove();

										if(checkquoteauthor == 1 || checkjobauthor == 1 || booking_charge_on_service == 'no'){

										jQuery("#panel-1").find('.form-step-bx').append('<div class="col-md-12 clearfix"><div class="alert alert-danger">'+param.region+'</div></div>');

										}else{

										jQuery("#panel-1").find('.form-step-bx').append('<div class="col-md-12 clearfix"><div class="alert alert-danger">'+param.region_and_service+'</div></div>');			

										}

									}

									

						}else if(booking_basedon == 'open'){

						jQuery('.loading-area').hide();

						jQuery("#panel-1").find(".alert").remove();

						if(((service_flag == 1 || checkjobauthor == 1 || checkquoteauthor == 1) || booking_charge_on_service == 'no')){

							jQuery("#panel-1 .f-row").addClass('hidden');

							jQuery("#panel-1").find(".panel-summary").html(zipcode);

							jQuery("#panel-1 h6").append('<button class="btn btn-border btn-xs edit"><i class="fa fa-pencil"></i>EDIT</button>');

							jQuery("#panel-3 .f-row").removeClass('hidden');

							jQuery("#panel-3").find(".panel-summary").html('');

							if(oldzipcode != zipcode){

								

							

							

							jQuery("#panel-3").find(".panel-summary").html('');

							jQuery("#panel-4").find(".panel-summary").html('');

							

							jQuery('.timeslots').html('');

							jQuery('#members').html('');

							

							jQuery('#boking-slot').val('');

							jQuery('#memberid').val('');

							jQuery('#selecteddate').val('');

							}

							

							oldzipcode = zipcode;

							

							jQuery('.book-now')

							.bootstrapValidator('addField', 'firstname', {

								validators: {

									notEmpty: {

										message: param.signup_first_name

									}

								}

							})

							.bootstrapValidator('addField', 'lastname', {

								validators: {

									notEmpty: {

										message: param.signup_last_name

									}

								}

							})

							.bootstrapValidator('addField', 'email', {

								validators: {

									notEmpty: {

											message: param.req

										},

									emailAddress: {

										message: param.signup_user_email

									}

								}

							})

							.bootstrapValidator('addField', 'fillotp', {

								validators: {

									notEmpty: {

											message: param.req

										},

									callback: {

													message: param.otp_right,

													callback: function(value, validator, $field) {

														if(service_finder_getCookie('otppass') == value && service_finder_getCookie('otppass') != ""){

														return true;

														}else{

														return false;	

														}

													}

												}

								}

							})

							.bootstrapValidator('addField', 'phone', {

								validators: {

									notEmpty: {

											message: param.req

										},

									digits: {message: param.only_digits},

								}

							})

							.bootstrapValidator('addField', 'address', {

								validators: {

									notEmpty: {

										message: param.signup_address

									}

								}

							})

							.bootstrapValidator('addField', 'city', {

								validators: {

									notEmpty: {

										message: param.city

									}

								}

							})

							.bootstrapValidator('addField', 'country', {

								validators: {

									notEmpty: {

										message: param.signup_country

									}

								}

							})

							.bootstrapValidator('addField', 'bookingpayment_mode', {

								validators: {

									notEmpty: {

										message: param.select_payment

									}

								}

							});

							

						}else{

							jQuery(".f-row").addClass('hidden');

							jQuery("#panel-1 .f-row").removeClass('hidden');

							jQuery(".panel-summary").html('');

							jQuery("button.edit").remove();

							if(checkquoteauthor == 1 || checkjobauthor == 1 || booking_charge_on_service == 'no'){

							jQuery("#panel-1").find('.form-step-bx').append('<div class="col-md-12 clearfix"><div class="alert alert-danger">'+param.service_not_avl+'</div></div>');

							}else{

							jQuery("#panel-1").find('.form-step-bx').append('<div class="col-md-12 clearfix"><div class="alert alert-danger">'+param.notavl_select_service+'</div></div>');	

							}

						}

						}

		})

		.on('click', '#save-cusinfo', function() {

						var $validator = jQuery('.book-now').data('bootstrapValidator').validate();

						jQuery("#panel-4").find(".panel-summary").html('');

						

						var firstname = jQuery('input[name="firstname"]').val();

						var lastname = jQuery('input[name="lastname"]').val();

						var email = jQuery('input[name="email"]').val();

						var fillotp = jQuery('input[name="fillotp"]').val();

						var phone = jQuery('input[name="phone"]').val();

						var address = jQuery('input[name="address"]').val();

						var city = jQuery('input[name="city"]').val();

						var state = jQuery('input[name="state"]').val();

						var country = jQuery('input[name="country"]').val();



											if($validator.isValid()){		

												if(offersystem == true && offermethod == 'booking'){
								
								bootbox.dialog({
									title: "",
									message: '<div class="viewcoupon-bx">' +
										'<button class="btn btn-primary btn-sm" data-toggle="collapse" data-target="#addwoobookingcoupon"><i class="fa fa-arrow-circle-down"></i> '+param.have_coupon+'</button> ' +
										'<div id="addwoobookingcoupon" class="collapse">' +
										'<input type="text" name="woocouponcode" id="woocouponcode" class="form-control sf-form-control">' +
										'<a href="javascropt:;" class="verifywoobookingcoupon btn btn-custom">'+param.verify+'</a>' +
										'</div> ' +
										'</div> ',
									buttons: {
										success: {
											label: "Continue",
											className: "btn-primary",
											callback: function () {
												goto_freecheckout();
											}
										}
									}
								})
								.on('shown.bs.modal',function () {
									jQuery('body').on('click', '.verifywoobookingcoupon', function(){
									jQuery('.alert').remove();
									var couponcode = jQuery('#woocouponcode').val();
									
									if(couponcode == ""){
										jQuery( "<div class='alert alert-danger'>"+param.req+"</div>" ).insertAfter( "#addwoobookingcoupon" );	
										return false;
									}else{
										var data = {
												  "action": "verify_booking_couponcode",
												  "userid": provider_id,
												  "couponcode": couponcode,
												  "totalcost": totalcost,
												};
												
										var formdata = jQuery.param(data);
										
										jQuery.ajax({
							
												type: 'POST',
							
												url: ajaxurl,
												
												beforeSend: function() {
													jQuery('.loading-area').show();
													jQuery('.alert').remove();
												},
												
												data: formdata,
												
												dataType: "json",
							
												success:function (data, textStatus) {
													
													jQuery('.loading-area').hide();
													if(data['status'] == 'success'){
														jQuery( "<div class='alert alert-success'>"+data['suc_message']+"</div>" ).insertAfter( "#addwoobookingcoupon" );	
														var updatedtotalcost = data['updatedtotalcost'];
														totaldiscount = data['discount'];
														jQuery('#totaldiscount').val(totaldiscount);
														jQuery('#couponcode').val(couponcode);
														calculate_commisionfee(updatedtotalcost,'discount');
														
													}else{
														jQuery( "<div class='alert alert-danger'>"+data['err_message']+"</div>" ).insertAfter( "#addwoobookingcoupon" );	
													}
							
													return false;
												}
							
											});		
									}
									return false;
								});							   
								});	
							
							}else{
													goto_freecheckout();	
												}
											}else{

												return false;	

											}

		})

     	.on('success.form.bv', function(form) {

            // Prevent form submission

	        form.preventDefault();

		});



	function goto_freecheckout(){
	var data = {
	  "action": "freecheckout",
	  "provider": provider_id,
	  "totalcost": totalcost,
	  "bookingdate": date,
	};
	
	var formdata = jQuery('form.book-now').serialize() + "&" + jQuery.param(data);
	
	jQuery.ajax({

			type: 'POST',

			url: ajaxurl,
			
			dataType: "json",
			
			beforeSend: function() {
			jQuery('.loading-area').show();
			},
			
			data: formdata,

			success:function (data, textStatus) {
				jQuery('.loading-area').hide();
				jQuery('.alert').remove();
				jQuery('form.book-now').find('input[type="submit"]').prop('disabled', false);
				if(data['status'] == 'success'){
					jQuery( "<div class='alert alert-success'>"+data['suc_message']+"</div>" ).insertBefore( "form.book-now" );	
					jQuery( "#save-cusinfo" ).attr( "disabled","disabled" );
					jQuery("html, body").animate({
						scrollTop: jQuery(".alert-success").offset().top
					}, 1000);
					if(data['redirecturl'] != ''){
					window.location = data['redirecturl'];	
					}else{
					jQuery("#panel-3 .tab-pane-inr").html('<h3>'+param.booking_suc+'</h3>');
					}
					
							
				}else if(data['status'] == 'error'){
					jQuery( "<div class='alert alert-danger'>"+data['err_message']+"</div>" ).insertBefore( "form.book-now" );
					jQuery("html, body").animate({
						scrollTop: jQuery(".alert-danger").offset().top
					}, 1000);
				}
				
			}

		});		  
  }
  
  function service_finder_get_bookingdays(id,unavl_type,numberofdays,date,paramsid,datearr = '',daynumarr = '',bookedarr = '') {
	   
	  var data = {
			  "action": "get_bookingdays",
			  "unavl_type": unavl_type,
			  "numberofdays": numberofdays,
			  "startdate": date,
			  "datearr": datearr,
			  "daynumarr": daynumarr,
			  "bookedarr": bookedarr,
			  "provider_id": provider_id,
			  "service_id": paramsid,
			};
		var formdata = jQuery.param(data);
		  
		jQuery.ajax({

			type: 'POST',

			url: ajaxurl,

			data: formdata,
			
			dataType: "json",
			
			beforeSend: function() {
				jQuery('.loading-area').show();
				jQuery(".alert-success,.alert-danger").remove();
			},

			success:function (data, textStatus) {
				jQuery('.dow-clickable').removeClass("selected");
				if(data['status'] == 'success'){
				singleservicehour = data['bookingdates'].length;
				
				jQuery('#servicedate-Modal input[name="providerhours"]').val(singleservicehour);
				if(singleservicehour > 0){
				jQuery("#serbx-" + paramsid).data("hours",singleservicehour);
				}
				var dates = '';
				
				for (var key in data['bookingdates']) {
				if (data['bookingdates'].hasOwnProperty(key)) {
					dates = dates + data['bookingdates'][key] + '##';
					var sdate = id.replace(date, data['bookingdates'][key]);
					jQuery("#" + sdate).addClass("selected");
				}
				}
				jQuery('#servicedate-Modal input[name="dates"]').val(dates);
				jQuery("#serbx-" + paramsid).data("date",dates);
				jQuery('.loading-area').hide();	
				}else if(data['status'] == 'error'){
					jQuery('.loading-area').hide();	
					jQuery( "<div class='alert alert-danger'>"+data['err_message']+"</div>" ).insertBefore( "#loadservicecalendar" );
				}
				
			}

		}); 
   }

  /*Timeslot callback function*/

  function service_finder_timeslotCallback(id, provider_id, totalhours, paramsid = '', datearr = '', daynumarr = '', bookedarr = '') {

	  	service_finder_resetMembers();

		var date = jQuery("#" + id).data("date");
		var unavl_type = jQuery('input[name="unavl_type"]:checked').val();
		var numberofdays = jQuery('input[name="number_of_days"]').val();
		
		var costtype = jQuery("#serbx-" + paramsid).data("costtype");
		var days = jQuery("#serbx-" + paramsid).data("hours");
		var cost = jQuery("#serbx-" + paramsid).data("cost");
		var memberid = jQuery("#serbx-" + paramsid).data("memberid");

		if(costtype == 'days'){
		if(days > 0){
			service_finder_get_bookingdays(id,'days',days,date,paramsid,datearr,daynumarr,bookedarr);
		}else{
			service_finder_get_bookingdays(id,unavl_type,numberofdays,date,paramsid,datearr,daynumarr,bookedarr);
		}
		
		}else{
		jQuery('#selecteddate').attr('data-seldate',date);
		jQuery("#serbx-" + paramsid).data("date",date);
		
		var data = {

			  "action": "get_bookingtimeslot",

			  "seldate": date,

			  "provider_id": provider_id,
			  
			  "member_id": memberid,

			  "totalhours": days,
			  
			  "serviceid": paramsid,

			};

		var formdata = jQuery.param(data);

		  

		jQuery.ajax({



			type: 'POST',



			url: ajaxurl,



			data: formdata,

			

			beforeSend: function() {

				jQuery('.loading-area').show();

			},



			success:function (data, textStatus) {

				jQuery('.loading-area').hide();

				jQuery('.timeslots').html(data);

				jQuery("#panel-3 h6").remove('button.edit');

				jQuery("#panel-4 h6").remove('button.edit');

			}



		});

		}
		return true;

	}

	/*Member callback function*/

	function service_finder_memberCallback(id, provider_id) {

	  	service_finder_resetMembers();

		var zipcode = jQuery('input[name="zipcode"]').val();

		var region = jQuery('select[name="region"]').val();

		var provider_id = jQuery('#provider').attr('data-provider');

		var date = jQuery("#" + id).data("date");

		region = Encoder.htmlEncode(region);

		var data = {

			  "action": "load_members",

			  "zipcode": zipcode,

			  "region": region,

			  "provider_id": provider_id,

			  "date": date,

			};

		var formdata = jQuery.param(data);

		  

		jQuery.ajax({



			type: 'POST',



			url: ajaxurl,



			data: formdata,

			

			dataType: "json",

			

			beforeSend: function() {

				jQuery('.loading-area').show();

			},



			success:function (data, textStatus) {

							jQuery('.loading-area').hide();

							jQuery("#panel-2").find(".alert").remove();

							 if(data != null){

								if(data['status'] == 'success'){

									jQuery("#panel-2").find("#members").html(data['members']);

									jQuery("#panel-2").find("#members").append('<div class="col-lg-12"><div class="row"><div class="checkbox text-left"><input id="anymember" class="anymember" type="checkbox" name="anymember[]" value="yes" checked><label for="anymember">'+param.anyone+'</label></div></div></div>');

									jQuery('.display-ratings').rating();

									jQuery('.sf-show-rating').show();

								}

							}

					}



		});	



		  return true;

	}	

	/*Reset member function*/

	function service_finder_resetMembers(){

		jQuery("#panel-2").find("#members").html('');

		jQuery("#memberid").val('');	

	}

	

  });
  
  