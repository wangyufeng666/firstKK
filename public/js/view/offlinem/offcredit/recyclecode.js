$().ready(function(){
	var inquiryId = $('#inquiryId').val();
	var spId = $('#spId').val();
	var salt = $('#salt').val();
	var promoCode = $('#promoCode').val();
	var partnerCode = $('#partnerCode').val();
	var mobile = $('#mobile').val();
	var promoName = $('#promoName').val();
	var url = $('#qrcod').attr('data-url');
	var params = '?spid='+spId+'&salt='+salt+'&inquiryId='+inquiryId+'&promoCode='+promoCode+'&partnerCode='+partnerCode;
	params +='&mobile='+mobile+'&promoName='+promoName;
	var text = 'http://'+url+params;
	$('#qrcod').qrcode(utf16to8(text));
});

function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
