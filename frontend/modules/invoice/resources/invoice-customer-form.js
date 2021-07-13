/*****************************************************************************
*
*	copyright(c) - aonetheme.com - Service Finder Team
*	More Info: http://aonetheme.com/
*	Coder: Service Finder Team
*	Email: contact@aonetheme.com
*
******************************************************************************/
	var dataTable = '';
	//Close Invoice details
	jQuery('body').on('click', '.closeInvoiceDetails', function(){
		dataTable.draw();																
		jQuery('#invoice-details').addClass('hidden fade in');
		jQuery('#invoice-grid_wrapper').removeClass('hidden');
	});


// When the browser is ready...
  jQuery(function() {
	'use strict';
	//alert(twocheckoutpublishkey);
	var month_flag = 1;
	var year_flag = 1;
	var provider_id = '';
	var twocheckoutpublishkey;
	var twocheckoutmode;
	var twocheckoutaccountid;
			  
	var bookingid = jQuery('#invoice-grid').attr('data-bookingid');
	
	//Display Invoice in Data Table
	dataTable = jQuery('#invoice-grid').DataTable( {
	"serverSide": true,
	"order": [[ 3, "desc" ]],
	"bAutoWidth": false,
	"columnDefs": [ {
		  "targets": 0,
		  "orderable": false,
		  "searchable": false
		   
		} ],
	"processing": true,
	"language": {
					"processing": "<div></div><div></div><div></div><div></div><div></div>",
					"emptyTable":     param.empty_table,
					"search":         param.dt_search+":",
					"lengthMenu":     param.dt_show + " _MENU_ " + param.dt_entries,
					"info":           param.dt_showing + " _START_ " + param.dt_to + " _END_ " + param.dt_of + " _TOTAL_ " + param.dt_entries,
					"infoEmpty":      param.dt_showing + " _START_ " + param.dt_to + " _END_ " + param.dt_of + " _TOTAL_ " + param.dt_entries,
					"paginate": {
						first:      param.dt_first,
						previous:   param.dt_previous,
						next:       param.dt_next,
						last:       param.dt_last,
					},
				},
	"ajax":{
		url :ajaxurl, // json datasource
		type: "post",  // method  , by default get
		data: {"action": "get_customer_invoice","bookingid": bookingid},
		error: function(){  // error handling
			jQuery(".invoice-grid-error").html("");
			jQuery("#invoice-grid").append('<tbody class="invoice-grid-error"><tr><th colspan="3">'+param.no_data+'</th></tr></tbody>');
			jQuery("#invoice-grid_processing").css("display","none");
			
		},
	}
	} );
	
	if(parseInt(viewinvoiceid) > 0){
		view_invoice_details(viewinvoiceid);
	}	  
	
	//View Invoice
	jQuery('body').on('click', '.viewInvoice', function(){
												  
		twocheckoutpublishkey = jQuery(this).data('twocheckoutpublishkey');
		twocheckoutmode = jQuery(this).data('twocheckoutmode');
		twocheckoutaccountid = jQuery(this).data('twocheckoutaccountid');
		
		var invoiceid = jQuery(this).attr('data-id');
		view_invoice_details(invoiceid);
		
    });
	
	function view_invoice_details(invoiceid){
		jQuery('#invoice-grid_wrapper').addClass('hidden');
		jQuery('#invoice-details').removeClass('hidden');
		
		var data = {
			  "action": "invoice_customer_details",
			  "invoiceid": invoiceid
			};
			
			var data = jQuery.param(data);
			
			jQuery.ajax({

						type: 'POST',

						url: ajaxurl,
						
						data: data,
						
						beforeSend: function() {
							jQuery('.loading-area').show();
						},

						success:function (data, textStatus) {
							jQuery('.loading-area').hide();
							
							jQuery('#invoice-details').html(data);
							jQuery('.sf-select-box').selectpicker('refresh');
							
							jQuery('.pay-now')
        .bootstrapValidator({
          message: param.not_valid,
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
				invoicepayment_mode: {
					validators: {
						notEmpty: {
							message: param.select_payment
						}
					}
				},
            }
        })
		.on('click',  'input[type="submit"]', function(e) {
           if(jQuery('.pay-now select[name="card_month"] option:selected').val()==""){month_flag = 1;jQuery('.pay-now select[name="card_month"]').parent('div').addClass('has-error').removeClass('has-success'); jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);}else{month_flag = 0;jQuery('.pay-now select[name="card_month"]').parent('div').removeClass('has-error').addClass('has-success'); jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);}
			
			if(jQuery('.pay-now select[name="card_year"] option:selected').val()==""){year_flag = 1;jQuery('.pay-now select[name="card_year"]').parent('div').addClass('has-error').removeClass('has-success'); jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);}else{year_flag = 0;jQuery('.pay-now select[name="card_year"]').parent('div').removeClass('has-error').addClass('has-success'); jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);}
			
	    })
		.on('error.field.bv', function(e, data) {
            data.bv.disableSubmitButtons(false); // disable submit buttons on errors
	    })
		.on('status.field.bv', function(e, data) {
            data.bv.disableSubmitButtons(false); // disable submit buttons on valid
        })
		.on('change', 'input[name="invoicepayment_mode"]', function() {
			var paymode = jQuery(this).val();
			if(paymode == 'stripe'){
				jQuery('#invoicecardinfo').show();
				jQuery('#twocheckoutinvoicecardinfo').hide();
				jQuery('#payulataminvoicecardinfo').hide();
											jQuery('.pay-now')
											.bootstrapValidator('addField', 'card_number', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'card_cvc', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'card_month', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'card_year', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											});
											
											jQuery('.pay-now')
											.bootstrapValidator('removeField', 'twocheckout_card_number')
											.bootstrapValidator('removeField', 'twocheckout_card_cvc')
											.bootstrapValidator('removeField', 'twocheckout_card_month')
											.bootstrapValidator('removeField', 'twocheckout_card_year')
											.bootstrapValidator('removeField', 'payulatam_invoice_cardtype')
											.bootstrapValidator('removeField', 'payulatam_card_number')
											.bootstrapValidator('removeField', 'payulatam_card_cvc')
											.bootstrapValidator('removeField', 'payulatam_card_month')
											.bootstrapValidator('removeField', 'payulatam_card_year');
											
			}else if(paymode == 'twocheckout'){
				jQuery('#invoicecardinfo').hide();
				jQuery('#twocheckoutinvoicecardinfo').show();
				jQuery('#payulataminvoicecardinfo').hide();
											jQuery('.pay-now')
											.bootstrapValidator('addField', 'twocheckout_card_number', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'twocheckout_card_cvc', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'twocheckout_card_month', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'twocheckout_card_year', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											});
											
											jQuery('.pay-now')
											.bootstrapValidator('removeField', 'card_number')
											.bootstrapValidator('removeField', 'card_cvc')
											.bootstrapValidator('removeField', 'card_month')
											.bootstrapValidator('removeField', 'card_year')
											.bootstrapValidator('removeField', 'payulatam_invoice_cardtype')
											.bootstrapValidator('removeField', 'payulatam_card_number')
											.bootstrapValidator('removeField', 'payulatam_card_cvc')
											.bootstrapValidator('removeField', 'payulatam_card_month')
											.bootstrapValidator('removeField', 'payulatam_card_year');
											
			
			}else if(paymode == 'payulatam'){
				jQuery('#invoicecardinfo').hide();
				jQuery('#twocheckoutinvoicecardinfo').hide();
				jQuery('#payulataminvoicecardinfo').show();
											jQuery('.pay-now')
											.bootstrapValidator('addField', 'payulatam_invoice_cardtype', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'payulatam_card_number', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'payulatam_card_cvc', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'payulatam_card_month', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											})
											.bootstrapValidator('addField', 'payulatam_card_year', {
												validators: {
													notEmpty: {
														message: param.req
													},
													digits: {message: param.only_digits},
												}
											});
											
											jQuery('.pay-now')
											.bootstrapValidator('removeField', 'card_number')
											.bootstrapValidator('removeField', 'card_cvc')
											.bootstrapValidator('removeField', 'card_month')
											.bootstrapValidator('removeField', 'card_year')
											.bootstrapValidator('removeField', 'twocheckout_card_number')
											.bootstrapValidator('removeField', 'twocheckout_card_cvc')
											.bootstrapValidator('removeField', 'twocheckout_card_month')
											.bootstrapValidator('removeField', 'twocheckout_card_year');
											
			
			}else if(paymode == 'wired'){
				jQuery('#cardinfo').hide();
				jQuery('#twocheckoutcardinfo').hide();
				jQuery('#payulatamcardinfo').hide();
				jQuery('#invoicewiredinfo').show();
											jQuery('.provider_registration')
											.bootstrapValidator('removeField', 'cd_number')
											.bootstrapValidator('removeField', 'cd_cvc')
											.bootstrapValidator('removeField', 'cd_month')
											.bootstrapValidator('removeField', 'cd_year')
											.bootstrapValidator('removeField', 'twocheckout_cd_number')
											.bootstrapValidator('removeField', 'twocheckout_cd_cvc')
											.bootstrapValidator('removeField', 'twocheckout_cd_month')
											.bootstrapValidator('removeField', 'twocheckout_cd_year')
											.bootstrapValidator('removeField', 'payulatam_signup_cardtype')
											.bootstrapValidator('removeField', 'payulatam_cd_number')
											.bootstrapValidator('removeField', 'payulatam_cd_cvc')
											.bootstrapValidator('removeField', 'payulatam_cd_month')
											.bootstrapValidator('removeField', 'payulatam_cd_year');
			}else{
				jQuery('#invoicecardinfo').hide();
				jQuery('#twocheckoutinvoicecardinfo').hide();
				jQuery('#payulataminvoicecardinfo').hide();
											jQuery('.pay-now')
											.bootstrapValidator('removeField', 'card_number')
											.bootstrapValidator('removeField', 'card_cvc')
											.bootstrapValidator('removeField', 'card_month')
											.bootstrapValidator('removeField', 'card_year')
											.bootstrapValidator('removeField', 'twocheckout_card_number')
											.bootstrapValidator('removeField', 'twocheckout_card_cvc')
											.bootstrapValidator('removeField', 'twocheckout_card_month')
											.bootstrapValidator('removeField', 'twocheckout_card_year')
											.bootstrapValidator('removeField', 'payulatam_invoice_cardtype')
											.bootstrapValidator('removeField', 'payulatam_card_number')
											.bootstrapValidator('removeField', 'payulatam_card_cvc')
											.bootstrapValidator('removeField', 'payulatam_card_month')
											.bootstrapValidator('removeField', 'payulatam_card_year');
			}
		})
        .on('success.form.bv', function(form) {
            // Prevent form submission
			
			var woooption = jQuery('input[name=invoice_woopayment]:checked').val();
			if(woooption == undefined){
				woooption = '';
			}
			
			if(woopayment && woooption == '' && jQuery('input[name=invoice_woopayment]').length){
				jQuery('.alert').remove();	
				jQuery( "<div class='alert alert-danger'>"+param.payment_method_req+"</div>" ).insertAfter( "form.pay-now" );
				jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);	
				return false;
			}
			
			if(woopayment && woooption != "wallet"){
				var data = {
				  "action": "sf_add_to_woo_cart",
				  "wootype": "invoice"
				};
					
				var formdata = jQuery('form.pay-now').serialize() + "&" + jQuery.param(data);
				
				jQuery.ajax({
					type        : 'POST',
					url         : ajaxurl,
					data        : formdata,
					beforeSend: function() {
						jQuery(".alert-success,.alert-danger").remove();
						jQuery('.loading-area').show();
					},
					dataType    : 'json',
					xhrFields   : { withCredentials: true },
					crossDomain : 'withCredentials' in new XMLHttpRequest(),
					success     : function (response) {
						jQuery('.loading-area').hide();	
						if (response['success']) {
							window.location.href = cart_url;
						} else {
							jQuery(".alert-success,.alert-danger").remove();
							jQuery( "<div class='alert alert-danger'>"+response.error+"</div>" ).insertBefore( "form.pay-now" );
							jQuery("html, body").animate({
									scrollTop: jQuery(".alert-danger").offset().top
								}, 1000);
						}
					}
				});  
				return false;						  
					  	
				}else{
			
			var paymode = jQuery('input[name="invoicepayment_mode"]:checked').val();
					if(paymode == 'stripe'){
						form.preventDefault();
						var card_number = jQuery('input[name="card_number"]').val();
						var card_cvc = jQuery('input[name="card_cvc"]').val();
						var card_month = jQuery('input[name="card_month"]').val();
						var card_year = jQuery('input[name="card_year"]').val();
						if(month_flag==1 || year_flag==1){return false;}
						if(card_number != "" && card_cvc != "" && card_month != "" && card_year != ""){	
						jQuery('.loading-area').show();
						provider_id = jQuery('#provider').val();
						
						var data = {
						  "action": "get_stripekey",
						  "provider_id": provider_id,
						};
						var formdata = jQuery.param(data);
						jQuery.ajax({
								type: 'POST',
								url: ajaxurl,
								data: formdata,
								success:function (data, textStatus) {
								jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);	
								Stripe.setPublishableKey(data);
									 Stripe.card.createToken({
								  number: jQuery('#card_number').val(),
								  cvc: jQuery('#card_cvc').val(),
								  exp_month: jQuery('#card_month').val(),
								  exp_year: jQuery('#card_year').val()
								}, service_finder_stripeResponseInvoiceHandler);	
								}
						});	
						
							 
						}
		
					}else if(paymode == 'payulatam'){
					// Prevent form submission
					form.preventDefault();
					var crd_type = jQuery('#payulatam_invoice_cardtype').val();
					var crd_number = jQuery('#payulatam_card_number').val();
					var crd_cvc = jQuery('#payulatam_card_cvc').val();
					var crd_month = jQuery('#payulatam_card_month').val();
					var crd_year = jQuery('#payulatam_card_year').val();
					if(crd_type != "" && crd_number != "" && crd_cvc != "" && crd_month != "" && crd_year != ""){	
					jQuery('.loading-area').show();
					
					var provider_id = jQuery('#provider').val();
					var data = {
							  "action": "payulatam_paynow",
							  "provider_id": provider_id
							};
							
					var formdata = jQuery('form.pay-now').serialize() + "&" + jQuery.param(data);
					
					jQuery.ajax({
							type: 'POST',
							url: ajaxurl,
							data: formdata,
							dataType: "json",
							beforeSend: function() {
								jQuery(".alert-success,.alert-danger").remove();
							},
							success:function (data, textStatus) {
								jQuery('.loading-area').hide();
								jQuery('.alert').remove();
								jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);
								if(data['status'] == 'success'){
									jQuery( "<div class='alert alert-success'>"+data['suc_message']+"</div>" ).insertBefore( "form.pay-now" );	
											
								}else if(data['status'] == 'error'){
									jQuery( "<div class='alert alert-danger'>"+data['err_message']+"</div>" ).insertBefore( "form.pay-now" );
								}
								
							}
					});		
						
						 
					}
					}else if(paymode == 'twocheckout'){
					// Prevent form submission
					form.preventDefault();
					
					if(twocheckoutpublishkey != ""){
						
						try {
							TCO.loadPubKey(twocheckoutmode);
							jQuery('.loading-area').show();
							tokenRequest(twocheckoutpublishkey,twocheckoutaccountid);
						} catch(e) {
							jQuery('.loading-area').hide();
							jQuery(".alert-success,.alert-danger").remove();
							jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);	
							jQuery( "<div class='alert alert-danger'>"+e.toSource()+"</div>" ).insertBefore( "form.pay-now" );
							jQuery("html, body").animate({
									scrollTop: jQuery(".alert-danger").offset().top
								}, 1000);
	
						}
					
					}else{
						jQuery('.loading-area').hide();
						jQuery(".alert-success,.alert-danger").remove();
						jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);	
						jQuery( "<div class='alert alert-danger'>"+param.pub_key+"</div>" ).insertBefore( "form.pay-now" );
						jQuery("html, body").animate({
								scrollTop: jQuery(".alert-danger").offset().top
							}, 1000);
					}	
					
				
					}else if(paymode == 'wallet' || woooption == "wallet"){
					
						form.preventDefault();
						var data = {
								  "action": "wallet_paynow",
								  "provider_id": provider_id
								};
								
						var formdata = jQuery('form.pay-now').serialize() + "&" + jQuery.param(data);
						
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
									jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);
									if(data['status'] == 'success'){
										jQuery( "<div class='alert alert-success'>"+data['suc_message']+"</div>" ).insertBefore( "form.pay-now" );	
												
									}else if(data['status'] == 'error'){
										jQuery( "<div class='alert alert-danger'>"+param.insufficient_wallet_amount+"</div>" ).insertBefore( "form.pay-now" );
										jQuery("html, body").animate({
											scrollTop: jQuery(".alert-danger").offset().top
										}, 1000);	
									}
									
								}
		
							});
						
					}else if(paymode == 'paypal' || paymode == 'wired' || paymode == 'payumoney'){
					return true;
					
					}
			}
			
		});
						}

					});	
	}

	//Stripe Handler
function service_finder_stripeResponseInvoiceHandler(status, response) {
  
			  if (response.error) {
				  // Show the errors on the form
				  jQuery('.loading-area').hide();
				  jQuery( "<div class='alert alert-danger'>"+response.error.message+"</div>" ).insertBefore( "form.pay-now" );
				
			  } else {
				// response contains id and card, which contains additional card details
				var token = response.id;
				var provider_id = jQuery('#provider').val();
				/*To Add Service cost also in minimum cost*/
				var data = {
						  "action": "paynow",
						  "stripeToken": token,
						  "provider_id": provider_id
						};
						
				var formdata = jQuery('form.pay-now').serialize() + "&" + jQuery.param(data);
				
				jQuery.ajax({

						type: 'POST',

						url: ajaxurl,
						
						dataType: "json",
						
						beforeSend: function() {
						},
						
						data: formdata,

						success:function (data, textStatus) {
							jQuery('.loading-area').hide();
							jQuery('.alert').remove();
							jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);
							if(data['status'] == 'success'){
								jQuery( "<div class='alert alert-success'>"+data['suc_message']+"</div>" ).insertBefore( "form.pay-now" );	
										
							}else if(data['status'] == 'error'){
								jQuery( "<div class='alert alert-danger'>"+data['err_message']+"</div>" ).insertBefore( "form.pay-now" );
							}
							
						}

					});
    
 				}
		}
  });
  
/*Featured Payment via twocheckout Start*/
var tokenRequest = function(twocheckoutpublishkey,twocheckoutaccountid) {
								  
var twocheckout_card_number = jQuery('input[name="twocheckout_card_number"]').val();
var twocheckout_card_cvc = jQuery('input[name="twocheckout_card_cvc"]').val();
var twocheckout_card_month = jQuery('select[name="twocheckout_card_month"]').val();
var twocheckout_card_year = jQuery('select[name="twocheckout_card_year"]').val();
// Setup token request arguments
var args = {
sellerId: twocheckoutaccountid,
publishableKey: twocheckoutpublishkey,
ccNo: twocheckout_card_number,
cvv: twocheckout_card_cvc,
expMonth: twocheckout_card_month,
expYear: twocheckout_card_year
};

// Make the token request
TCO.requestToken(successCallback, errorCallback, args);
};

// Called when token created successfully.
var successCallback = function(data) {
// Set the token as the value for the token input
var token = data.response.token.token;
	
	/*To Add Service cost also in minimum cost*/
	var provider_id = jQuery('#provider').val();
	var data = {
			  "action": "twocheckout_paynow",
			  "twocheckouttoken": token,
			  "provider_id": provider_id
			};
			
	var formdata = jQuery('form.pay-now').serialize() + "&" + jQuery.param(data);
	
	jQuery.ajax({

			type: 'POST',

			url: ajaxurl,
			
			dataType: "json",
			
			beforeSend: function() {
				jQuery(".alert-success,.alert-danger").remove();
			},
			
			data: formdata,

			success:function (data, textStatus) {
				jQuery('.loading-area').hide();
				jQuery('.alert').remove();
				jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);
				if(data['status'] == 'success'){
					jQuery( "<div class='alert alert-success'>"+data['suc_message']+"</div>" ).insertBefore( "form.pay-now" );	
							
				}else if(data['status'] == 'error'){
					jQuery( "<div class='alert alert-danger'>"+data['err_message']+"</div>" ).insertBefore( "form.pay-now" );
				}
				
			}

		});

};

// Called when token creation fails.
var errorCallback = function(data) {
if (data.errorCode === 200) {
  // This error code indicates that the ajax call failed. We recommend that you retry the token request.
} else {
  jQuery('.loading-area').hide();
  jQuery('.alert').remove();
  jQuery('form.pay-now').find('input[type="submit"]').prop('disabled', false);
  jQuery( "<div class='alert alert-danger'>"+data.errorMsg+"</div>" ).insertBefore( "form.pay-now" );
  jQuery("html, body").animate({
						scrollTop: jQuery(".alert-danger").offset().top
					}, 1000);
}
};
/*Featured Payment via twocheckout End*/  