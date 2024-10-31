<?php
/**
 * @package Provide Live Help
 * @author Provide Live Help
 * @version 1.0.4
 */
/*
Plugin Name: Provide Live Help
Plugin URI: http://providelivehelp.com/en/3rd-party/wordpress
Description: This plugin allows to quickly install the live support chat button on any WordPress website.
Author: Provide Live Help
Version: 1.0.4
Author URI: http://providelivehelp.com
License: GPL2
*/

add_action('init', 'websitechat_init');

function websitechat_init()
{
  add_action('admin_head', 'add_live_chat_head');
  
  add_action('wp_footer', 'add_vt_footer');
  
  register_sidebar_widget('Provide Live Help', 'websitechat_widget');

  register_widget_control('Provide Live Help', 'websitechat_widgetcontrol');
}

function add_vt_footer()
{
  $options = get_option('websitechat');
  
  $vt_code = '';
  
  if (isset($options['websitechat_vt']))
  {
    $vt_code = stripslashes($options['websitechat_vt']);
  }
  
  echo $vt_code;
}

function add_live_chat_head()
{
  if (!preg_match('/widgets\.php$/',$_SERVER['SCRIPT_NAME']))
  {
    return false;
  }
  
  $proto = websitechat_get_proto();

  echo '<link rel="stylesheet" type="text/css" media="screen" href="'.$proto.'://static.ssl7.net/css/extjs/lib/resources/css/ext-all.css" />'."\n";
  echo '<script type="text/javascript" src="'.$proto.'://static.ssl7.net/extjs/lib/adapter/ext/ext-base.js"></script>'."\n";
  echo '<script type="text/javascript" src="'.$proto.'://static.ssl7.net/extjs/lib/ext-all.js"></script>'."\n";
  
  echo '<script type="text/javascript" src="'.trailingslashit( get_bloginfo('wpurl') ).PLUGINDIR.'/'. dirname( plugin_basename(__FILE__) ).'/live_support.js"></script>'."\n";
}

function websitechat_get_proto()
{
  if ((isset($_SERVER['HTTPS']) && (strtolower($_SERVER['HTTPS']) == 'on' || strtolower($_SERVER['HTTPS']) == 1))
    ||
    (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) == 'https')
    )
  return 'https';
  else
  return 'http';
}

function websitechat_widget()
{
  $options = get_option('websitechat',array(
    "websitechat_button" => "Not configured",
    "websitechat_align"  => 'center'
  ));
  
  $button = $options['websitechat_button'];
  $align  = $options['websitechat_align'];
  
  echo '<div style="width: 100%; text-align: '.$align.';">'.stripslashes($button).'</div>';
}

function websitechat_widgetcontrol()
{
  
  $options = get_option('websitechat',array(
    "websitechat_button" => "Not configured",
    "websitechat_align"  => 'center',
    "websitechat_culture"=> 'en',
    "websitechat_vt"     => ''
  ));
  
  if ($_POST["websitechat_submit"])
  {
    $options['websitechat_button']  = $_POST["websitechat_button"];
    $options['websitechat_align']   = $_POST["websitechat_align"];
    $options['websitechat_culture'] = $_POST["websitechat_culture"];
    $options['websitechat_vt']      = $_POST["websitechat_vt"];
    
    update_option('websitechat', $options);
  }
  
  $button = stripslashes($options['websitechat_button']);
  $align  = (isset($options['websitechat_align'])) ? $options['websitechat_align'] : 'center';
  $culture= (isset($options['websitechat_culture'])) ? $options['websitechat_culture'] : 'en';
  $vt = stripslashes($options['websitechat_vt']);
  
  $preview = '';
  
  $m = array();
  if (preg_match('/src="(.*)"/iU',$button,$m))
  {
    $preview = '<img src="'.$m[1].'?t='.time().'" alt="Live Chat Button" />';
  }
  
  if ($preview)
  {
    $description = 'to change your Live Chat button settings.';
  }
  else
  {
    $description = 'to add Live Support Chat button to your WordPress site.';
  }
  
  $proto = websitechat_get_proto();
 
$output=<<<EOD
<p><a href="#" onclick="Ext.ux.LiveSupportAdminApp(); return false;">Click here</a> $description</p>
<input type="hidden" name="websitechat_submit" value="1" />
<input type="hidden" name="websitechat_align" value="$align" />
<input type="hidden" name="websitechat_culture" value="$culture" />
<textarea style="display: none;" name="websitechat_button">$button</textarea>
<textarea style="display: none;" name="websitechat_vt">$vt</textarea>
<div class="x-websitechat_preview" style="margin: 20px 0 20px 0;width: 100%; text-align: $align;">
$preview
</div>
EOD;

  echo $output;
}

?>
