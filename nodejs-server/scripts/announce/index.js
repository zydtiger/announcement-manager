var list, cnt = 0

function synchro() {
    let target = $('#pipeline').text()
    list.announcements = []
    $('.alert').show()
    $('#refresh-spinner').show()
    $.ajax({
        url: `/sync?target=${target}`,
        success: function (data) {
            console.log(data)
            location.reload()
        },
        error: function (err) {
            console.error(err)
            alert('You failed to synchronize, plz check your account')
        }
    })
}

function redir_original() {
    window.open($('#original-url').text())
}

function redir_homepage() {
    window.open($('#base-url').text())
}

$(() => {
    $('.alert').hide()
    $('#refresh-spinner').hide()

    list = new Vue({
        el: '#list',
        delimiters: ['${', '}'],
        data: {
            announcements: [],
        }
    })

    let type = $('#pipeline').text()
    $.ajax({
        url: `/buf?target=${type}&page=0`,
        success: function (data) {
            // console.log(JSON.parse(data))
            list.announcements = JSON.parse(data).body
        },
        error: function (err) {
            console.log(err)
            synchro()
        }
    })
})

function onscroll_handler() {
    if (within_range(get_scrolltop() + get_clientheight(), get_scrollheight(), 5)) {
        // console.log('HEYHEYHEY')
        $('#refresh-spinner').slideDown()

        window.onscroll = undefined

        let type = $('#pipeline').text()
        cnt += 10
        $.ajax({
            url: `/buf?target=${type}&page=${cnt}`,
            success: function (data) {
                let data_json = JSON.parse(data)
                // console.log(data_json)
                if (data_json.head == 'new') {
                    list.announcements = list.announcements.concat(data_json.body)
                    window.onscroll = onscroll_handler
                } else {
                    $('#stop-label').text(data_json.body)
                }
                $('#refresh-spinner').hide()
            }
        })
    }
}

// scrolling handler
window.onscroll = onscroll_handler

