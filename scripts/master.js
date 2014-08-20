/* global jQuery: true,
    document: true,
    window: true,
    setTimeout: true,
    setInterval: true
*/
(function () {

    var ModalDialog,
        prefix,
        contentPanel,
        cortanaLoop,
        transitionEndEvent,
        helpIcon;

    jQuery(document).ready(function ($) {
        "use strict";

        cortanaLoop.start();

        // Handle cortana keypress event
        $("#cortana-command-input").keyup(function(event) {
            var inputText;

            if (event.keyCode == 13) {
                inputText = $(this).val().trim();
                contentPanel.show(inputText);
            }
        });

        $(".help-icon").on("click", function () {
            ModalDialog.show(helpIcon);
        });

    });


    ModalDialog = (function ($) {
        "use strict";

        var fade = null,
            dialog = null,
            body = null,
            isOpen = false,
            closeButton = null;

        $(function() {
            var dialogEvents = null;

            fade = $(".modal-dialog-fade");
            dialog = fade.find(".modal-dialog");
            body = dialog.find(".body");
            closeButton = dialog.find(".close-button");
            isOpen = false;

            fade.on("click", function () {
                if(isOpen) {
                    ModalDialog.hide();
                }
            });

            dialogEvents = {
                click: function () {
                    return false;
                }
            };

            dialogEvents[transitionEndEvent] = function () {
                if(isOpen === false) {
                    fade.hide();
                }
            };

            dialog.on(dialogEvents);

            closeButton.on("click", function() {
                if(isOpen) {
                    ModalDialog.hide();
                }
            });

        });

        return {

            show: function (content) {
                isOpen = true;
                if(!!content) {
                    body.html(content);
                }
                fade.show();

                setTimeout(function () {
                    dialog.addClass("active");
                }, 120);
            },

            hide: function () {
                isOpen = false;
                dialog.removeClass("active");
            }

        };


    })(jQuery);

    prefix = (function () {
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

    helpIcon = (function ($) {
        var skeleton = "<div class='help-message'>" +
                            "<h3>Cortana accepts following commands.</h3>" +
                            "<ol>" +
                                "<li><a href='#' class='panel-link blue'>sessions</a></li>" +
                                "<li><a href='#' class='panel-link blue'>sponsors</a></li>" +
                                "<li><a href='#' class='panel-link blue'>speakers</a></li>" +
                                "<li><a href='#' class='panel-link blue'>venue</a></li>" +
                            "</ol>" +
                            "<p>Just type and hit enter</p>" +
                        "</div>";

        $(function () {

            $(".modal-dialog").on("click", ".panel-link", function() {
                var anchor = $(this);

                $("#cortana-command-input").val(anchor.text());
                ModalDialog.hide();
                contentPanel.show(anchor.text());

                return false;
            });

        });


        return skeleton;

    })(jQuery);

    contentPanel = (function ($) {

        var panel,
            items,
            sessions,
            sponsors,
            speakers,
            venue;

        $(function () {
            panel = $(".content-panel");
            items = panel.find(".panel-item");
            sessions = panel.find(".session");
            sponsors = panel.find(".sponsors");
            speakers = panel.find(".speakers");
            venue = panel.find(".venue");

            items.on(transitionEndEvent, function () {
                if (!$(this).hasClass("active")) {
                    $(this).hide();
                }
            });
        });

        function show(panelObject) {
            hide();
            panelObject.show();
            setTimeout(function () {
                panelObject.addClass("active");
            }, 120);
        }

        function hide() {
            panel.find(".active").removeClass("active");
        }

        return {
            showSessions: function () {
                show(sessions);
            },
            showSponsors: function () {
                show(sponsors);
            },
            showSpeakers: function () {
                show(speakers);
            },
            showVenue: function () {
                show(venue);
            },
            show: function (text) {
                switch(text) {
                    case "sessions":
                        this.showSessions();
                        break;
                    case "sponsors":
                        this.showSponsors();
                        break;
                    case "speakers":
                        this.showSpeakers();
                        break;
                    case "venue":
                        this.showVenue();
                        break;
                }
            },
            hide: hide
        };

    })(jQuery);

    cortanaLoop = (function ($) {
        var options = ["fast-loop", "slow-loop", "medium-loop"],
            runOnce = false,
            index = 0;

        function loopThrough () {

            if(!runOnce) {
                runOnce = true;
                setInterval(function () {
                    $("#cortana-loader div")
                        .removeClass(options[index])
                        .addClass(options[index = (index + 1) % 3]);
                }, 8000);
            }
        }

        return {
            start: loopThrough
        };

    })(jQuery);

    transitionEndEvent = (function () {
        function whichTransitionEvent() {
            var t,
                el = document.createElement('div'),
                transitions = {
                'transition':'transitionend',
                'OTransition':'oTransitionEnd',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            };

            for(t in transitions) {
                if( el.style[t] !== undefined ){
                    return transitions[t];
                }
            }
        }
        return whichTransitionEvent();
    })();

})();
