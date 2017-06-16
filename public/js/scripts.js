  $(document).ready(function() {
    (function() {
        [].slice.call(document.querySelectorAll('.tabs')).forEach(function(el) {
            new CBPFWTabs(el);
        });
    })();
    $('#main-nav').sidr();
    $('#fullpage').fullpage({
        'verticalCentered': true,
        'easing': 'easeInOutCirc',
        'css3': false,
        'scrollingSpeed': 900,
        'slidesNavigation': true,
        'slidesNavPosition': 'bottom',
        'easingcss3': 'ease',
        'navigation': true,
        'anchors': ['Home', 'Features', 'About', 'Video', 'Clients', 'Screenshots', 'Pricing', 'Download', 'Contact'],
        'navigationPosition': 'left'
    });
    $('.screenshots-content, .clients-content').css('height', $(window).height());

    // CONTACT FORM

  
$(document).mouseup(function (e) {
    if ($(".sidr-open ")[0]){
    var container = $("#sidr");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $.sidr('close', 'sidr');
    }}
});


$('.sidr ul li a').on('click tap',function(){
        $.sidr('close', 'sidr');
});                         

 
$('#contact-form').submit(function(e){
    e.preventDefault();
    $(this).find('#success').html('Sending mail');
    
    $.ajax({
       type: "POST",
       url: 'sendmail.php',
       data: $("#contact-form").serialize(), // serializes the form's elements.
       success: function(data)
       {
           if(data==1){
                $('#contact-form').find('#success').html('Thanks for your message , we will back with you soon.');
           }else{
                $('#contact-form').find('#success').html('Send mail failed');
           }
       }
    });
 
});
 



  });
  jQuery(window).load(function() {
    jQuery('#preloader').fadeOut();
  });
