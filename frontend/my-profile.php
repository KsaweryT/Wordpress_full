<?php
/*****************************************************************************
*
*	copyright(c) - aonetheme.com - Service Finder Team
*	More Info: http://aonetheme.com/
*	Coder: Service Finder Team
*	Email: contact@aonetheme.com
*
******************************************************************************/
get_header();

$service_finder_options = get_option('service_finder_options');

$current_user = service_finder_plugin_global_vars('current_user');

$wpdb = service_finder_plugin_global_vars('wpdb');
$service_finder_Params = service_finder_plugin_global_vars('service_finder_Params');
$userInfo = service_finder_getCurrentUserInfo();

$manageaccountby = (isset($_GET['manageaccountby'])) ? esc_attr($_GET['manageaccountby']) : '';
$manageproviderid = (isset($_GET['manageproviderid'])) ? esc_attr($_GET['manageproviderid']) : '';

if(!is_user_logged_in()){
$redirect = home_url();
wp_redirect($redirect);
}

if(service_finder_getUserRole($current_user->ID) == 'administrator' && $manageaccountby != 'admin' && is_page()){
$redirect = admin_url( 'profile.php' );
wp_redirect($redirect);
exit;
}

$payment_methods = (!empty($service_finder_options['payment-methods'])) ? $service_finder_options['payment-methods'] : '';
$identitycheck = (isset($service_finder_options['identity-check'])) ? esc_attr($service_finder_options['identity-check']) : '';
$stripeconnecttype = (!empty($service_finder_options['stripe-connect-type'])) ? esc_html($service_finder_options['stripe-connect-type']) : '';

$tabname = (isset($_GET['tabname'])) ? esc_html($_GET['tabname']) : '';
$bookingid = (isset($_GET['bookingid'])) ? esc_html($_GET['bookingid']) : 0;
$invoiceid = (isset($_GET['invoiceid'])) ? esc_html($_GET['invoiceid']) : 0;
$quoteid = (isset($_GET['quoteid'])) ? esc_html($_GET['quoteid']) : 0;

$availabilitytab = $busitab = $wallettab = $bookingstab = $articlestab = $experiencetab = $certificatestab = $qualificationtab = $unavailabilitytab = $postalcodestab = $ourbranchestab = $serviceregionstab = $myservicestab = $myjobstab = $joblimitstab = $teammemberstab = $scheduletab = $invoicetab = $quotationtab = $upgradetab = '';
$busitab = '';
$wallettab = '';
if($tabname == 'availability'){
$availabilitytab = 'yes';
}elseif($tabname == 'business-hours'){
$busitab = 'yes';
}elseif($tabname == 'wallet'){
$wallettab = 'yes';
}elseif($tabname == 'bookings'){
$bookingstab = 'yes';
}elseif($tabname == 'articles'){
$articlestab = 'yes';
}elseif($tabname == 'experience'){
$experiencetab = 'yes';
}elseif($tabname == 'certificates'){
$certificatestab = 'yes';
}elseif($tabname == 'qualification'){
$qualificationtab = 'yes';
}elseif($tabname == 'unavailability'){
$unavailabilitytab = 'yes';
}elseif($tabname == 'postal-codes'){
$postalcodestab = 'yes';
}elseif($tabname == 'our-branches'){
$ourbranchestab = 'yes';
}elseif($tabname == 'service-regions'){
$serviceregionstab = 'yes';
}elseif($tabname == 'my-services'){
$myservicestab = 'yes';
}elseif($tabname == 'my-jobs'){
$myjobstab = 'yes';
}elseif($tabname == 'job-limits'){
$joblimitstab = 'yes';
}elseif($tabname == 'team-members'){
$teammemberstab = 'yes';
}elseif($tabname == 'schedule'){
$scheduletab = 'yes';
}elseif($tabname == 'invoice'){
$invoicetab = 'yes';
}elseif($tabname == 'upgrade'){
$upgradetab = 'yes';
}elseif($tabname == 'quotation'){
$quotationtab = 'yes';
}elseif($tabname == 'payout-settings'){
$payoutsettingstab = 'yes';
}

wp_add_inline_script( 'service_finder-js-availability-form', '/*Declare global variable*/
var availabilitytab = "'.$availabilitytab.'";
var wallettab = "'.$wallettab.'";
var busitab = "'.$busitab.'";
', 'after' );

wp_add_inline_script( 'service_finder-js-wallet', '/*Declare global variable*/
var wallettab = "'.$wallettab.'";
', 'after' );

wp_add_inline_script( 'service_finder-js-bookings-form', '/*Declare global variable*/
var viewbookingid = "'.$bookingid.'";
var bookingstab = "'.$bookingstab.'";', 'after' );

wp_add_inline_script( 'service_finder-js-upgrade', '/*Declare global variable*/
var upgradetab = "'.$upgradetab.'";', 'after' );

wp_add_inline_script( 'service_finder-js-job-form', '/*Declare global variable*/
var joblimitstab = "'.$joblimitstab.'";
var myjobstab = "'.$myjobstab.'";', 'after' );

wp_add_inline_script( 'service_finder-js-invoice-form', '/*Declare global variable*/
var viewinvoiceid = "'.$invoiceid.'";
var invoicetab = "'.$invoicetab.'";', 'after' );

wp_add_inline_script( 'service_finder-js-invoice-customer-form', '/*Declare global variable*/
var viewinvoiceid = "'.$invoiceid.'";', 'after' );

wp_add_inline_script( 'service_finder-js-provider-quote-form', '/*Declare global variable*/
var viewquoteid = "'.$quoteid.'";
var quotationtab = "'.$quotationtab.'";', 'after' );

?>

        <?php if(service_finder_getUserRole($current_user->ID) == 'Provider' || service_finder_check_account_authorization($manageaccountby,$manageproviderid)){ ?>
        <!-- Provider Section Start -->
        <?php 
		if(service_finder_getUserRole($current_user->ID) == 'Provider'){
		$userCap = service_finder_get_capability($current_user->ID);
		$globalproviderid = $current_user->ID;
		$userInfo = service_finder_getCurrentUserInfo();
		}else{
		$userCap = service_finder_get_capability($manageproviderid);
		$globalproviderid = $manageproviderid;
		$userInfo = service_finder_getUserInfo($manageproviderid);
		}
		$package = get_user_meta($current_user->ID,'provider_role',true);
		wp_add_inline_script( 'service_finder-js-app', '/*Declare global variable*/
var user_id = "'.$globalproviderid.'";', 'after' );

		wp_add_inline_script( 'service_finder-js-form-submit', '/*Declare global variable*/

		var addressalert;

		', 'after' );
		?>
        
        <nav id="sidebar-admin-wraper">
            <div class="page-logo">
                <?php 
				echo '<a href="'.esc_url(home_url()).'">';
				if(!empty($service_finder_options['myaccount-logo']['url'])){
				echo '<img src="'.esc_url($service_finder_options['myaccount-logo']['url']).'" alt="'.esc_attr(get_bloginfo('name')).'" title="'.esc_attr(get_bloginfo('name')).'">';
				}elseif(!empty($service_finder_options['site-logo']['url'])){
				echo '<img src="'.esc_url($service_finder_options['site-logo']['url']).'" alt="'.esc_attr(get_bloginfo('name')).'" title="'.esc_attr(get_bloginfo('name')).'">';
				}else{
				echo get_bloginfo('name');
				}
				echo '</a>';
				?>
            </div>
            
            <aside  class="side-bar">
                            
                <div class="auther-bx">
                    <div class="auther-pic">
                      <?php if(service_finder_get_user_profile_image($userInfo['avatar_id']) != ""){ ?>
                       <img src="<?php echo esc_url(service_finder_get_user_profile_image($userInfo['avatar_id'])); ?>" alt=""> 
                      <?php } ?>
                    </div>
                    <p><?php echo service_finder_getProviderFullName($globalproviderid); ?></p>
                    <?php echo service_finder_check_varified_icon($globalproviderid); ?>
                </div>
                
                    <div class="admin-nav">
                    <ul id="myTab">
                <?php if(service_finder_check_profile_after_trial_expire($globalproviderid)){ ?>
                <?php if(service_finder_check_display_features_after_social_login($globalproviderid)){ ?>
                <?php 
				if($service_finder_options['wallet-menu'] || $service_finder_options['earnings-dues-menu'] || $service_finder_options['qualification-menu'] || $service_finder_options['experience-menu'] || $service_finder_options['certificates-menu'] || $service_finder_options['articles-menu']){ 
				$atleastone = true;
				}else{
				$atleastone = false;
				}
				?>
                <li class="<?php echo ($tabname == 'my-profile' || $tabname == '') ? 'active' : ''; ?> <?php echo ($atleastone) ? 'has-child' : '';?>">
                  <a href="#my-profile"><i class="fa fa-user"></i><span class="admin-nav-text"><?php echo (!empty($service_finder_options['label-profile-settings'])) ? esc_html($service_finder_options['label-profile-settings']) : esc_html__('Profile Settings', 'service-finder'); ?></span></a>
                  <?php if($atleastone){ ?>
                  <ul class="sub-menu" style="display: <?php echo ($tabname == 'wallet' || $tabname == 'earnings-dues' || $tabname == 'qualification' || $tabname == 'experience' || $tabname == 'certificates' || $tabname == 'articles') ? 'block' : 'none'; ?>;">
					<?php if(service_finder_check_wallet_system() && $service_finder_options['wallet-menu']){ ?>
                    <li class="<?php echo ($tabname == 'wallet') ? 'active' : ''; ?>"><a href="#wallet"><i class="fa fa-folder-open"></i>
                    <?php echo (!empty($service_finder_options['label-wallet'])) ? esc_html($service_finder_options['label-wallet']) : esc_html__('My Wallet', 'service-finder'); ?>
                    </a></li>
                    <?php } ?>
                    <?php if($service_finder_options['earnings-dues-menu']){ ?>
                    <li class="<?php echo ($tabname == 'earnings-dues') ? 'active' : ''; ?>"><a href="#earnings-dues"><i class="fa fa-money"></i>
                    <?php echo (!empty($service_finder_options['label-earnings-dues'])) ? esc_html($service_finder_options['label-earnings-dues']) : esc_html__('Earnings & Dues', 'service-finder'); ?>
                    </a></li>
                    <?php } ?>
                    <?php if($service_finder_options['qualification-menu']){ ?>
                    <li class="<?php echo ($tabname == 'qualification') ? 'active' : ''; ?>"><a href="#qualification"><i class="fa fa-graduation-cap"></i>
                <?php echo (!empty($service_finder_options['label-qualification'])) ? esc_html($service_finder_options['label-qualification']) : esc_html__('Qualification', 'service-finder'); ?>
                </a></li>
                 <?php } ?>
                <?php if($service_finder_options['experience-menu']){ ?>
                    <li class="<?php echo ($tabname == 'experience') ? 'active' : ''; ?>"><a href="#experience"><i class="fa fa-black-tie"></i>
                <?php echo (!empty($service_finder_options['label-experience'])) ? esc_html($service_finder_options['label-experience']) : esc_html__('Experience', 'service-finder'); ?>
                </a></li>
                 <?php } ?>
                <?php if($service_finder_options['certificates-menu']){ ?>
	                <li class="<?php echo ($tabname == 'certificates') ? 'active' : ''; ?>"><a href="#certificates"><i class="fa fa-shield"></i>
                <?php echo (!empty($service_finder_options['label-certificates'])) ? esc_html($service_finder_options['label-certificates']) : esc_html__('Certificates', 'service-finder'); ?>
                </a></li>
                 <?php } ?>
                <?php if($service_finder_options['articles-menu']){ ?>
    	            <li class="<?php echo ($tabname == 'articles') ? 'active' : ''; ?>"><a href="#articles"><i class="fa fa-files-o"></i>
                <?php echo (!empty($service_finder_options['label-articles'])) ? esc_html($service_finder_options['label-articles']) : esc_html__('Articles', 'service-finder'); ?>
                </a></li>
                 <?php } ?>
                </ul>
	              <?php } ?>
                </li>
                <?php if($identitycheck){ ?>
                <li><a href="#my-profile" class="openidentitychk"><i class="fa fa-location-arrow"></i>
                  <?php echo (!empty($service_finder_options['label-identity-check'])) ? esc_html($service_finder_options['label-identity-check']) : esc_html__('Identity Check', 'service-finder'); ?>
                  </a></li>  
                <?php } ?> 
                <?php  if(class_exists('WP_Job_Manager')){ 
				if(!empty($userCap)){
				if(in_array('apply-for-job',$userCap) && $service_finder_options['my-jobs-menu']){
				?> 
                <li class="<?php echo ($tabname == 'earnings') ? 'active' : ''; ?>">
                  <a href="#my-jobs"><i class="fa fa-briefcase"></i>
                  <span class="admin-nav-text"><?php echo (!empty($service_finder_options['label-my-jobs'])) ? esc_html($service_finder_options['label-my-jobs']) : esc_html__('My Jobs', 'service-finder'); ?></span>
                  </a>
                  <ul class="sub-menu" style="display: <?php echo ($tabname == 'job-limits') ? 'block' : 'none'; ?>;">
                  <?php if(in_array('apply-for-job',$userCap) && $service_finder_options['job-apply-limits-menu']){ ?>
                  <li class="<?php echo ($tabname == 'job-limits') ? 'active' : ''; ?>"><a href="#job-limits"><i class="fa fa-check-circle-o"></i>
                  <?php echo (!empty($service_finder_options['label-job-limits'])) ? esc_html($service_finder_options['label-job-limits']) : esc_html__('Job Apply Limits', 'service-finder'); ?>
                  </a></li>
                  <?php } ?>
                  </ul>
                  </li>  
                <?php }
				}
				}
				?>
                <?php } ?>
                <?php 
				if(!empty($userCap)){
				if(in_array('bookings',$userCap) && ($service_finder_options['booking-settings-menu'] || $service_finder_options['availability-menu'] || $service_finder_options['set-unavailability-menu'] || $service_finder_options['bookings-menu'] || $service_finder_options['schedule-menu'])){
				?>
                <li class="<?php echo ($tabname == 'booking-settings') ? 'active' : ''; ?>">
                  <a href="#booking-settings"><i class="fa fa-money"></i><span class="admin-nav-text"><?php echo (!empty($service_finder_options['label-booking-settings'])) ? esc_html($service_finder_options['label-booking-settings']) : esc_html__('Booking Settings', 'service-finder'); ?></span></a>
                <ul class="sub-menu" style="display: <?php echo ($tabname == 'booking-settings' || $tabname == 'availability' || $tabname == 'unavailability' || $tabname == 'bookings' || $tabname == 'schedule') ? 'block' : 'none'; ?>;">
                    <?php 
					if(!empty($userCap)){
					if(in_array('bookings',$userCap)){
					?>
					<?php if($service_finder_options['booking-settings-menu']){ ?> 
					<li class="<?php echo ($tabname == 'booking-settings') ? 'active' : ''; ?>"><a href="#booking-settings"><i class="fa fa-money"></i>
					  <?php echo (!empty($service_finder_options['label-booking-settings'])) ? esc_html($service_finder_options['label-booking-settings']) : esc_html__('Booking Settings', 'service-finder'); ?>
					  </a></li>
					<?php } 
					}
					}?>  
					<?php 
					if(!empty($userCap)):
					if(in_array('availability',$userCap) && in_array('bookings',$userCap)):
					?>
					<?php if($service_finder_options['availability-menu']){ ?> 
					<li class="<?php echo ($tabname == 'availability') ? 'active' : ''; ?>"><a href="#availability"><i class="fa fa-calendar"></i>
					  <?php echo (!empty($service_finder_options['label-availability'])) ? esc_html($service_finder_options['label-availability']) : esc_html__('Availability', 'service-finder'); ?>
					  </a></li>
					<?php } ?>  
					<?php if($service_finder_options['set-unavailability-menu']){ ?>
					<li class="<?php echo ($tabname == 'unavailability') ? 'active' : ''; ?>"><a href="#unavailability"><i class="fa fa-calendar"></i>
					  <?php echo (!empty($service_finder_options['label-set-unavailability'])) ? esc_html($service_finder_options['label-set-unavailability']) : esc_html__('Set UnAvailability', 'service-finder'); ?>
					  </a></li>
					 <?php } ?> 
					<?php 
					endif;
					endif;
					?> 
                    <?php 
				if(!empty($userCap)):
				if(in_array('bookings',$userCap)):
				?>
                <?php if($service_finder_options['bookings-menu']){ ?>
                <li class="<?php echo ($tabname == 'bookings') ? 'active' : ''; ?>"><a href="#bookings"><i class="fa fa-hand-o-up"></i>
                  <?php echo (!empty($service_finder_options['label-bookings'])) ? esc_html($service_finder_options['label-bookings']) : esc_html__('Bookings', 'service-finder'); ?>
                  </a></li>
                <?php } ?>  
                <?php if($service_finder_options['schedule-menu']){ ?>
                <li class="<?php echo ($tabname == 'schedule') ? 'active' : ''; ?>"><a href="#schedule"><i class="fa fa-clock-o"></i>
                  <?php echo (!empty($service_finder_options['label-schedule'])) ? esc_html($service_finder_options['label-schedule']) : esc_html__('Schedule', 'service-finder'); ?>
                  </a></li>
                <?php } ?>  
                <?php 
				endif;
				endif;
				?>    
                </ul>
                </li>  
                <?php
				}
				}
				?>
                <?php
                $woopayment = (isset($service_finder_options['woocommerce-payment'])) ? esc_html($service_finder_options['woocommerce-payment']) : false;
				if($woopayment && $service_finder_options['payout-menu'] && class_exists( 'WC_Vendors' ) && class_exists( 'WooCommerce' ) && class_exists( 'mangopayWCMain' )){
				?>
                <li class="<?php echo ($tabname == 'payout-settings') ? 'active' : ''; ?>">
                  <a href="#payout-settings"><i class="fa fa-money"></i><span class="admin-nav-text"><?php echo (!empty($service_finder_options['label-payout'])) ? esc_html($service_finder_options['label-payout']) : esc_html__('Payout Settings', 'service-finder'); ?></span></a>
                  <ul class="sub-menu" style="display: <?php echo ($tabname == 'payout-settings') ? 'block' : 'none'; ?>;">
                            <li class="<?php echo ($tabname == 'payout-settings') ? 'active' : ''; ?>"><a href="#payout-settings"><i class="fa fa-money"></i>
                              <?php echo esc_html__('General', 'service-finder'); ?>
                              </a></li>
                            <li class="<?php echo ($tabname == 'payout-history') ? 'active' : ''; ?>"><a href="#payout-history"><i class="fa fa-money"></i>
                              <?php echo (!empty($service_finder_options['label-payout-history'])) ? esc_html($service_finder_options['label-payout-history']) : esc_html__('Payout History', 'service-finder'); ?>
                              </a></li>        
                        </ul>
                  </li>
				<?php
				}elseif((($payment_methods['stripe'] && $stripeconnecttype == 'custom') || $payment_methods['paypal'] || $woopayment) && $service_finder_options['payout-menu']){
				?>
                <li class="<?php echo ($tabname == 'payout-general') ? 'active' : ''; ?>">
                  <a href="#payout-general"><i class="fa fa-money"></i><span class="admin-nav-text"><?php echo (!empty($service_finder_options['label-payout'])) ? esc_html($service_finder_options['label-payout']) : esc_html__('Payout Settings', 'service-finder'); ?></span></a>
                  <ul class="sub-menu" style="display: <?php echo ($tabname == 'payout-general') ? 'block' : 'none'; ?>;">
                            <?php if($payment_methods['stripe'] && $stripeconnecttype == 'custom'){ ?>
                            <li class="<?php echo ($tabname == 'payout-general') ? 'active' : ''; ?>"><a href="#payout-general"><i class="fa fa-user"></i>
                              <?php echo esc_html__('Stripe Connect', 'service-finder'); ?>
                              </a></li>
                            <?php } ?>
							<?php if($payment_methods['paypal'] || $woopayment){ ?>
                            <li class="<?php echo ($tabname == 'paypal-masspay') ? 'active' : ''; ?>"><a href="#paypal-masspay"><i class="fa fa-user"></i>
                              <?php echo esc_html__('Paypal', 'service-finder'); ?>
                              </a></li>  
                            <?php } ?>  
                            <li class="<?php echo ($tabname == 'payout-history') ? 'active' : ''; ?>"><a href="#payout-history"><i class="fa fa-money"></i>
                              <?php echo (!empty($service_finder_options['label-payout-history'])) ? esc_html($service_finder_options['label-payout-history']) : esc_html__('Payout History', 'service-finder'); ?>
                              </a></li>        
                        </ul>
                  </li>
                <?php } ?>  
				<?php
                if(class_exists('WP_User_Frontend')){ ?>
				<li class="<?php echo ($tabname == 'blogpost') ? 'active' : ''; ?>"><a href="#blogpost"><i class="fa fa-calendar"></i>
                  <?php echo (!empty($service_finder_options['label-blog-post'])) ? esc_html($service_finder_options['label-blog-post']) : esc_html__('Blog Post', 'service-finder'); ?>
                  </a></li>
				<?php }
				?>
                <?php if($service_finder_options['quotation-menu']){ ?>
                <li class="<?php echo ($tabname == 'quotation') ? 'active' : ''; ?>"><a href="#quotation"><i class="fa fa-file-text-o"></i>
                <?php echo (!empty($service_finder_options['label-quotation'])) ? esc_html($service_finder_options['label-quotation']) : esc_html__('Quotation', 'service-finder'); ?>
                </a></li>
                <?php } ?>  
                <?php if(service_finder_offers_method($globalproviderid) == 'booking' && $service_finder_options['offers-menu']){ ?>
                <li class="<?php echo ($tabname == 'offers') ? 'active' : ''; ?>"><a href="#offers"><i class="fa fa-gift"></i>
                <?php echo (!empty($service_finder_options['label-offers'])) ? esc_html($service_finder_options['label-offers']) : esc_html__('Offers & Promotions', 'service-finder'); ?>
                </a></li>
                <?php } ?>
                <?php if(service_finder_check_display_features_after_social_login($globalproviderid) && $service_finder_options['business-hours-menu']){ ?>
                <li class="<?php echo ($tabname == 'business-hours') ? 'active' : ''; ?>"><a href="#business-hours"><i class="fa fa-clock-o"></i>
                  <?php echo (!empty($service_finder_options['label-account-business-hours'])) ? esc_html($service_finder_options['label-account-business-hours']) : esc_html__('Business Hours', 'service-finder'); ?>
                  </a></li>
                  <?php } ?>
                <?php 
									if(!empty($userCap)){
									if(in_array('bookings',$userCap) && $service_finder_options['postal-codes-menu']){
									?>
                <li class="<?php echo ($tabname == 'postal-codes') ? 'active' : ''; ?>"><a href="#postal-codes"><i class="fa fa-book"></i>
                  <?php echo (!empty($service_finder_options['label-postal-codes'])) ? esc_html($service_finder_options['label-postal-codes']) : esc_html__('Postal Codes', 'service-finder'); ?>
                  </a></li>
                  <?php }
				}
				 ?>  
                <?php
				if(!empty($userCap)){
				if(in_array('branches',$userCap) && $service_finder_options['our-branches-menu']){
				?> 
                <li class="<?php echo ($tabname == 'our-branches') ? 'active' : ''; ?>"><a href="#our-branches"><i class="fa fa-map-marker"></i>
                  <?php echo (!empty($service_finder_options['label-our-branches'])) ? esc_html($service_finder_options['label-our-branches']) : esc_html__('Our Branches', 'service-finder'); ?>
                  </a></li>  
                <?php }
				}
				 ?>   
                 <?php 
									if(!empty($userCap)){
									if(in_array('bookings',$userCap) && $service_finder_options['regions-menu']){
									?>
                <li class="<?php echo ($tabname == 'service-regions') ? 'active' : ''; ?>"><a href="#service-regions"><i class="fa fa-location-arrow"></i>
                  <?php echo (!empty($service_finder_options['label-regions'])) ? esc_html($service_finder_options['label-regions']) : esc_html__('Regions', 'service-finder'); ?>
                  </a></li>
                  <?php }
				}
				 ?>    
                <?php if(service_finder_check_display_features_after_social_login($globalproviderid) && $service_finder_options['my-services-menu']){ ?>
                <li class="<?php echo ($tabname == 'my-services') ? 'active' : ''; ?>"><a href="#my-services"><i class="fa fa-server"></i>
                  <?php echo (!empty($service_finder_options['label-my-services'])) ? esc_html($service_finder_options['label-my-services']) : esc_html__('My Services', 'service-finder'); ?>
                  </a></li>
                  <?php } ?>
                <?php 
				if(!empty($userCap)):
				if(in_array('staff-members',$userCap) && in_array('bookings',$userCap) && $service_finder_options['team-members-menu']):
				?>
                <li class="<?php echo ($tabname == 'team-members') ? 'active' : ''; ?>"><a href="#team-members"><i class="fa fa-users"></i>
                  <?php echo (!empty($service_finder_options['label-team-members'])) ? esc_html($service_finder_options['label-team-members']) : esc_html__('Team Members', 'service-finder'); ?>
                  </a></li>
                <?php 
				endif;
				endif;
				?>
                
                <?php 
									if(!empty($userCap)):
									if(in_array('invoice',$userCap) && in_array('bookings',$userCap) && $service_finder_options['invoice-menu']):
									?>
                <li class="<?php echo ($tabname == 'invoice') ? 'active' : ''; ?>"><a href="#invoice"><i class="fa fa-file-text-o"></i>
                  <?php echo (!empty($service_finder_options['label-invoice'])) ? esc_html($service_finder_options['label-invoice']) : esc_html__('Invoice', 'service-finder'); ?>
                  </a></li>
                <?php 
									endif;
									endif;
									?>
                <?php } ?>        
                <?php if($service_finder_options['upgrade-account-menu']){ ?>            
                <li class="<?php echo ($tabname == 'upgrade') ? 'active' : ''; ?>"><a href="#upgrade"><i class="fa fa-gear"></i>
                  <?php echo (!empty($service_finder_options['label-upgrade'])) ? esc_html($service_finder_options['label-upgrade']) : esc_html__('Upgrade Account', 'service-finder'); ?>
                  </a></li>
                 <?php } ?> 
              </ul>
              		</div>
                
            </aside>
                               
        </nav>
        
        <div id="content">
        <!-- Right part start -->
        <div class="tab-content content-admin-main col-md-91">
          <?php if(get_user_meta($globalproviderid, 'trial_package', true) == 'yes' && get_user_meta($globalproviderid, 'current_provider_status', true) == 'expire' && get_user_meta($globalproviderid, 'provider_role', true) == ''){ ?>
          <div class="alert alert-danger"><?php esc_html_e('You trial package has been expired. Please update with available packages.', 'service-finder'); ?></div>
          <?php } ?>
		  <?php if(service_finder_check_profile_after_trial_expire($globalproviderid)){ ?>
          <?php if(service_finder_check_display_features_after_social_login($globalproviderid)){ ?>
          <div id="my-profile" class="tab-pane fade <?php echo ($tabname == 'my-profile' || $tabname == '') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/myaccount/templates/my-account.php'; ?>
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/myaccount/templates/identity-check.php'; ?>
          </div>
          <?php } ?>
          <?php
		  $woopayment = (isset($service_finder_options['woocommerce-payment'])) ? esc_html($service_finder_options['woocommerce-payment']) : false;
		  if($woopayment && class_exists( 'WC_Vendors' ) && class_exists( 'WooCommerce' ) && class_exists( 'mangopayWCMain' ) && $service_finder_options['payout-menu']){
			?>
          <div id="payout-settings" class="tab-pane fade <?php echo ($tabname == 'payout-settings') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/payout/templates/mp-settings.php'; ?>
          </div>
          <div id="payout-history" class="tab-pane fade <?php echo ($tabname == 'payout-history') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/payout/templates/payout-history-mp.php'; ?>
          </div>
          <?php 
		  }elseif((($payment_methods['stripe'] && $stripeconnecttype == 'custom') || $payment_methods['paypal'] || $woopayment) && $service_finder_options['payout-menu']){
		  ?>
          <?php if($payment_methods['stripe'] && $stripeconnecttype == 'custom'){ ?>
          <div id="payout-general" class="tab-pane fade <?php echo ($tabname == 'payout-general') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/payout/templates/general.php'; ?>
          </div>
          <?php } ?>
		  <?php if($payment_methods['paypal'] || $woopayment){ ?>
          <div id="paypal-masspay" class="tab-pane fade <?php echo ($tabname == 'paypal-masspay') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/payout/templates/masspay.php'; ?>
          </div>
          <?php } ?>
          <div id="payout-history" class="tab-pane fade <?php echo ($tabname == 'payout-history') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/payout/templates/payout-history-stripe.php'; ?>
          </div>
          <?php } ?>
		  <?php if(class_exists('WP_User_Frontend')){ ?>
          <div id="blogpost" class="tab-pane fade <?php echo ($tabname == 'blogpost') ? 'in active' : ''; ?>">
            <h4>
			  <?php echo (!empty($service_finder_options['label-blog-post'])) ? esc_html($service_finder_options['label-blog-post']) : esc_html__('Blog Post', 'service-finder'); ?>
            </h4>
            <div class="profile-form-bx">
              <div class="margin-b-30 text-right">
              <?php $addpost = service_finder_get_url_by_shortcode('[wpuf_form'); ?>
                <a class="btn btn-primary" target="_blank" href="<?php echo esc_url($addpost); ?>"><i class="fa fa-plus"></i><?php echo esc_html__('Add New Blog', 'service-finder'); ?></a>
              </div>
              <div class="margin-b-30">
                <?php echo do_shortcode('[wpuf_dashboard id="1892"]');?>
              </div>
            </div>
          </div>
          <?php } ?>
          <?php if($service_finder_options['earnings-dues-menu']){ ?> 
          <div id="earnings-dues" class="tab-pane fade <?php echo ($tabname == 'earnings-dues') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/earnings/templates/index.php'; ?>
          </div>
          <?php } ?>
          <?php if($service_finder_options['quotation-menu']){ ?> 
          <div id="quotation" class="tab-pane fade <?php echo ($tabname == 'quotation') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/get-quote/templates/index.php'; ?>
          </div>
          <?php } ?>
		  <?php if(service_finder_check_wallet_system() && $service_finder_options['wallet-menu']){ ?>
          <div id="wallet" class="tab-pane fade <?php echo ($tabname == 'wallet') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/wallet/templates/index.php'; ?>
          </div>
          <?php } ?>
          <?php if(service_finder_offers_method($globalproviderid) == 'booking'){ ?>
          <div id="offers" class="tab-pane fade <?php echo ($tabname == 'offers') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/offers/templates/index.php'; ?>
          </div>
          <?php } ?>
          <?php if($service_finder_options['articles-menu']){ ?> 
          <div id="articles" class="tab-pane fade <?php echo ($tabname == 'articles') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/articles/templates/articles.php'; ?>
          </div>
          <?php } ?>
          <?php if($service_finder_options['experience-menu']){ ?> 
          <div id="experience" class="tab-pane fade <?php echo ($tabname == 'experience') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/experience/templates/experience.php'; ?>
          </div>
          <?php } ?>
          <?php if($service_finder_options['certificates-menu']){ ?> 
          <div id="certificates" class="tab-pane fade <?php echo ($tabname == 'certificates') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/certificates/templates/certificates.php'; ?>
          </div>
          <?php } ?>
          <?php if($service_finder_options['qualification-menu']){ ?> 
          <div id="qualification" class="tab-pane fade <?php echo ($tabname == 'qualification') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/qualification/templates/qualification.php'; ?>
          </div>
          <?php } ?>
          <?php 
			if(!empty($userCap)){
			if(in_array('bookings',$userCap)){
			?>
          <?php if($service_finder_options['booking-settings-menu']){ ?> 
          <div id="booking-settings" class="tab-pane fade <?php echo ($tabname == 'booking-settings') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/bookings/templates/booking-settings.php'; ?>
          </div>
          <?php } 
		  }
		  }
		  ?>
		  <?php 
			if(!empty($userCap)):
			if(in_array('availability',$userCap) && in_array('bookings',$userCap)):
			?>
          <?php if($service_finder_options['availability-menu']){ ?> 
          <div id="availability" class="tab-pane fade <?php echo ($tabname == 'availability') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/availability/templates/availability.php'; ?>
          </div>
          <?php } ?>
          <?php if($service_finder_options['set-unavailability-menu']){ ?>
          <div id="unavailability" class="tab-pane fade <?php echo ($tabname == 'unavailability') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/availability/templates/unavailability.php'; ?>
          </div>
          <?php } ?>
          <?php 
									endif;
									endif;
									?>
          <?php if(service_finder_check_display_features_after_social_login($globalproviderid) && $service_finder_options['business-hours-menu']){ ?>
          <div id="business-hours" class="tab-pane fade <?php echo ($tabname == 'business-hours') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/business-hours/templates/business-hours.php'; ?>
          </div>
          <?php } ?>
          <?php 
									if(!empty($userCap)){
									if(in_array('bookings',$userCap) && $service_finder_options['postal-codes-menu']){
									?>
          <div id="postal-codes" class="tab-pane fade <?php echo ($tabname == 'postal-codes') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/service-area/templates/service-area.php'; ?>
          </div>
          <?php
          }
		  }
		  ?>
          <?php
		  if(!empty($userCap)){
		  if(in_array('branches',$userCap) && $service_finder_options['our-branches-menu']){
		  ?>
          <div id="our-branches" class="tab-pane fade <?php echo ($tabname == 'our-branches') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/branches/templates/branches.php'; ?>
          </div>
          <?php } 
		  }
		  ?>
          <?php 
									if(!empty($userCap)){
									if(in_array('bookings',$userCap) && $service_finder_options['regions-menu']){
									?>
          <div id="service-regions" class="tab-pane fade <?php echo ($tabname == 'service-regions') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/service-area/templates/service-regions.php'; ?>
          </div>
          <?php }
		  }
		  ?>
          <?php if(service_finder_check_display_features_after_social_login($globalproviderid) && $service_finder_options['my-services-menu']){ ?>
          <div id="my-services" class="tab-pane fade <?php echo ($tabname == 'my-services') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/myservices/templates/my-services.php'; ?>
          </div>
          <?php } ?>
          <?php  if(class_exists('WP_Job_Manager')){
		  if(!empty($userCap)){
		  if(in_array('apply-for-job',$userCap) && $service_finder_options['my-jobs-menu']){
		  ?>	
          <div id="my-jobs" class="tab-pane fade <?php echo ($tabname == 'my-jobs') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/jobs/templates/my-jobs.php'; ?>
          </div>
          <?php } 
		  }
		  }
		  ?>
          <?php  if(class_exists('WP_Job_Manager')){
		  if(!empty($userCap)){
		  if(in_array('apply-for-job',$userCap) && $service_finder_options['job-apply-limits-menu']){
		  ?>							
          <div id="job-limits" class="tab-pane fade <?php echo ($tabname == 'job-limits') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/jobs/templates/job-limits.php'; ?>
          </div>
          <?php } 
		  }
		  }
		  ?>
          <?php 
									if(!empty($userCap)):
									if(in_array('staff-members',$userCap) && in_array('bookings',$userCap) && $service_finder_options['team-members-menu']):
									?>
          <div id="team-members" class="tab-pane fade <?php echo ($tabname == 'team-members') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/team-members/templates/team-members.php'; ?>
          </div>
          <?php 
									endif;
									endif;
									?>
          <?php 
									if(!empty($userCap)):
									if(in_array('bookings',$userCap)):
									?>
          <?php if($service_finder_options['bookings-menu']){ ?>
          <div id="bookings" class="tab-pane fade <?php echo ($tabname == 'bookings') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/bookings/templates/bookings.php'; ?>
          </div>
          <?php } ?>
          <?php if($service_finder_options['schedule-menu']){ ?>
          <div id="schedule" class="tab-pane fade <?php echo ($tabname == 'schedule') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/schedule/templates/schedule.php'; ?>
          </div>
          <?php } ?>
          <?php 
									endif;
									endif;
									?>
          <?php 
									if(!empty($userCap)):
									if(in_array('invoice',$userCap) && in_array('bookings',$userCap) && $service_finder_options['invoice-menu']):
									?>
          <div id="invoice" class="tab-pane fade <?php echo ($tabname == 'invoice') ? 'in active' : ''; ?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/invoice/templates/invoice.php'; ?>
          </div>
          <?php 
									endif;
									endif;
									?>
		  <?php } ?>	              
          <?php if($service_finder_options['upgrade-account-menu']){ ?>
          <div id="upgrade" class="tab-pane fade <?php echo ($tabname == 'upgrade') ? 'in active' : ''; ?> <?php if(!service_finder_check_profile_after_trial_expire($globalproviderid) || !service_finder_check_display_features_after_social_login($globalproviderid)){ echo 'in active'; }?>">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/upgrade/templates/account.php'; ?>
          </div>
          <?php } ?>
        </div>
        <!-- Right part END -->
        </div>
        
        <!-- Provider Section End -->
        <?php }elseif(service_finder_getUserRole($current_user->ID) == 'Customer'){ 
		
		wp_add_inline_script( 'service_finder-js-form-submit', '/*Declare global variable*/
		var addressalert;
		', 'after' );
		$accounturl = service_finder_get_url_by_shortcode('[service_finder_my_account]');
		
		$action = (isset($_GET['action'])) ? $_GET['action'] : '';
		$job_id = (isset($_GET['job_id'])) ? $_GET['job_id'] : '';
		?>
        <nav id="sidebar-admin-wraper">
            <div class="page-logo">
                <?php 
				echo '<a href="'.esc_url(home_url()).'">';
				if(!empty($service_finder_options['myaccount-logo']['url'])){
				echo '<img src="'.esc_url($service_finder_options['myaccount-logo']['url']).'" alt="'.esc_attr(get_bloginfo('name')).'" title="'.esc_attr(get_bloginfo('name')).'">';
				}elseif(!empty($service_finder_options['site-logo']['url'])){
				echo '<img src="'.esc_url($service_finder_options['site-logo']['url']).'" alt="'.esc_attr(get_bloginfo('name')).'" title="'.esc_attr(get_bloginfo('name')).'">';
				}else{
				echo get_bloginfo('name');
				}
				echo '</a>';
				?>
            </div>
            
            <aside  class="side-bar">
                            
                <div class="auther-bx">
                    <div class="auther-pic">
                      <?php if(service_finder_get_user_profile_image($userInfo['avatar_id']) != ""){ ?>
                       <img src="<?php echo esc_url(service_finder_get_user_profile_image($userInfo['avatar_id'])); ?>" alt=""> 
                      <?php } ?>
                    </div>
                    <p><?php echo service_finder_getCustomerName($current_user->ID); ?></p>
                </div>
                
                <div class="admin-nav">
                    <ul>
        <li class="<?php echo ($action == 'my-profile' || $action == '') ? 'active' : ''; ?>">
        <a href="<?php echo esc_url(add_query_arg( array('action' => 'my-profile'), $accounturl )) ?>"><i class="fa fa-user"></i><span class="admin-nav-text"><?php echo (!empty($service_finder_options['label-customer-my-profile'])) ? esc_html($service_finder_options['label-customer-my-profile']) : esc_html__('My Profile', 'service-finder'); ?></span></a>
        </li>
        <?php if(service_finder_check_wallet_system()){ ?>  
        <li class="<?php echo ($action == 'wallet') ? 'active' : ''; ?>"><a href="<?php echo esc_url(add_query_arg( array('action' => 'wallet'), $accounturl )) ?>"><i class="fa fa-money"></i>
          <?php echo (!empty($service_finder_options['label-customer-wallet'])) ? esc_html($service_finder_options['label-customer-wallet']) : esc_html__('Wallet', 'service-finder'); ?>
          </a></li>
        <?php } ?>
                            <?php if($service_finder_options['customer-favorite-menu']){ ?>
        <li class="<?php echo ($action == 'my-favorites') ? 'active' : ''; ?>"><a href="<?php echo esc_url(add_query_arg( array('action' => 'my-favorites'), $accounturl )) ?>"><i class="fa fa-heart"></i>
          <?php echo (!empty($service_finder_options['label-customer-favorites'])) ? esc_html($service_finder_options['label-customer-favorites']) : esc_html__('My Favorites', 'service-finder'); ?>
          </a></li>
        <?php } ?> 
		<?php if($service_finder_options['customer-booking-menu']){ ?>
        <li class="<?php echo ($action == 'bookings') ? 'active' : ''; ?>"><a href="<?php echo esc_url(add_query_arg( array('action' => 'bookings'), $accounturl )) ?>"><i class="fa fa-hand-o-up"></i>
          <?php echo (!empty($service_finder_options['label-customer-bookings'])) ? esc_html($service_finder_options['label-customer-bookings']) : esc_html__('Bookings', 'service-finder'); ?>
          </a></li>
        <?php } ?>  
        <?php if($service_finder_options['customer-schedule-menu']){ ?>
        <li class="<?php echo ($action == 'schedule') ? 'active' : ''; ?>"><a href="<?php echo esc_url(add_query_arg( array('action' => 'schedule'), $accounturl )) ?>"><i class="fa fa-clock-o"></i>
          <?php echo (!empty($service_finder_options['label-customer-schedule'])) ? esc_html($service_finder_options['label-customer-schedule']) : esc_html__('Schedule', 'service-finder'); ?>
          </a></li>
        <?php } ?>    
        <?php if($service_finder_options['customer-invoice-menu']){ ?>
        <li class="<?php echo ($action == 'invoice') ? 'active' : ''; ?>"><a href="<?php echo esc_url(add_query_arg( array('action' => 'invoice'), $accounturl )) ?>"><i class="fa fa-file-text-o"></i>
          <?php echo (!empty($service_finder_options['label-customer-invoice'])) ? esc_html($service_finder_options['label-customer-invoice']) : esc_html__('Invoice', 'service-finder'); ?>
          </a></li>
        <?php } ?>    
           
        <?php if(class_exists( 'WP_Job_Manager' )):?>
        <?php if($service_finder_options['customer-jobpost-menu'] && service_finder_get_url_by_shortcodefortheme('[submit_job_form') != ''){ ?>
        <li><a href="<?php echo esc_url(service_finder_get_url_by_shortcodefortheme('[submit_job_form')) ?>"><i class="fa fa-briefcase"></i>
          <?php echo (!empty($service_finder_options['label-customer-post-job'])) ? esc_html($service_finder_options['label-customer-post-job']) : esc_html__('Post a Job', 'service-finder'); ?>
          </a></li> 
        <?php } ?>   
        <?php if($service_finder_options['customer-myjobs-menu'] && service_finder_get_url_by_shortcodefortheme('[job_dashboard') != ''){ ?>
        <li><a href="<?php echo esc_url(service_finder_get_url_by_shortcodefortheme('[job_dashboard')) ?>"><i class="fa fa-briefcase"></i>
          <?php echo (!empty($service_finder_options['label-customer-my-jobs'])) ? esc_html($service_finder_options['label-customer-my-jobs']) : esc_html__('My Jobs', 'service-finder'); ?>
          </a></li>
        <?php } ?>    
        <?php 
        $jobpostingtype = (!empty($service_finder_options['job-posting-type'])) ? esc_html($service_finder_options['job-posting-type']) : '';
        if($jobpostingtype == 'paid'){
        ?>
        <?php if($service_finder_options['customer-jobpostplans-menu']){ ?>
        <li class="<?php echo ($action == 'job-post-plans') ? 'active' : ''; ?>"><a href="<?php echo esc_url(add_query_arg( array('action' => 'job-post-plans'), $accounturl )) ?>"><i class="fa fa-check-circle-o"></i>
          <?php echo (!empty($service_finder_options['label-customer-job-post-plans'])) ? esc_html($service_finder_options['label-customer-job-post-plans']) : esc_html__('Job Post Plans', 'service-finder'); ?>
          </a></li>    
        <?php } ?>    
        <?php } ?>  
        <?php endif; ?> 
        <?php if($service_finder_options['customer-quotations-menu']){ ?>
        <li class="<?php echo ($action == 'quotations') ? 'active' : ''; ?>"><a href="<?php echo esc_url(add_query_arg( array('action' => 'quotations'), $accounturl )) ?>"><i class="fa fa-check-circle-o"></i>
          <?php echo (!empty($service_finder_options['label-customer-my-quotations'])) ? esc_html($service_finder_options['label-customer-my-quotations']) : esc_html__('My Quotations', 'service-finder'); ?>
          </a></li>  
         <?php } ?> 
    </ul>
                </div>
                
            </aside>
                               
        </nav>
        
        <div id="content">
        <!-- Right part start -->
        <div class="tab-content content-admin-main col-md-91">
          <?php if($action == 'my-profile' || !isset($_GET['action'])):?>
          <div id="my-profile" class="tab-pane fade in active">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/myaccount/templates/customer-account.php'; ?>
          </div>
          <?php endif; ?>
          <?php if(service_finder_check_wallet_system()){ ?>
          <?php if($action == 'wallet'):?>
          <div id="wallet" class="tab-pane fade in active">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/wallet/templates/index.php'; ?>
          </div>
          <?php endif; ?>
          <?php } ?>
		  <?php if($action == 'bookings'):?>
          <div id="bookings" class="tab-pane fade in active">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/bookings/templates/customer-bookings.php'; ?>
          </div>
          <?php endif; ?>
          <?php if($action == 'schedule'):?>
          <div id="schedule" class="tab-pane fade in active schedule-bx">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/schedule/templates/customer-schedule.php'; ?>
          </div>
          <?php endif; ?>
          <?php if($action == 'invoice'):?>
          <div id="invoice" class="tab-pane fade in active">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/invoice/templates/customer-invoice.php'; ?>
          </div>
          <?php endif; ?>
          <?php if($action == 'my-favorites'):?>
          <div id="my-favorites" class="tab-pane fade in active">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/favorites/templates/my-favorites.php'; ?>
          </div>
          <?php endif; ?>
          <?php if($action == 'job-post-plans' && $service_finder_options['job-posting-type'] == 'paid'):?>
          <div id="my-plans" class="tab-pane fade in active">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/jobs/templates/job-post-limits.php'; ?>
          </div>
          <?php endif; ?>
          <?php if($action == 'quotations'):?>
          <div id="quotations" class="tab-pane fade in active">
            <?php require SERVICE_FINDER_BOOKING_FRONTEND_MODULE_DIR . '/get-quote/templates/customer-quotations.php'; ?>
          </div>
          <?php endif; ?>
        </div>
        <!-- Right part END -->
        </div>
        <!-- Customer Section Start -->
        
        <!-- Customer Section End -->
        <?php
		}else{
		echo esc_html__('This provider profile is not found.','service-finder');
		}?>
<?php //get_footer();

