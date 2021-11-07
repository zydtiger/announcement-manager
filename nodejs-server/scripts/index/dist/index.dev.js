"use strict";

$(function () {
  var todo_lists = new Vue({
    el: '#todo-lists',
    delimiters: ['${', '}'],
    data: {
      lists: [// 'hello',
      {
        title: 'Hello',
        percent: 90
      }]
    },
    methods: {
      add_list: function add_list() {}
    }
  });
  var announcements = new Vue({
    el: '#announcement',
    data: {
      bb_submenu: false
    },
    methods: {
      chg_content: function chg_content(target) {
        $('iframe').attr('src', "/announce?target=".concat(target));
        if (is_small_screen()) hide_menu();
      },
      chg_content_url: function chg_content_url(url) {
        // $('iframe').attr('src', url)
        location.href = url; // if (is_small_screen()) hide_menu()
      },
      expand: function expand(obj, evt) {
        var target = $(evt.target)[0].tagName === 'SPAN' ? $(evt.target).parent() : $(evt.target);

        if (!this.bb_submenu) {
          $(obj).slideDown(250);
          target.children('.fa').css('transform', 'rotate(90deg)');
          this.bb_submenu = true;
        } else {
          $(obj).slideUp(250);
          target.children('.fa').css('transform', 'rotate(0deg)');
          this.bb_submenu = false;
        }
      }
    }
  });
  $('.submenu').hide();
});
window.onload = adjust_menu;
window.onresize = adjust_menu;

function is_small_screen() {
  var bw = document.body.clientWidth; // console.log(bw)

  return bw <= 992;
}

function adjust_menu() {
  if (is_small_screen()) {
    hide_menu();
    chg_arrow();
  } else show_menu();
}

function chg_arrow() {
  $('#toggle-menu .fa').toggleClass('fa-arrow-right fa-arrow-left');
}

function hide_menu() {
  $('.main').css('left', '-250px');
  $('iframe').css('left', '0');
  $('iframe').css('width', '100vw');
  $('.hide-menu').hide();
}

function show_menu() {
  $('.main').css('left', '0');

  if (!is_small_screen()) {
    $('iframe').css('left', '250px');
    $('iframe').css('width', 'calc(100vw - 250px)');
  }
}

function toggle_menu() {
  var toggle_class = $('#toggle-menu .fa').attr('class');

  if (toggle_class.indexOf('fa-arrow-left') != -1) {
    hide_menu();
  } else {
    show_menu();
    if (is_small_screen()) $('.hide-menu').show();
  }

  chg_arrow();
}