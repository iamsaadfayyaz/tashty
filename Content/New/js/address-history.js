  $('.order-options tr').click(function() {
     $(this).children('td').children('input').prop('checked', true);
      
      $('.order-options tr').removeClass('selected');
      $(this).toggleClass('selected');
    
    });