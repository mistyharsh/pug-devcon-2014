/* global jQuery: true,
    document: true,
    window: true
*/

jQuery(document).ready(function ($) {
    "use strict";

    setTimeout(function () {

        $("#cortana-loader div")
            .removeClass("fast-loop")
            .addClass("slow-loop");

        //ModalDialog.show();

    }, 4000);


    $("#cortana-command-input").keyup(function(event){
        if(event.keyCode == 13){
            ModalDialog.show();
        }
    });

});

var ModalDialog = (function ($) {
    "use strict";

    var skeleton = "<div class='modal-dialog-fade'><div class='modal-dialog'></div></div>/",
        fade = $(skeleton),
        dialog = fade.find(".modal-dialog");

    fade.on("click", function () {
        ModalDialog.hide();
    });

    dialog.on({
        webkitTransitionEnd: function () {
            if(!dialog.hasClass("active")) {
                fade.hide();
            }
        },
        click: function () {
            return false;
        }
    });

    $(function() {
        $(document.body).append(fade);
    });

    return {

        show: function (body) {
            dialog.html(body || "");
            fade.show();

            setTimeout(function () {
                dialog.addClass("active");
            }, 120);
        },

        hide: function () {
            dialog.removeClass("active");
        }

    };


})(jQuery);

var prefix = (function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

    return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
    };

})();
