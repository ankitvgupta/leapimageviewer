var sidebaropen = 0;
 var images = [
    "http://wp.streetwise.co/wp-content/uploads//2013/08/1.-Harvard.jpg",
    "http://www.fas.harvard.edu/~memhall/images2/annen2.jpg",
    "http://mbadventure.files.wordpress.com/2011/05/harvard-birds-eye.jpg",
    "http://i2.cdn.turner.com/money/2010/09/27/pf/harvard_business_school.fortune/harvard_business_school.gi.top.jpg"];
function refresher() {
 
        console.log("entering refresher");
        sliderLeft=$('#thumbScroller .container').position().left;
        padding=$('#outer_container').css('paddingRight').replace("px", "");
        sliderWidth=$(window).width()-padding;
        $('#thumbScroller').css('width',sliderWidth);
        var totalContent=0;
        $('#thumbScroller .content').each(function () {
          totalContent+=$(this).innerWidth();
          $('#thumbScroller .container').css('width',totalContent);
        });
        $('#thumbScroller').mousemove(function(e){
          if($('#thumbScroller  .container').width()>sliderWidth){
            var mouseCoords=(e.pageX - this.offsetLeft);
            var mousePercentX=mouseCoords/sliderWidth;
            var destX=-(((totalContent-(sliderWidth))-sliderWidth)*(mousePercentX));
            var thePosA=mouseCoords-destX;
            var thePosB=destX-mouseCoords;
            var animSpeed=600; //ease amount
            var easeType='easeOutCirc';
            if(mouseCoords==destX){
              $('#thumbScroller .container').stop();
            }
            else if(mouseCoords>destX){
              //$('#thumbScroller .container').css('left',-thePosA); //without easing
              $('#thumbScroller .container').stop().animate({left: -thePosA}, animSpeed,easeType); //with easing
            }
            else if(mouseCoords<destX){
              //$('#thumbScroller .container').css('left',thePosB); //without easing
              $('#thumbScroller .container').stop().animate({left: thePosB}, animSpeed,easeType); //with easing
            }
          }
        });
        $('#thumbScroller  .thumb').each(function () {
          $(this).fadeTo(fadeSpeed, 0.6);
        });
        var fadeSpeed=200;
        $('#thumbScroller .thumb').hover(
        function(){ //mouse over
          $(this).fadeTo(fadeSpeed, 1);
        },
        function(){ //mouse out
          $(this).fadeTo(fadeSpeed, 0.6);
        }
      );
      }

function upload()
  {
      var url = document.getElementById('input').value;
      console.log("upload attempted, " + url);
      images.push(url);
      console.log(images);
      var htmls = "";

        for(var g = 0; g < images.length; g++)
        {
            htmls += "<div class=\"content\"><div><a href=\"#\"><img src=\""; 
            htmls += images[g]; 
            htmls += "\" alt=\"images/";
            htmls += g+1;
            htmls += ".jpg\" class=\"thumb\" /></a></div></div>";

          
        }
        console.log(htmls);
        $(".container").html(htmls);
      redoimages();
      refresher();
      return false;

  }
function redoimages() {

              
         $('img').bind('click', function () {
  $('#pan img').attr('src', $(this).attr('src'));
  });
        //current thumb's index being viewed
        var current     = -1;
        //cache some elements
        var $btn_thumbs = $('#fp_thumbtoggle');
        var $loader   = $('#fp_loading');
        var $btn_next   = $('#fp_next');
        var $btn_prev   = $('#fp_prev');
        var $thumbScroller  = $('#thumbScroller');
        
        //total number of thumbs
        var nmb_thumbs    = $thumbScroller.find('.content').length;
        
        //preload thumbs
        var cnt_thumbs    = 0;
        for(var i=0;i<nmb_thumbs;++i){
          var $thumb = $thumbScroller.find('.content:nth-child('+parseInt(i+1)+')');
          $('<img/>').load(function(){
            ++cnt_thumbs;
            if(cnt_thumbs == nmb_thumbs)
        //display the thumbs on the bottom of the page
        showThumbs(2000);
          }).attr('src',$thumb.find('img').attr('src'));
        }
        
        
        //make the document scrollable
        //when the the mouse is moved up/down
        //the user will be able to see the full image
        makeScrollable();
        
        
        //clicking on the "show thumbs"
        //displays the thumbs container and hides
        //the navigation arrows
        $btn_thumbs.bind('click',function(){
          showThumbs(500);
          hideNav();
        });
        
        function hideThumbs(){
          $('#outer_container').stop().animate({'bottom':'-160px'},500);
          showThumbsBtn();
        }

        function showThumbs(speed){
          $('#outer_container').stop().animate({'bottom':'0px'},speed);
          hideThumbsBtn();
        }
        
        function hideThumbsBtn(){
          $btn_thumbs.stop().animate({'bottom':'-50px'},500);
        }

        function showThumbsBtn(){
          $btn_thumbs.stop().animate({'bottom':'0px'},500);
        }

        function hideNav(){
          $btn_next.stop().animate({'right':'-50px'},500);
          $btn_prev.stop().animate({'left':'-50px'},500);
        }

        function showNav(){
          $btn_next.stop().animate({'right':'0px'},500);
          $btn_prev.stop().animate({'left':'0px'},500);
        }

        //events for navigating through the set of images
        $btn_next.bind('click',showNext);
        $btn_prev.bind('click',showPrev);
        
        //the aim is to load the new image,
        //place it before the old one and fadeOut the old one
        //we use the current variable to keep track which
        //image comes next / before
        function showNext(){
          ++current;
          var $e_next = $thumbScroller.find('.content:nth-child('+current+')');
          if($e_next.length == 0){
            current = 1;
            $e_next = $thumbScroller.find('.content:nth-child('+current+')');
          }
          
        }
        
        function showPrev(){
          --current;
          var $e_next = $thumbScroller.find('.content:nth-child('+current+')');
          if($e_next.length == 0){
            current = nmb_thumbs;
            $e_next = $thumbScroller.find('.content:nth-child('+current+')');
          }
        
        }
        
                function makeScrollable(){
          $(document).bind('mousemove',function(e){
            var top = (e.pageY - $(document).scrollTop()/2) ;
            $(document).scrollTop(top);
                    });
        }}


  $(document).ready(function () {




        function initPanZoom() {
          $('#pan img').panZoom({
        'zoomIn'   : $('#zoomin'),
        'zoomOut' : $('#zoomout'),
        'panUp'  :$('#panup'),
        'panDown':$('#pandown'),
        'panLeft':$('#panleft'),
        'panRight':$('#panright'),
            'fit'       :   $('#fit'),
            'destroy'   :   $('#destroy'),
            'out_x1'    :   $('#x1'),
            'out_y1'    :   $('#y1'),
            'out_x2'    :   $('#x2'),
            'out_y2'    :   $('#y2'),
            'directedit':   true,
            'debug'     :   false
          });
        };

        initPanZoom();

  // init the image switcher
  $('img').bind('click', function () {
  $('#pan img').attr('src', $(this).attr('src'));
  });

        // init the init button (for testing destroy/recreate)
        $('#reinit').bind('click', function (event) {
          if ($('#pan img').data('panZoom')) {
            alert('Click destroy before trying to re-initialise panZoom');
            return;
          }
          event.preventDefault();
          initPanZoom();
        });
 
  });
