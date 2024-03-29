<?php

/*****************************************************************************

*

*	copyright(c) - aonetheme.com - Service Finder Team

*	More Info: http://aonetheme.com/

*	Coder: Service Finder Team

*	Email: contact@aonetheme.com

*

******************************************************************************/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

get_header();

$wpdb = service_finder_plugin_global_vars('wpdb');

$service_finder_Params = service_finder_plugin_global_vars('service_finder_Params');

$service_finder_options = get_option('service_finder_options');

$socialsignupwith = (!empty($service_finder_options['social-signup-with'])) ? esc_html($service_finder_options['social-signup-with']) : 'nextend-social-login';



wp_add_inline_script( 'service_finder-js-registration', '/*Declare global variable*/

var formtype = "login"; var selectedpackage;', 'after' );

?>

<!-- Login Template -->
<?php 

		$display_title = get_post_meta(get_the_id(), '_display_title', true);

        if(!is_user_logged_in()){

        echo '<div class="padding-20  margin-b-30  bg-white sf-rouned-box clearfix loginform_dx_outer">

		<div class="loginform_dx row">';

          echo '<form class="loginform_page" method="post">

            <div class="col-md-12">

              <div class="form-group">

                <div class="input-group"> <i class="input-group-addon fa fa-user"></i>

                  <input name="login_user_phone" type="text" class="form-control" placeholder="'.esc_html__('Numer telefonu', 'service-finder').'">

                </div>

              </div>

            </div>

            <div class="col-md-12">

              <div class="form-group">

                <div class="input-group"> <i class="input-group-addon fa fa-lock"></i>

                  <input name="login_password" type="password" class="form-control" placeholder="'.esc_html__('Hasło', 'service-finder').'">

                </div>

              </div>

            </div>

            <div class="col-md-12">

              <div class="form-group">

                <input type="submit" class="btn btn-primary btn-block" name="user-login" value="'.esc_html__('Login', 'service-finder').'" />

              </div>

            </div>

            <div class="col-md-12 text-center"> <small><a href="'.esc_url(home_url('/signup/')).'" >

              '.esc_html__("Nie posiadasz jeszcze konta?", 'service-finder').'

              </a> | <a href="javascript:;" class="fp_bx">

              '.esc_html__('Zapomniałem hasła', 'service-finder').'

              </a></small> </div>

          </form>';

		?>
		<div class="sf-otherlogin-wrap">
          <div class="col-md-6">
          <?php 
          if(class_exists('aonesms'))
          {
            echo do_shortcode('[aonesms_otp_login_signup]');
          }
          ?>
          </div>
          <div class="col-md-6 sf-nextend-center">
          <?php
		  if($socialsignupwith == 'nextend-social-login') 
		  {
			  if(class_exists('NextendSocialLogin'))
			  {
				echo do_shortcode('[nextend_social_login]');
			  }
		  }elseif($socialsignupwith == 'wordpress-social-login')
		  {
			  if(function_exists('wsl_activate'))
			  {
				echo do_action( 'wordpress_social_login' );
			  }
		  }
		  ?>
          </div>
        </div>
		<?php  

        echo '</div></div>';

		

        echo '<div class="forgotpasswordform_dx hidden">';

        if(class_exists( 'ReduxFrameworkPlugin' )){

		if($service_finder_options['show-page-title']){

		if($display_title){ 

			echo '<h4>'.esc_html__('Zapomniałem hasła','service-finder').'</h4>';

		}

		}

		}else{

			echo '<h4>'.esc_html__('Zapomniałem hasła','service-finder').'</h4>';

		}

          echo '<form class="forgotpassform_page" method="post">

            <div class="col-md-12">

              <div class="form-group">

                <div class="input-group"> <i class="input-group-addon fa fa-user"></i>

                  <input name="fp_user_login" type="text" class="form-control" placeholder="'.esc_html__('Nazwa użytkownika lub E-mail:', 'service-finder').'">

                </div>

              </div>

            </div>

            <div class="col-md-12">

              <div class="form-group">

                <input type="hidden" name="action" value="resetpass" />

                <input type="submit" class="btn btn-primary btn-block" name="user-login" value="'.esc_html__('Otrzymaj nowe hasło', 'service-finder').'" />

              </div>

            </div>

            <div class="col-md-12 text-center"> <small><a href="'.esc_url(home_url('/signup/')).'" class="regform">

              '.esc_html__("Nie posiadasz jeszcze konta?", 'service-finder').'

              </a> | <a href="javascript:;" class="lg_bx">

              '.esc_html__('Jesteś już zarejestrowany?', 'service-finder').'

              </a></small> </div>

          </form>';

        echo '</div>';

        }else{ 

          echo '<p>'.esc_html__('Jesteś już zalogowany.','service-finder').'</p>';

		  } 

?>
