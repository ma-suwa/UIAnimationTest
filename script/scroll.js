window.addEventListener('load', function(){
    window.addEventListener('scroll', function(){
      var elementList = document.querySelectorAll('.item');
      for (var i = 0; i < elementList.length; i++) {
        var element = elementList[i];
        var rect = element.getBoundingClientRect();//要素の絶対座標
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var imgPos = rect.top + scrollTop;
        var windowHeight = window.innerHeight;
        var scroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (scroll > imgPos - windowHeight + windowHeight/5) {
          element.classList.add('effect');
        }else{
          element.classList.remove('effect');
        }
      }
    });
  });