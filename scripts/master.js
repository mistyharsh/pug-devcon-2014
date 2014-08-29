/* global jQuery: true,
    document: true,
    window: true,
    setTimeout: true,
    setInterval: true
*/
(function () {
    "use strict";

    var ModalDialog,
        prefix,
        contentPanel,
        cortanaLoop,
        transitionEndEvent,
        helpIcon;

    jQuery(document).ready(function ($) {

        cortanaLoop.start();

        // Handle cortana keypress event
        $("#cortana-command-input").keyup(function (event) {
            var inputText;

            if (event.keyCode == 13) {
                inputText = $(this).val().trim();
                contentPanel.show(inputText);
            }
        });

        $(".help-icon").on("click", function () {
            ModalDialog.show(helpIcon);
        });

        $(".speaker-list").on("click", ".author-name", function () {
            var data = $(this).data(),
                skeleton = "";

            skeleton = $("<div><div class='help-message'><h3></h3><img /><h4></h4><p class='author-name'></p><p class='author-desc'></p></div><div>");

            skeleton.find("h3").text(data.title);
            skeleton.find("h4").text(data.degn);
            skeleton.find(".author-name").text(data.comp);
            skeleton.find(".author-desc").text(data.desc);

            skeleton.find("img").attr({
                alt: data.title,
                src: data.img
            });

            ModalDialog.show(skeleton.html());

            return false;
        });

        $(".day-selection").on("click", "a", function () {

            var anchor = $(this),
                classToShow = "";

            if(!anchor.hasClass("selected")) {

                $(".day-selection a").toggleClass("selected");

                classToShow = anchor.data("day") === "day1" ? "day1": "day2";

                $(".keynote-list li").hide().filter("." + classToShow).show();
                $(".session .track").hide().filter("." + classToShow).show();
            }

            return false;
        });

        $(".session").on("click", "a", function () {
            var data = $(this).data(),
                skeleton = "";

            skeleton = $("<div><div class='help-message'><h3></h3><h4></h4><p class='author-name'></p><p class='author-desc'></p></div><div>");

            skeleton.find("h3").text(data.name);
            skeleton.find("h4").text(data.speaker);
            skeleton.find(".author-name").text(data.start + " - " + data.end);
            skeleton.find(".author-desc").text(data.description);

            ModalDialog.show(skeleton.html());
            return false;
        });

    });


    ModalDialog = (function ($) {

        var fade = null,
            dialog = null,
            body = null,
            isOpen = false,
            closeButton = null;

        $(function () {
            var dialogEvents = null;

            fade = $(".modal-dialog-fade");
            dialog = fade.find(".modal-dialog");
            body = dialog.find(".body");
            closeButton = dialog.find(".close-button");
            isOpen = false;

            fade.on("click", function () {
                if (isOpen) {
                    ModalDialog.hide();
                }
            });

            dialogEvents = {
                click: function () {
                    return false;
                }
            };

            dialogEvents[transitionEndEvent] = function () {
                if (isOpen === false) {
                    fade.hide();
                }
            };

            dialog.on(dialogEvents);

            closeButton.on("click", function () {
                if (isOpen) {
                    ModalDialog.hide();
                }
            });

        });

        return {

            show: function (content) {
                isOpen = true;
                if (!!content) {
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
            "<li><a href='#' class='panel-link blue'>about</a></li>" +
            "</ol>" +
            "<p>Just type and hit enter</p>" +
            "</div>";

        $(function () {

            $(".modal-dialog").on("click", ".panel-link", function () {
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
            about,
            venue;

        $(function () {
            panel = $(".content-panel");
            items = panel.find(".panel-item");
            sessions = panel.find(".session");
            sponsors = panel.find(".sponsors");
            speakers = panel.find(".speakers");
            venue = panel.find(".venue");
            about = panel.find(".about");

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
            showAbout: function () {
                show(about);
            },
            show: function (text) {
                switch (text) {
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
                case "about":
                    this.showAbout();
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

        function loopThrough() {

            if (!runOnce) {
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
                    'transition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'MozTransition': 'transitionend',
                    'WebkitTransition': 'webkitTransitionEnd'
                };

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }
        return whichTransitionEvent();
    })();

})();

(function ($) {
    "use strict";

    $(document).ready(function () {

        var serverRoot = "http://cognition.net.in/Apps/EventCMS/api/",
            headers = {
                "Auth-Token": "2b38b6af-2243-41f0-afbc-3ff12b779ea2"
            };

        // Get all speakers
        $.when($.ajax({
            url: serverRoot + "AllKeyNoteSpeakers",
            headers: headers
        }), $.ajax({
            url: serverRoot + "AllSpeakers",
            headers: headers
        }))
            .then(function (data1, data2) {

                var data = [],
                    alreadyAdded = [];

                data.push.apply(data, data1[0]);
                data.push.apply(data, data2[0]);

                if (Array.isArray(data)) {
                    var fragment = $(document.createDocumentFragment());

                    data.forEach(function (speaker) {

                        if (alreadyAdded.indexOf(speaker.Id) === -1) {
                            var skeleton = $("<li><div><img/></div><a class='author-name'></a></li>");

                            skeleton.find(".author-name").text(speaker.SpeakerName).attr({
                                title: speaker.SpeakerName,
                                href: "#"
                            }).data({
                                title: speaker.SpeakerName,
                                img: speaker.PhotoUrl,
                                desc: speaker.Description,
                                comp: speaker.CompanyName,
                                degn: speaker.Designation
                            });

                            skeleton.find("img").attr({
                                alt: speaker.SpeakerName,
                                src: speaker.PhotoUrl
                            });

                            fragment.append(skeleton);
                            alreadyAdded.push(speaker.Id);
                        }
                    });

                    $(".panel-item.speakers .loader").remove();
                    $(".speaker-list").append(fragment);
                }
            });

        // Get all sponsors
        $.when($.ajax({
            url: serverRoot + "AllSponsorTypes",
            headers: headers
        }), $.ajax({
            url: serverRoot + "EventSponser",
            headers: headers
        }))
            .then(function (data1, data2) {

                var types = data1[0],
                    typeList = {},
                    sponsors = data2[0],
                    tracks = [],
                    masterFragment = $(document.createDocumentFragment());

                types = ["Platinum", "Gold", "Silver", "Bronze"];
                (types).forEach(function (type) {

                    var list = $("<uL class='track'></ul>").addClass(type);

                    list.append("<li class='track-title'>" + type + "</li>");
                    list.appendTo(masterFragment);
                    typeList[type] = list;
                });

                sponsors.forEach(function (sponsor) {

                    var skeleton = "";

                    if (types.indexOf(sponsor.Type) !== -1) {

                        skeleton = $("<li class='track-item'><a target='_blank'><img /></a></li>").attr("title", sponsor.Name);

                        skeleton.find('img').attr({
                            alt: sponsor.Name,
                            src: sponsor.Logo
                        });

                        skeleton.find("a").attr("href", sponsor.Website);

                        typeList[sponsor.Type].append(skeleton);
                    }
                });
                $(".panel-item.sponsors .loader").remove();
                $(".panel-item.sponsors").append(masterFragment);

            });

        // Get all keynotes
        $.when($.ajax({
            url: serverRoot + "AllKeynote",
            headers: headers
        }))
            .then(function (data) {

                var fragment = $(document.createDocumentFragment()),
                    selectedDay = "";

                data.forEach(function (keynote) {

                    var skeleton = "<li class='track-item'><p><a class='title blue' href='#'></a></p><p class='speaker'></p><p class='time'></p></li>";
                    skeleton = $(skeleton);

                    skeleton.addClass(keynote.Day === "Day 1" ? "day1" : "day2");
                    skeleton.find(".title.blue").text(keynote.SessionName).data({
                        speaker: keynote.allspeeker,
                        start: keynote.StartTime,
                        end: keynote.EndTime,
                        name: keynote.SessionName,
                        description: keynote.Description
                    });
                    skeleton.find(".speaker").text(keynote.allspeeker);
                    skeleton.find(".time").text(keynote.StartTime + " - " + keynote.EndTime);

                    fragment.append(skeleton);
                });

                $(".keynote-list").append(fragment);

                selectedDay = $(".day-selection .selected").data("day");

                $(".keynote-list li").hide().filter("." + selectedDay).show();

            });

        // Get all sessions
        $.when($.ajax({
            url: serverRoot + "AllCategories",
            headers: headers
        }), $.ajax({
            url: serverRoot + "AllSession",
            headers: headers
        }))
            .then(function (data1, data2) {
                var categories = {},
                    selectedDay = "",
                    masterFragment = $(document.createDocumentFragment()),
                    days = {
                        day1: [],
                        day2: []
                    };

                data1 = data1[0];
                data2 = data2[0];

                //Day1 is Developer
                //Day2 is DeveloperDay2
                data1.forEach(function(category) {
                    var shouldBeAdded = false;
                    if(typeof category.TrackName === "string" && category.TrackName.indexOf("Keynote") === -1) {
                        if(category.TrackName.indexOf("2") !== -1 && Object.keys(days.day2).length < 3) {
                            shouldBeAdded = "day2";
                        } else if (Object.keys(days.day1).length < 3) {
                            shouldBeAdded = "day1";
                        }

                        if(shouldBeAdded !== false) {
                            days[shouldBeAdded].push(category.CategoryName);
                            categories[category.CategoryName] = $("<ul class='track'><li class='track-title'>" + category.CategoryName + "</li></ul>");
                            categories[category.CategoryName].addClass(shouldBeAdded);
                            masterFragment.append(categories[category.CategoryName]);
                        }
                    }
                });

                data2.forEach(function (session) {
                    var skeleton = "<li class='track-item'><p><a class='title blue' href='#'></a></p><p class='speaker'></p><p class='time'></p></li>";

                    if(session.CategoryName in categories) {
                        skeleton = $(skeleton);

                        skeleton.find(".title.blue").text(session.SessionName).data({
                            speaker: session.allspeeker,
                            start: session.StartTime,
                            end: session.EndTime,
                            name: session.SessionName,
                            description: session.Description
                        });
                        skeleton.find(".speaker").text(session.allspeeker);
                        skeleton.find(".time").text(session.StartTime + " - " + session.EndTime);

                        categories[session.CategoryName].append(skeleton);

                    }

                });

                $(".panel-item.session .loader").remove();
                $(".session").append(masterFragment);

                selectedDay = $(".day-selection .selected").data("day");
                $(".session .track").hide().filter("." + selectedDay).show();
            });

    });


    return {};

})(jQuery);
