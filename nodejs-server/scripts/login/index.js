function switch_block() {
    $('#login').toggle()
    $('#signup').toggle()
}

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
    $(obj + '-wrap').removeClass('col-lg-12 col-md-7 col-xs-12')
    $(obj + '-wrap').addClass('col-lg-10 col-md-6 col-xs-10')
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
    $(obj + '-wrap').removeClass('col-lg-12 col-md-7 col-xs-12')
    $(obj + '-wrap').addClass('col-lg-10 col-md-6 col-xs-10')
    len = $(obj).val().length
    $(obj + '-cnt').text(len + '/' + $(obj).attr('maxlength'))
}

$(() => {
    if ($('#login-err-msg').text()) $('#login-err-msg').show()
    else $('#login-err-msg').hide()

    if ($('#signup-err-msg').text()) $('#signup-err-msg').show()
    else $('#signup-err-msg').hide()

    $('#signup').hide()
    if ($('#pipeline').text() == 'signup') switch_block()

    // hide the eye indicator
    $('i.fa').hide()
    $('#signup-uname-cnt, #signup-pwd-cnt, #login-uname-cnt, #login-pwd-cnt').hide()

    $('#login-pwd').on('input', () => pwd_input('#login-pwd'))
    $('#login-uname').on('input', () => uname_input('#login-uname'))

    $('#signup-pwd').on('input', () => pwd_input('#signup-pwd'))
    $('#signup-uname').on('input', () => uname_input('#signup-uname'))
    $('#signup-pwd-1').on('input', () => pwd_input('#signup-pwd-1'))
})

function signup_submit() {
    let uname = $('#signup-uname').val()
    let pwd = $('#signup-pwd').val()
    let pwd_confirm = $('#signup-pwd-1').val()

    // console.log(pwd, pwd_confirm)

    if (!uname) {
        $('#signup-err-msg').show()
        $('#signup-err-msg').text('Please enter username!')
    } else if (!pwd) {
        $('#signup-err-msg').show()
        $('#signup-err-msg').text('Please enter password!')
    } else {
        if (pwd === pwd_confirm)
            document.getElementById('signup-form').submit()
        else {
            $('#signup-err-msg').text('Passwords do not match!')
            $('#signup-err-msg').show()
        }
    }
}