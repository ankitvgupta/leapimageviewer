     $(window).load(function () {

     
        // These functions are from the thumbscroller library that loads images along the bottom
        // See the design sheet for the url where the library can be found in more detail
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

      });