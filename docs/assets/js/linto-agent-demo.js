window.onload = function() {
  // Coffee machine Snap Init
    var s = Snap('#coffe-machine-svg'),
        p = 100 / 30,
        h = 250,
        x = 400,
        y = 200,
        R = 100,
        r = 70,
        open = 0,
        gstream,
        gmilk = "l()#F4EEE6-#fff:50-#F4EEE6:50-#F4EEE6",
        gcoffee = "l()#60544F-#8c7a73:50-#60544F:50-#60544F",
        gwater = "l()#B4D6DB-#D6EDEE:50-#B4D6DB:50-#B4D6DB";

    Snap.load("/assets/img/coffee-machine.svg", function(f) {
        var top = f.select("#top"),
            bot = f.select("#bottom"),
            tap = f.select("#tap"),
            knob = f.select("#knob"),
            dot = f.select("#dot"),
            arr = f.select("#arrow"),
            knobcx = knob.attr("cx"),
            knobcy = knob.attr("cy"),
            lead = f.select("#lead"),
            pie = {
                cx: f.select("#pie-chart circle").attr("cx"),
                cy: f.select("#pie-chart circle").attr("cy"),
                r: f.select("#pie-chart circle").attr("r"),
                coffee: f.select("#legend text"),
                water: f.selectAll("#legend text")[1],
                title: f.selectAll("#legend text")[2],
                waterBox: f.select("#legend rect:nth-child(2)")
            },
            angle = 0,
            lastAngle,
            startAngle,
            leadOpenPath = lead.attr("d"),
            leadClosedPath = f.select("#lead-target").attr("d"),
            closed,
            grp = s.g().insertBefore(tap);
        f.select("#pie-chart").remove();
        f.select("#americano-area").click(function() {
            chosen(0);
        });
        f.select("#latte-area").click(function() {
            chosen(72);
        });
        f.select("#mocha-area").click(function() {
            chosen(144);
        });
        f.select("#mochiatto-area").click(function() {
            chosen(216);
        });
        f.select("#espresso-area").click(function() {
            chosen(288);
        });
        x = +top.attr("cx");
        y = +top.attr("cy");
        R = +top.attr("rx");
        r = +bot.attr("rx");
        h = bot.attr("cy") - y;
        s.add(f.select("g"));
        lead.click(function() {
            var path,
                ease;
            if (closed) {
                path = leadOpenPath;
                ease = mina.easein;
                closed = 0;
            } else {
                path = leadClosedPath;
                ease = mina.bounce;
                closed = 1;
            }
            lead.stop().animate({
                d: path
            }, 1000, ease);
        });
        knob.attr({
            fill: "#000",
            opacity: 0
        }).drag(function(dx, dy, x, y) {
            var a = Snap.angle(knobcx, knobcy, x, y) - startAngle + angle;
            dot.transform("r" + [a, knobcx, knobcy]);
            arr.transform("r" + [a, knobcx, knobcy]);
            lastAngle = a;
        }, function(x, y) {
            startAngle = Snap.angle(knobcx, knobcy, x, y);
            lastAngle = angle;
            dot.stop();
            arr.stop();
        }, function() {
            angle = lastAngle;
            var a = Snap.snapTo(72, angle, 36);
            chosen(a);
        });

        function chosen(a) {
            a = (a + 1080) % 360;
            angle = a;
            var to = "r" + [a, knobcx, knobcy];
            dot.animate({
                transform: to
            }, 1000, mina.elastic);
            arr.animate({
                transform: to
            }, 1000, mina.elastic, function() {
                closeCup(function() {
                    types[a]();
                    pour();
                    pieShow();
                });
            });
        }

        grp.path(outline(0, h)).attr("class", "outline");
        var o3 = (h - 70) / 3,
            o2 = (h - 70) / 2,
            cover = grp.ellipse(getEll(h - 60)).attr("class", "water"),
            ct1 = grp.path(cut(10, 10 + o3, 0)).attr({
                fill: gcoffee
            }),
            ct2 = grp.path(cut(10 + o3, h - 60, 0)).attr({
                fill: gwater
            }),
            middle = 10 + o3,
            pieCoffee,
            pieTitle,
            pieType,
            g = grp.g(),
            dr = grp.path(doors(0)).attr("class", "doors"),
            types = {
                // americano
                0: function() {
                    cover.attr("class", "water");
                    ct2.attr("fill", gwater);
                    middle = 10 + o3;
                    pieCoffee = 1 / 3;
                    pieType = "water";
                    pieTitle = "Americano";
                    gstream = "l(0,1,0,0)#60544F-#60544F:33-#B4D6DB";
                },
                // latté
                72: function() {
                    cover.attr("class", "milk");
                    ct2.attr("fill", gmilk);
                    middle = 10 + o3 * 2;
                    pieCoffee = 2 / 3;
                    pieType = "milk";
                    pieTitle = "Latté";
                    gstream = "l(0,1,0,0)#60544F-#60544F:66-#fff";
                },
                // mocha
                144: function() {
                    cover.attr("class", "milk");
                    ct2.attr("fill", gmilk);
                    middle = 10 + o3;
                    pieCoffee = 1 / 3;
                    pieType = "milk";
                    pieTitle = "Mocha";
                    gstream = "l(0,1,0,0)#60544F-#60544F:33-#fff";
                },
                // machiatto
                216: function() {
                    cover.attr("class", "milk");
                    ct2.attr("fill", gmilk);
                    middle = 10 + o2;
                    pieCoffee = 1 / 2;
                    pieType = "milk";
                    pieTitle = "Macchiato";
                    gstream = "l(0,1,0,0)#60544F-#60544F:50-#fff";
                },
                // espresso
                288: function() {
                    cover.attr("class", "coffee");
                    ct2.attr("fill", gcoffee);
                    middle = 10;
                    pieCoffee = 1;
                    pieType = "milk";
                    pieTitle = "Espresso";
                    gstream = "#60544F";
                }
            };

        function closeCup(callback) {
            Snap.animate(90, 0, function(val) {
                ct1.attr("path", cut(10, middle, val));
                ct2.attr("path", cut(middle, h - 60, val));
                dr.attr("path", doors(val));
            }, 500, mina.easein, callback);
        }

        function pour() {
            steam(g, function() {
                Snap.animate(0, 90, function(val) {
                    ct1.attr("path", cut(10, middle, val));
                    ct2.attr("path", cut(middle, h - 60, val));
                    dr.attr("path", doors(val));
                }, 1500, mina.elastic);
            });
        }
        var pieShow = (function() {
            var disc = s.circle(pie.cx, pie.cy, pie.r).attr({
                    fill: "#fff",
                    stroke: "#60544F"
                }),
                coffee = s.path().attr({
                    stroke: "#60544F",
                    strokeWidth: pie.r,
                    fill: "none"
                }),
                olda = 0,
                a;
            return function() {
                var cof = pieCoffee,
                    type = pieType;
                a = 360 * cof / 2;
                pie.waterBox.attr({
                    fill: type == "water" ? "#d6edee" : "#fff"
                });
                disc.attr({
                    fill: type == "water" ? "#d6edee" : "#fff"
                });
                pie.title.attr({
                    "#text": pieTitle
                });
                pie.coffee.attr({
                    "#text": "Espresso (" + Math.round(cof * 100) + "%)"
                });
                pie.water.attr({
                    "#text": (type == "water" ? "Hot Water" : "Milk") + " (" + (100 - Math.round(cof * 100)) + "%)"
                });
                Snap.animate(olda, a, function(val) {
                    coffee.attr({
                        d: "M" + [pie.cx, pie.cy] +
                            "U" + [pie.r / 2, 90 - val, 90 + val]
                    });
                }, 500, function() {
                    if (cof == 1) {
                        disc.attr({
                            fill: "#60544F"
                        });
                    }
                });
                olda = a;
            };
        }());

        types[0]();
        pour();
        pieShow();
    });


    function getEll(height) {
        var ra = r + (R - r) / h * height;
        return {
            cx: x,
            cy: y + h - height,
            rx: ra,
            ry: ra / p
        };
    }

    function arc(cx, cy, R, r, from, to, command) {
        var start = pointAtAngle(cx, cy, R, r, from),
            end = pointAtAngle(cx, cy, R, r, to);
        command = command || "M";
        return command + Snap.format("{sx},{sy}A{R},{r},0,{big},{way},{tx},{ty}", {
            sx: start.x,
            sy: start.y,
            R: R,
            r: r,
            tx: end.x,
            ty: end.y,
            big: +(Math.abs(to - from) > 180),
            way: +(from > to)
        });
    }

    function pointAtAngle(cx, cy, rx, ry, angle) {
        angle = Snap.rad(angle);
        return {
            x: cx + rx * Math.cos(angle),
            y: cy - ry * Math.sin(angle)
        };
    }

    function doors(alpha) {
        var sa = 270 - alpha / 2,
            ea = 270 + alpha / 2;
        if (alpha) {
            return arc(x, y, R, R / p, 180, sa) + arc(x, y + h, r, r / p, sa, 180, "L") + "z" +
                arc(x, y, R, R / p, ea, 360) + arc(x, y + h, r, r / p, 360, ea, "L") + "z";
        } else {
            return arc(x, y, R, R / p, 180, 360) + arc(x, y + h, r, r / p, 360, 180, "L") + "z";
        }
    }

    function fill(from, to) {
        var start = getEll(from),
            end = getEll(to);
        return "M" + (start.cx - start.rx) + "," + start.cy + "h" + start.rx * 2 +
            arc(end.cx, end.cy, end.rx, end.ry, 0, 180, "L") + "z";
    }

    function outline(from, to) {
        var start = getEll(from),
            end = getEll(to);
        return arc(start.cx, start.cy, start.rx, start.ry, 180, 0) +
            arc(end.cx, end.cy, end.rx, end.ry, 0, 180, "L") + "z";
    }

    function cut(from, to, alpha) {
        var s = getEll(from),
            e = getEll(to),
            sa = Snap.rad(270 - alpha / 2),
            ea = Snap.rad(270 + alpha / 2);
        return "M" + [s.cx, s.cy,
            s.cx + s.rx * Math.cos(ea), s.cy - s.ry * Math.sin(ea),
            e.cx + e.rx * Math.cos(ea), e.cy - e.ry * Math.sin(ea),
            e.cx, e.cy,
            e.cx + e.rx * Math.cos(sa), e.cy - e.ry * Math.sin(sa),
            s.cx + s.rx * Math.cos(sa), s.cy - s.ry * Math.sin(sa)
        ] + "z";
    }

    function steam(g, callback) {
        g.rect(x - 10, y - 1030, 20, 1000, 10).attr({
            fill: gstream,
            clip: s.rect(x - 10, y - 200, 20, h + 200)
        }).animate({
            y: y + 40
        }, 800, function() {
            this.remove();
        });
        s.ellipse(x, y, R, R / p).attr({
            fill: "#fff",
            filter: s.filter(Snap.filter.blur(10))
        }).animate({
            cy: y - 30,
            opacity: 0
        }, 1000, callback);
    }

    // Meeting Room animations 
    const s2 = Snap('#meeting-room-svg')
    const darkness = $('#ETEIND')
    const shutterRight = s2.select('#volets-D')
    const shutterRightClose = 'M 264.9,170.3 409.5,87.4 409.5,322.6 264.9,405.5 Z'
    const shutterRightOpen = 'M 264.9,170.3 409.5,87.4 409.5,88.5 264.9,171.6 Z'

    const shutterLeft = s2.select('#volets--G')
    const shutterLeftClose = 'M 116.1,255.4 260.7,172.5 260.7,407.7 116.1,490.6 Z'
    const shutterLeftOpen = 'M 116.1,255.4 260.7,172.5 260.7,173.5 116.1,257.1 Z'

    const shutterRightMask = s2.path(shutterRightOpen).attr('fill', '#fff')
    const shutterLeftMask = s2.path(shutterLeftOpen).attr('fill', '#fff')

    shutterRight.attr({ mask: shutterRightMask })
    shutterLeft.attr({ mask: shutterLeftMask })

    // Meeting room Animation functions 
    let lightOn = function() {
        const s = Snap('#meeting-room-svg')
        const light = s.select('#LUMIERE-ON')
        light.animate({ opacity: 0.7 }, 500, function() {
            $('#LUMIERE-ON').removeClass('off').addClass('on')
        })
    }
    let lightOff = function() {
        const s = Snap('#meeting-room-svg')
        const projector = $('#VIDEOPROJ-ON')
        const light = s.select('#LUMIERE-ON')
        light.animate({ opacity: 0 }, 500, function() {
            $('#LUMIERE-ON').removeClass('on').addClass('off')
        })
    }
    let projectorOn = function() {
        const s = Snap('#meeting-room-svg')
        const projector = $('#VIDEOPROJ-ON')
        const projection = s.select('#VIDEOPROJ-ON')
        projection.animate({ opacity: 1 }, 500, function() {
            projector.removeClass('off').addClass('on')
        })
    }
    let projectorOff = function() {
        const s = Snap('#meeting-room-svg')
        const projector = $('#VIDEOPROJ-ON')
        const projection = s.select('#VIDEOPROJ-ON')
        projection.animate({ opacity: 0 }, 500, function() {
            projector.removeClass('on').addClass('off')
        })
    }
    let slideNext = function() {
        const s = Snap('#meeting-room-svg')

        const pcSlides = $('.pc-proj')
        let target = null
        let targetProj = null
        const currentSlide = $('.pc-proj.active')
        const currentSlideIndex = parseInt(currentSlide.attr('data-index'));
        const currentProj = $('#VIDEOPROJ-ON-' + currentSlideIndex)

        if (currentSlideIndex === pcSlides.length) {
            target = $('.pc-proj[data-index="1"]')
            targetProj = $('.proj[data-index="1"]')
        } else {
            target = $('.pc-proj[data-index="' + (currentSlideIndex + 1) + '"]')
            targetProj = $('.proj[data-index="' + (currentSlideIndex + 1) + '"]')
        }
        const svgCurrent = s.select('#' + currentSlide.attr('id'))
        const svgTarget = s.select('#' + target.attr('id'))
        const svgCurrentProj = s.select('#VIDEOPROJ-ON-' + currentSlideIndex)
        const svgTargetProj = s.select('#' + targetProj.attr('id'))
        svgCurrent.animate({ opacity: 0 }, 300, function() {

            currentSlide[0].classList.remove('active')
            target[0].classList.add('active')
            currentProj[0].classList.remove('active')
            targetProj[0].classList.add('active')
            svgTarget.animate({ opacity: 1 }, 300)
            svgCurrentProj.animate({ opacity: 0 }, 300, function() {
                svgTargetProj.animate({ opacity: 1 }, 300)
            })
        })
    }
    let slidePrev = function() {
        const s = Snap('#meeting-room-svg')
        const pcSlides = $('.pc-proj')
        let target = null
        let targetProj = null
        const currentSlide = $('.pc-proj.active')
        const currentSlideIndex = parseInt(currentSlide.attr('data-index'));
        const currentProj = $('#VIDEOPROJ-ON-' + currentSlideIndex)
        if (currentSlideIndex === 1) {
            target = $('.pc-proj[data-index="' + pcSlides.length + '"]')
            targetProj = $('.proj[data-index="' + pcSlides.length + '"]')
        } else {
            target = $('.pc-proj[data-index="' + (currentSlideIndex - 1) + '"]')
            targetProj = $('.proj[data-index="' + (currentSlideIndex - 1) + '"]')
        }
        const svgCurrent = s.select('#' + currentSlide.attr('id'))
        const svgTarget = s.select('#' + target.attr('id'))
        const svgCurrentProj = s.select('#VIDEOPROJ-ON-' + currentSlideIndex)
        const svgTargetProj = s.select('#' + targetProj.attr('id'))

        svgCurrent.animate({ opacity: 0 }, 300, function() {
            currentSlide[0].classList.remove('active')
            target[0].classList.add('active')
            currentProj[0].classList.remove('active')
            targetProj[0].classList.add('active')
            svgTarget.animate({ opacity: 1 }, 300)
            svgCurrentProj.animate({ opacity: 0 }, 300, function() {
                svgTargetProj.animate({ opacity: 1 }, 300)
            })
        })
    }
    let closeShutters = function() {
        shutterRightMask.animate({
            d: shutterRightClose
        }, 600)
        shutterLeftMask.animate({
            d: shutterLeftClose
        }, 600, function() {
            $('#VOLETS-ON').removeClass('open').addClass('close')
        })
        darkness.animate({ opacity: 0.2 }, 500);

    }
    let openShutters = function() {
        shutterRight.attr({ mask: shutterRightMask })
        shutterLeft.attr({ mask: shutterLeftMask })
        shutterRightMask.animate({
            d: shutterRightOpen
        }, 600)
        shutterLeftMask.animate({
            d: shutterLeftOpen
        }, 600, function() {
            $('#VOLETS-ON').removeClass('close').addClass('open')
        })
        darkness.animate({ opacity: 0 }, 500);
    }

    // Demo Buttons
    let lintoAgentDemoBtns = document.getElementsByClassName('linto-agent-demo-btn')
    for (let btn of lintoAgentDemoBtns) {
        btn.onclick = function() {
            if (!btn.classList.contains('active')) {
                resetDemoBtns()
                btn.classList.remove('dark')
                btn.classList.add('blue')
                btn.classList.add('active')
                let target = btn.getAttribute('data-target')
                updateDemoBlock(target)
            }
        }
    }
    let resetDemoBtns = function() {
        let lintoAgentDemoBtns = document.getElementsByClassName('linto-agent-demo-btn')
        for (let btn of lintoAgentDemoBtns) {
            btn.classList.remove('active')
            btn.classList.remove('blue')
            btn.classList.add('dark')
        }
    }
    let updateDemoBlock = function(target) {
        let demoBlocks = document.getElementsByClassName('browser-command-wrapper')
        for (let block of demoBlocks) {
            block.classList.add('hidden')
            if (block.getAttribute('id') === target) {
                block.classList.remove('hidden')
            }
        }
    }

    let setAccessibilityMode = function() {
        let demoWrapper = document.getElementById('linto-agent-demo-wrapper')
        demoWrapper.classList.add('accessibility-on')
    }
    let unsetAccessibilityMode = function() {
        let demoWrapper = document.getElementById('linto-agent-demo-wrapper')
        demoWrapper.classList.remove('accessibility-on')
    }

    let getActiveContentBlockIndex = function() {
        let contentBlocks = document.getElementsByClassName('browser-control-content-block')
        for (let block of contentBlocks) {
            if (block.classList.contains('active')) {
                return parseInt(block.getAttribute('data-content-index'))
            }
        }
    }

    let readContentTitle = function() {
        let index = getActiveContentBlockIndex()
        let titles = document.getElementsByClassName('control-content-title')
        for (let title of titles) {
            if (parseInt(title.getAttribute('data-index')) === index) {
                window.LintoUI.widgetSay(title.innerHTML)
                return
            }
        }
    }

    let readContentText = function() {
        let index = getActiveContentBlockIndex()
        let texts = document.getElementsByClassName('control-content-text')
        for (let text of texts) {
            if (parseInt(text.getAttribute('data-index')) === index) {
                window.LintoUI.widgetSay(text.innerHTML)
                return
            }
        }
    }

    let nextContentBlock = function() {
        let index = getActiveContentBlockIndex()
        let contentBlocks = document.getElementsByClassName('browser-control-content-block')
        let nbBlocks = contentBlocks.length
        let targetIndex = index + 1 > parseInt(nbBlocks) ? 1 : index + 1
        for (let block of contentBlocks) {
            block.classList.remove('active')
            if (parseInt(block.getAttribute('data-content-index')) === targetIndex) {
                block.classList.add('active')
            }
        }
    }
    let prevContentBlock = function() {
        let index = getActiveContentBlockIndex()
        let contentBlocks = document.getElementsByClassName('browser-control-content-block')
        let nbBlocks = contentBlocks.length
        let targetIndex = index - 1 === 0 ? nbBlocks : index - 1
        for (let block of contentBlocks) {
            block.classList.remove('active')
            if (parseInt(block.getAttribute('data-content-index')) === targetIndex) {
                block.classList.add('active')
            }
        }
    }

    let imgZoomIn = function() {
        const imgZoomCloseBtn = document.getElementById('browser-control-img-close')
        const img = document.getElementById('browser-control-img-container')
        img.classList.remove('small')
        img.classList.add('big')
        imgZoomCloseBtn.classList.remove('hidden')
    }

    let imgZoomOut = function() {
        const imgZoomCloseBtn = document.getElementById('browser-control-img-close')
        const img = document.getElementById('browser-control-img-container')
        img.classList.remove('big')
        img.classList.add('small')
        imgZoomCloseBtn.classList.add('hidden')
    }

    // Custom actions for SVG Animations
    let customActionSkill = async(event) => {
        // Coffee machine
        if (!!event.detail && event.detail.behavior.customAction.kind === 'coffee_macchiato') {
            s.select("#mochiatto-area").click()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'coffee_latte') {
            s.select("#latte-area").click()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'coffee_americano') {
            s.select("#americano-area").click()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'coffee_espresso') {
            s.select("#espresso-area").click()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'coffee_mocha') {
            s.select("#mocha-area").click()
        }
        // Meeting room
        if (!!event.detail && event.detail.behavior.customAction.kind === 'shutter_off') {
            openShutters()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'shutter_on') {
            closeShutters()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'light_on') {
            lightOn()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'light_off') {
            lightOff()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'projector_on') {
            projectorOn()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'projector_off') {
            projectorOff()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'slide_next') {
            slideNext()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'slide_previous') {
            slidePrev()
        }
        // Browser commands 
        if (!!event.detail && event.detail.behavior.customAction.kind === 'read_title') {
            readContentTitle()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'read_content') {
            readContentText()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'block_next') {
            nextContentBlock()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'block_previous') {
            prevContentBlock()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'picture_zoom_in') {
            imgZoomIn()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'picture_zoom_out') {
            imgZoomOut()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === "accesibility_on") {
            setAccessibilityMode()
        }
        if (!!event.detail && event.detail.behavior.customAction.kind === 'accesibility_off') {
            unsetAccessibilityMode()

        }
    }

    const imgZoomCloseBtn = document.getElementById('browser-control-img-close')
    imgZoomCloseBtn.onclick = function() {
        imgZoomOut()
    }
    let host = window.location.hostname;
    let lintoWebToken = '';
    let debug = false;
    if (host.indexOf('dev.linto.local') >= 0) {
        lintoWebToken = 'zxfXgOkg7AmPIBO7';
        debug = true;
    } 
    if (host.indexOf('linto.ai') >= 0) {
      lintoWebToken = 'ULJFcHacbmKwDy7D';
      debug = false;
  } 
    // Widget Init
    window.LintoUI = new LintoUI({
        debug,
        containerId: 'widget-wrapper',
        lintoWebHost: 'https://gamma.linto.ai/overwatch/local/web/login',
        lintoWebToken,
        widgetMode: 'minimal-streaming',
        widgetTitle: 'Agent LinTO',
        lintoCustomEvents: [{
            flag: 'custom_action_from_skill',
            func: (event) => {
                customActionSkill(event)
            }
        }]
    })
}