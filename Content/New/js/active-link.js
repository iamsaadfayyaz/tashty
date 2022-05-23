
	$( '#topheader .main-menu a' ).on( 'click', function () {
	$( '#topheader .main-menu' ).find( 'li.active' ).removeClass( 'active' );
	$( this ).parent( 'li' ).addClass( 'active' );
});
