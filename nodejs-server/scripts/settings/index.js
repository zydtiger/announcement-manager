function toggle_input_type(trig, ident) {
    if ($(ident).attr('type') == 'password')
        $(ident).attr('type', 'text')
    else
        $(ident).attr('type', 'password')

    $(trig).toggleClass('fa-eye')
    $(trig).toggleClass('fa-eye-slash')
}


/**
 * handles the input action of passwords
 * @param {string} obj
 */
function pwd_input(obj) {
    $(obj + '-cnt').show()
    $(obj + '-wrap').removeClass('col-md-7 col-xs-12')
    $(obj + '-wrap').addClass('col-md-6 col-xs-10')
    len = $(obj).val().length
    $(obj + '-cnt').text(len + '/' + $(obj).attr('maxlength'))
    if (len > 0) $(obj + '-indi').show()
    else $(obj + '-indi').hide()
}

/**
 * handles the input action of unames
 * @param {string} obj 
 */
function uname_input(obj) {
    $(obj + '-cnt').show()
    $(obj + '-wrap').removeClass('col-md-7 col-xs-12')
    $(obj + '-wrap').addClass('col-md-6 col-xs-10')
    len = $(obj).val().length
    $(obj + '-cnt').text(len + '/' + $(obj).attr('maxlength'))
}

$(() => {
    $('#opwd-cnt, #npwd-cnt, #npwd-1-cnt, #bb-uname-cnt, #bb-pwd-cnt, #pt-uname-cnt, #pt-pwd-cnt, #mb-uname-cnt, #mb-pwd-cnt, #kog-uname-cnt, #kog-pwd-cnt').hide()
    
    $('#pt-lang-switch').val($('#pipeline').text())
    if ($('#chg-pwd').text() == 'true') $('#toggle-pwd-block').show()
    else $('#toggle-pwd-block').hide()
    
    $('#opwd').on('input', () => pwd_input('#opwd'))
    $('#npwd').on('input', () => uname_input('#npwd'))
    $('#npwd-1').on('input', () => pwd_input('#npwd-1'))

    $('#bb-pwd').on('input', () => pwd_input('#bb-pwd'))
    $('#bb-uname').on('input', () => uname_input('#bb-uname'))

    $('#pt-pwd').on('input', () => pwd_input('#pt-pwd'))
    $('#pt-uname').on('input', () => uname_input('#pt-uname'))

    $('#mb-pwd').on('input', () => pwd_input('#mb-pwd'))
    $('#mb-uname').on('input', () => uname_input('#mb-uname'))

    $('#kog-pwd').on('input', () => pwd_input('#kog-pwd'))
    $('#kog-uname').on('input', () => uname_input('#kog-uname'))
})

function submit_form(id) {
    document.getElementsByTagName('form')[id].submit()
}

function toggle_pwd_block() {
    $('#pwd-form-wrap').slideToggle()
}