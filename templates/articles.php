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

global $current_user;
	
$args = array(
	'post_type' 	=> 'sf_articles',
	'post_status' 	=> 'publish',
	'posts_per_page' => 5,
	'order' => 'DESC',
	'author' => $author,
);
$the_query = new WP_Query( $args );

if ( $the_query->have_posts() ) {
echo '<ul class="sf-ques-ans-list clearfix">';
while( $the_query->have_posts() ) : $the_query->the_post();
global $post;
?>
<li>
	<div class="sf-ques-area">
		<div class="sf-ques-ans-author"><img src="<?php echo service_finder_get_avatar_by_userid($post->post_author); ?>" alt=""></div>
		<div class="sf-ques-has"><a href="<?php echo get_permalink(); ?>" target="_blank"><?php echo get_the_title(); ?></a></div>
		<div class="sf-ques-has-desc"><?php the_excerpt(); ?></div>
		<div class="sf-ques-ans-meta">
			<span class="sf-ques-meta-col sf-qa-vote"><i class="fa fa-calendar-o"></i> <?php echo get_the_date( 'M j, Y', $post->ID ); ?></span>
			<span class="sf-ques-meta-col sf-qa-hour"><i class="fa fa-clock-o"></i> <?php printf( __( '%s ago', 'service-finder' ), human_time_diff( get_post_time( 'U' ), time() ) ); ?></span>
		</div>
	</div>
</li>
<?php

endwhile;
wp_reset_postdata();
$authorlink = service_finder_get_author_url($author);
$url = add_query_arg( array('morearticles' => "true"), $authorlink );
echo '</ul>';
echo '<div class="padding-t-20 text-center"><a href="'.esc_url($url).'" target="_blank" class="btn btn-primary">'.esc_html__('More from this provider', 'service-finder').'</a></div>';
}else{
echo '<div class="sf-nodata-dark">'.esc_html__('No data available.', 'service-finder').'</div>';
}

?>
