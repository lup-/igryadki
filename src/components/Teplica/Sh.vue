<template>
    <div class="scheme-sh">
        <svg
                xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:cc="http://creativecommons.org/ns#"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:svg="http://www.w3.org/2000/svg"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                :width="fullWidthPx+'mm'"
                :height="fullHeightPx+'mm'"
                :viewBox="[0, 0, fullWidthPx, fullHeightPx].join(' ')"
        >
            <g>
                <rect id="teplica"
                    :x="0"
                    :y="0"
                    :width="fullWidthPx"
                    :height="fullHeightPx"
                />
                <rect id="teplica-inner"
                    :x="leftStartPx"
                    :y="topStartPx"
                    :width="baseWidthPx"
                    :height="baseHeightPx"
                />

                <rect id="g1_top_bort" :width="bortsPx[0]['top'].w" :height="bortsPx[0]['top'].h" :x="bortsPx[0]['top'].x" :y="bortsPx[0]['top'].y"/>
                <rect id="g1_left_bort" :width="bortsPx[0]['left'].w" :height="bortsPx[0]['left'].h" :x="bortsPx[0]['left'].x" :y="bortsPx[0]['left'].y"/>
                <rect id="g1_bottom_bort" class="handler movable"
                        :width="bortsPx[0]['bottom'].w"
                        :height="bortsPx[0]['bottom'].h"
                        :x="bortsPx[0]['bottom'].x"
                        :y="bortsPx[0]['bottom'].y"
                        @mousedown="event => startMove(event, 0, 'bottom')"
                        @touchstart.prevent="event => startMove(event, 0, 'bottom')"
                />
                <rect id="g1_right_bort" class="handler movable"
                        :width="bortsPx[0]['right'].w"
                        :height="bortsPx[0]['right'].h"
                        :x="bortsPx[0]['right'].x"
                        :y="bortsPx[0]['right'].y"
                        @mousedown="event => startMove(event, 0, 'right')"
                        @touchstart.prevent="event => startMove(event, 0, 'right')"
                />

                <rect id="g2_left_bort" class="handler movable"
                        :width="bortsPx[1]['left'].w"
                        :height="bortsPx[1]['left'].h"
                        :x="bortsPx[1]['left'].x"
                        :y="bortsPx[1]['left'].y"
                        @mousedown="event => startMove(event, 1, 'left')"
                        @touchstart.prevent="event => startMove(event, 1, 'left')"
                />
                <rect id="g2_bottom_bort" class="handler movable"
                        :width="bortsPx[1]['bottom'].w"
                        :height="bortsPx[1]['bottom'].h"
                        :x="bortsPx[1]['bottom'].x"
                        :y="bortsPx[1]['bottom'].y"
                        @mousedown="event => startMove(event, 1, 'bottom')"
                        @touchstart.prevent="event => startMove(event, 1, 'bottom')"
                />
                <rect id="g2_right_bort" class="handler movable"
                        :width="bortsPx[1]['right'].w"
                        :height="bortsPx[1]['right'].h"
                        :x="bortsPx[1]['right'].x"
                        :y="bortsPx[1]['right'].y"
                        @mousedown="event => startMove(event, 1, 'right')"
                        @touchstart.prevent="event => startMove(event, 1, 'right')"
                />

                <rect id="g3_top_bort" :width="bortsPx[2]['top'].w" :height="bortsPx[2]['top'].h" :x="bortsPx[2]['top'].x" :y="bortsPx[2]['top'].y"/>
                <rect id="g3_left_bort" class="handler movable"
                        :width="bortsPx[2]['left'].w"
                        :height="bortsPx[2]['left'].h"
                        :x="bortsPx[2]['left'].x"
                        :y="bortsPx[2]['left'].y"
                        @mousedown="event => startMove(event, 2, 'left')"
                        @touchstart.prevent="event => startMove(event, 2, 'left')"
                />
                <rect id="g3_bottom_bort" class="handler movable"
                        :width="bortsPx[2]['bottom'].w"
                        :height="bortsPx[2]['bottom'].h"
                        :x="bortsPx[2]['bottom'].x"
                        :y="bortsPx[2]['bottom'].y"
                        @mousedown="event => startMove(event, 2, 'bottom')"
                        @touchstart.prevent="event => startMove(event, 2, 'bottom')"
                />
                <rect id="g3_right_bort"
                        :width="bortsPx[2]['right'].w"
                        :height="bortsPx[2]['right'].h"
                        :x="bortsPx[2]['right'].x"
                        :y="bortsPx[2]['right'].y"
                />

                <rect id="g4_top_bort" :width="bortsPx[3]['top'].w" :height="bortsPx[3]['top'].h" :x="bortsPx[3]['top'].x" :y="bortsPx[3]['top'].y"/>
                <rect id="g4_left_bort" :width="bortsPx[3]['left'].w" :height="bortsPx[3]['left'].h" :x="bortsPx[3]['left'].x" :y="bortsPx[3]['left'].y"/>
                <rect id="g4_right_bort" :width="bortsPx[3]['right'].w" :height="bortsPx[3]['right'].h" :x="bortsPx[3]['right'].x" :y="bortsPx[3]['right'].y"/>
                <rect id="g4_bottom_bort_left" class="handler movable"
                        :width="bortsPx[3]['bottomLeft'].w"
                        :height="bortsPx[3]['bottomLeft'].h"
                        :x="bortsPx[3]['bottomLeft'].x"
                        :y="bortsPx[3]['bottomLeft'].y"
                        @mousedown="event => startMove(event, 3, 'bottomLeft')"
                        @touchstart.prevent="event => startMove(event, 3, 'bottomLeft')"
                />
                <rect id="g4_bottom_bort_right" class="handler movable"
                        :width="bortsPx[3]['bottomRight'].w"
                        :height="bortsPx[3]['bottomRight'].h"
                        :x="bortsPx[3]['bottomRight'].x"
                        :y="bortsPx[3]['bottomRight'].y"
                        @mousedown="event => startMove(event, 3, 'bottomRight')"
                        @touchstart.prevent="event => startMove(event, 3, 'bottomRight')"
                />

                <arrow v-for="(arrow, index) in arrowsPx" :key="index"
                    :start="arrow.start"
                    :end="arrow.end"
                    :text="arrow.text"
                    :text-position="arrow.textPosition"
                ></arrow>

                <handler v-for="handler in handlersPx" :key="handler.grIndex+handler.position"
                    :center-x="handler.x"
                    :center-y="handler.y"
                    :vertical="handler.vertical"
                ></handler>

                <path v-for="(support, index) in supportD" :d="support" :id="'gx_support_'+index" :key="'gx_support_'+index" />
            </g>
        </svg>
    </div>
</template>

<script>
    import Handler from "@/components/Teplica/Handler";
    import Arrow from "@/components/Teplica/Arrow";

    function getMousePos(mouseEvent, point) {
        point.x = (mouseEvent.clientX);
        point.y = (mouseEvent.clientY);
    }

    function getTouchPos(touchEvent, point) {
        point.x = (touchEvent.touches[0].clientX);
        point.y = (touchEvent.touches[0].clientY);
    }

    export default {
        name: "TeplicaSh",
        props: ['baseWidth', 'baseHeight', 'fullWidth', 'fullHeight', 'supports', 'value'],
        components: {Handler, Arrow},
        data() {
            //Все размеры внешние, т.е. содержат ширину бортов

            let bortWidthCm = 1.5;
            let passWidthCm = 50;

            let pixelToCm = 62/37.6803905;
            let cmToPixel = 1/pixelToCm;

            let bortPixelToCm = 1.5/5.735;
            let bortCmToPixel = 1/bortPixelToCm;

            let minPrSizeCm = 30;
            let minVhSizeCm = 30;

            return {
                pixelToCm,
                cmToPixel,
                bortPixelToCm,
                bortCmToPixel,
                minWidth: 50,
                minLength: 100,
                bortWidthCm,
                passWidthCm,
                minPrSizeCm,
                minVhSizeCm,
                gryadkiBase: this.value || this.getBaseSizes(this.baseWidth, this.baseHeight, bortWidthCm, passWidthCm),
            }
        },
        mounted() {
            this.emitSizeUpdates();
        },
        watch: {
            baseWidth() {
                this.gryadkiBase = this.getBaseSizes(this.baseWidth, this.baseHeight, this.bortWidthCm, this.passWidthCm);
                this.emitSizeUpdates();
            },
            baseHeight() {
                this.gryadkiBase = this.getBaseSizes(this.baseWidth, this.baseHeight, this.bortWidthCm, this.passWidthCm);
                this.emitSizeUpdates();
            }
        },
        methods: {
            getBaseSizes(baseWidth, baseHeight, bortWidth, passWidthCm) {
                let grWidth = 62; let gr4Width = 65;

                return [
                    {widthCm: grWidth, lengthCm: baseHeight - gr4Width},
                    {widthCm: grWidth, lengthCm: baseHeight - gr4Width - passWidthCm},
                    {widthCm: grWidth, lengthCm: baseHeight - gr4Width},
                    {widthCm: gr4Width, lengthCm: baseWidth}
                ]
            },

            widthInPixels(cm) {
                return cm * this.cmToPixel;
            },
            widthInCm(pixels) {
                return pixels * this.pixelToCm;
            },
            bortWidthInPixels(cm) {
                return cm * this.bortCmToPixel;
            },
            pixelsToInches(px) {
                return px * (1/96);
            },
            inchesToPixels(inches) {
                return inches / (1/96);
            },
            inchesToMM(inches) {
                return inches * 25.4;
            },
            mmToInches(mm) {
                return mm / 25.4;
            },
            pixelsToMM(px) {
                //82.96 px = 21.94932 mm
                return this.inchesToMM( this.pixelsToInches(px) );
            },
            pointToPath(point) {
                let {start, end} = point;
                return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
            },
            textLabel(num) {
                return Math.floor(num);
            },

            emitSizeUpdates() {
                this.$emit('input', this.gryadkiBase);
            },

            updateConstraintSizes(grIndex, propType, delta) {
                if (grIndex === 3 && propType === 'widthCm') {
                    for (let checkIndex = 0; checkIndex < 3; checkIndex++) {
                        let oldSize = this.gryadkiBase[checkIndex].lengthCm;
                        let newSize = this.getMoveConstraintSize(checkIndex, 'lengthCm', oldSize, delta);

                        if (newSize < oldSize + delta) {
                            this.$set(this.gryadkiBase[checkIndex], 'lengthCm', newSize);
                        }
                    }
                }
            },

            getMoveConstraintSize(grIndex, propType, oldSize, delta) {
                let newSize = oldSize + delta;
                let minSize = propType === 'widthCm' ? this.minWidth : this.minLength;

                let maxSize = propType === 'lengthCm'
                    ? ( grIndex === 3 ? this.baseWidth : this.baseHeight - this.gryadkiBase[3].widthCm )
                    : this.gryadkiBase[grIndex].widthCm + this.prWidthCm - this.minPrSizeCm;

                if (grIndex === 1 && propType === 'lengthCm') {
                    maxSize = maxSize - this.minVhSizeCm;
                }

                if (grIndex === 3 && propType === 'widthCm') {
                    maxSize = this.baseHeight - this.minVhSizeCm - this.minLength;
                }

                if (newSize < minSize) {
                    return minSize;
                }

                if (newSize > maxSize) {
                    return maxSize;
                }

                return newSize;
            },

            startMove(evt, grIndex, arrowType) {
                const touch = (evt.type === "touchstart")
                if (!touch && evt.button !== 0) return;
                const events = touch ? {
                    move: "touchmove",
                    stop: "touchend"
                } : {
                    move: "mousemove",
                    stop: "mouseup"
                }
                const elem = evt.currentTarget.closest("svg");
                const point = elem.createSVGPoint();
                const transform = elem.getScreenCTM().inverse();
                const grSize = this.gryadkiBase[grIndex];
                const getPos = touch ? getTouchPos : getMousePos;

                let moving = true;
                let newPt;

                const updateFn = () => {
                    let isNotSwappedLengthWidth = grIndex !== 3;
                    let isVertical = ['bottom', 'bottomLeft', 'bottomRight'].indexOf(arrowType) !== -1;
                    if (moving) {
                        requestAnimationFrame(updateFn);
                    }

                    let bort = this.bortsPx[grIndex][arrowType];
                    newPt = point.matrixTransform(transform);
                    let coordType = 'x';
                    let propType = isNotSwappedLengthWidth ? 'widthCm' : 'lengthCm';
                    let baseCoord = bort.x + bort.w/2;

                    let isInverted = arrowType === 'right' || isVertical;

                    if (isVertical) {
                        coordType = 'y';
                        propType = isNotSwappedLengthWidth ? 'lengthCm' : 'widthCm';
                        baseCoord = bort.y + bort.h/2;
                    }

                    let delta = isInverted
                        ? newPt[coordType] - baseCoord
                        : baseCoord - newPt[coordType];
                    let deltaCm = this.widthInCm( this.pixelsToMM(delta) );
                    let newSize = this.getMoveConstraintSize(grIndex, propType, grSize[propType], deltaCm);
                    deltaCm = newSize - grSize[propType];

                    this.$set( this.gryadkiBase[grIndex], propType, newSize );
                    this.updateConstraintSizes(grIndex, propType, deltaCm);
                    this.emitSizeUpdates();
                }
                const moveFn = (evt) => getPos(evt, point)
                const stopFn = () => {
                    moving = false;
                    elem.removeEventListener(events.move, moveFn);
                    elem.removeEventListener(events.stop, stopFn);
                }

                requestAnimationFrame(updateFn);
                moveFn(evt);

                elem.addEventListener(events.move, moveFn);
                elem.addEventListener(events.stop, stopFn);
            }
        },
        computed: {
            fullWidthPx() {
                return this.widthInPixels( this.fullWidth );
            },
            fullHeightPx() {
                return this.widthInPixels( this.fullHeight );
            },
            baseWidthPx() {
                return this.widthInPixels( this.baseWidth );
            },
            baseHeightPx() {
                return this.widthInPixels( this.baseHeight );
            },
            leftStartPx() {
                return this.widthInPixels( (this.fullWidth - this.baseWidth)/2 );
            },
            topStartPx() {
                return this.widthInPixels( (this.fullHeight - this.baseHeight)/2 );
            },

            prWidthCm() {
                let [gr1, gr2, gr3, gr4] = this.gryadkiBase;
                return (gr4.lengthCm - gr1.widthCm - gr2.widthCm - gr3.widthCm)/2;
            },
            prWidthPx() {
                return this.widthInPixels( this.prWidthCm );
            },
            gryadkiPx() {
                let [gr1, gr2, gr3, gr4] = this.gryadkiBase;
                let grTopPx = this.topStartPx + this.widthInPixels(gr4.widthCm);
                let prWidthPx = this.prWidthPx;

                return [
                    {
                        width: this.widthInPixels(gr1.widthCm),
                        length: this.widthInPixels(gr1.lengthCm),
                        left: this.leftStartPx,
                        top: grTopPx
                    },
                    {
                        width: this.widthInPixels(gr2.widthCm),
                        length: this.widthInPixels(gr2.lengthCm),
                        left: this.leftStartPx + this.widthInPixels(gr1.widthCm) + prWidthPx,
                        top: grTopPx
                    },
                    {
                        width: this.widthInPixels(gr3.widthCm),
                        length: this.widthInPixels(gr3.lengthCm),
                        left: this.leftStartPx + this.widthInPixels(gr1.widthCm) + this.widthInPixels(gr2.widthCm) + 2 * prWidthPx,
                        top: grTopPx
                    },
                    {
                        width: this.widthInPixels(gr4.widthCm),
                        length: this.widthInPixels(gr4.lengthCm),
                        left: this.leftStartPx,
                        top: this.topStartPx
                    },
                ]
            },
            bortsPx() {
                let bortWidthPx = this.bortWidthInPixels(this.bortWidthCm);
                let gryadkiPx = this.gryadkiPx;
                let prWidthPx = this.prWidthPx;

                let borts = [
                    {
                        left: {w: bortWidthPx, h: gryadkiPx[0].length, x: gryadkiPx[0].left, y: gryadkiPx[0].top},
                        bottom: {w: gryadkiPx[0].width - 2*bortWidthPx, h: bortWidthPx, x: gryadkiPx[0].left + bortWidthPx, y: gryadkiPx[0].top + gryadkiPx[0].length - bortWidthPx},
                        right: {w: bortWidthPx, h: gryadkiPx[0].length, x: gryadkiPx[0].left + gryadkiPx[0].width - bortWidthPx, y: gryadkiPx[0].top},
                        top: {w: gryadkiPx[0].width - 2*bortWidthPx, h: bortWidthPx, x: gryadkiPx[0].left + bortWidthPx, y: gryadkiPx[3].top},
                    },
                    {
                        left: {w: bortWidthPx, h: gryadkiPx[1].length, x: gryadkiPx[1].left, y: gryadkiPx[1].top},
                        bottom: {w: gryadkiPx[1].width - 2*bortWidthPx, h: bortWidthPx, x: gryadkiPx[1].left + bortWidthPx, y: gryadkiPx[1].top + gryadkiPx[1].length - bortWidthPx},
                        right: {w: bortWidthPx, h: gryadkiPx[1].length, x: gryadkiPx[1].left + gryadkiPx[1].width - bortWidthPx, y: gryadkiPx[1].top},
                        top: {w: gryadkiPx[1].width - 2*bortWidthPx, h: bortWidthPx, x: gryadkiPx[1].left + bortWidthPx, y: gryadkiPx[3].top},
                    },
                    {
                        left: {w: bortWidthPx, h: gryadkiPx[2].length, x: gryadkiPx[2].left, y: gryadkiPx[2].top},
                        bottom: {w: gryadkiPx[2].width - 2*bortWidthPx, h: bortWidthPx, x: gryadkiPx[2].left + bortWidthPx, y: gryadkiPx[2].top + gryadkiPx[2].length - bortWidthPx},
                        right: {w: bortWidthPx, h: gryadkiPx[2].length, x: gryadkiPx[2].left + gryadkiPx[2].width - bortWidthPx, y: gryadkiPx[2].top},
                        top: {w: gryadkiPx[2].width - 2*bortWidthPx, h: bortWidthPx, x: gryadkiPx[2].left + bortWidthPx, y: gryadkiPx[3].top},
                    },
                    {
                        left: {w: bortWidthPx, h: gryadkiPx[3].width, x: gryadkiPx[3].left, y: gryadkiPx[3].top},
                        bottomLeft: {w: prWidthPx + 2*bortWidthPx, h: bortWidthPx, x: gryadkiPx[0].left + gryadkiPx[0].width - bortWidthPx, y: gryadkiPx[3].top + gryadkiPx[3].width - bortWidthPx},
                        bottomRight: {w: prWidthPx + 2*bortWidthPx, h: bortWidthPx, x: gryadkiPx[1].left + gryadkiPx[1].width - bortWidthPx, y: gryadkiPx[3].top + gryadkiPx[3].width - bortWidthPx},
                        right: {w: bortWidthPx, h: gryadkiPx[3].width, x: gryadkiPx[2].left + gryadkiPx[2].width - bortWidthPx, y: gryadkiPx[3].top},
                        top: {w: gryadkiPx[1].width + 2 * prWidthPx + 2*bortWidthPx, h: bortWidthPx, x: gryadkiPx[0].left + gryadkiPx[0].width - bortWidthPx, y: gryadkiPx[3].top},
                    },
                ];

                for (let bort of borts) {
                    for (const type of Object.keys(bort)) {
                        bort[type].centerX = bort[type].x + bort[type].w/2;
                        bort[type].centerY = bort[type].y + bort[type].h/2;
                    }
                }

                return borts;
            },

            grMiddlesPx() {
                let [br1, br2, br3, br4] = this.bortsPx;
                return [
                    {x: br1.bottom.x + br1.bottom.w/2, y: br1.left.y+br1.left.h/2},
                    {x: br2.bottom.x + br2.bottom.w/2, y: br2.left.y+br2.left.h/2},
                    {x: br3.bottom.x + br3.bottom.w/2, y: br3.left.y+br3.left.h/2},
                    {x: br2.bottom.x + br2.bottom.w/2, y: br4.left.y+br4.left.h/2},
                ]
            },
            handlersPx() {
                let bortsWithHandlers = [
                    ['bottom', 'right'],
                    ['left', 'bottom', 'right'],
                    ['left', 'bottom'],
                    ['bottomLeft', 'bottomRight'],
                ];

                let handlers = [];
                for (const gryadkaIndex in bortsWithHandlers) {
                    let gryadkaBortHandlers = bortsWithHandlers[gryadkaIndex];
                    for (const bortType of gryadkaBortHandlers) {
                        let bort = this.bortsPx[gryadkaIndex][bortType];
                        handlers.push({
                            x: bort.centerX,
                            y: bort.centerY,
                            grIndex: gryadkaIndex,
                            position: bortType,
                            vertical: bortType === 'left' || bortType === 'right'
                        });
                    }
                }

                return handlers;
            },
            arrowsPx() {
                let [br1, br2, br3, br4] = this.bortsPx;
                let grMiddles = this.grMiddlesPx;
                let shiftX = 10;
                let shiftY = 15;

                return [
                    {
                        start: {x: br1.left.x, y: grMiddles[0].y - shiftY},
                        end: {x: br1.right.x+br1.right.w, y: grMiddles[0].y - shiftY},
                        text: this.textLabel( this.gryadkiBase[0].widthCm ),
                        textPosition: 'top'
                    },
                    {
                        start: {x: br1.left.x + shiftX, y: br1.bottom.y + br1.bottom.h},
                        end: {x: br1.left.x + shiftX, y: br1.left.y},
                        text: this.textLabel( this.gryadkiBase[0].lengthCm ),
                        textPosition: 'right'
                    },

                    {
                        start: {x: br2.left.x, y: grMiddles[1].y - shiftY},
                        end: {x: br2.right.x+br2.right.w, y: grMiddles[1].y - shiftY},
                        text: this.textLabel( this.gryadkiBase[1].widthCm ),
                        textPosition: 'top'
                    },
                    {
                        start: {x: br2.left.x + shiftX, y: br2.bottom.y + br2.bottom.h},
                        end: {x: br2.left.x + shiftX, y: br2.left.y},
                        text: this.textLabel( this.gryadkiBase[1].lengthCm ),
                        textPosition: 'right'
                    },

                    {
                        start: {x: br3.left.x, y: grMiddles[2].y - shiftY},
                        end: {x: br3.right.x+br3.right.w, y: grMiddles[2].y - shiftY},
                        text: this.textLabel( this.gryadkiBase[2].widthCm ),
                        textPosition: 'top'
                    },
                    {
                        start: {x: br3.right.x  + br3.right.w - shiftX, y: br3.bottom.y + br3.bottom.h},
                        end: {x: br3.right.x  + br3.right.w - shiftX, y: br3.right.y},
                        text: this.textLabel( this.gryadkiBase[2].lengthCm ),
                        textPosition: 'left'
                    },

                    {
                        start: {x: br2.left.x + shiftX, y: br4.bottomLeft.y + br4.bottomLeft.h},
                        end: {x: br2.left.x + shiftX, y: br4.top.y},
                        text: this.textLabel( this.gryadkiBase[3].widthCm ),
                        textPosition: 'left'
                    },
                    {
                        start: {x: br1.left.x, y: br4.left.y + shiftX},
                        end: {x: br3.right.x+br3.right.w, y: br4.left.y + shiftX},
                        text: this.textLabel( this.gryadkiBase[3].lengthCm ),
                        textPosition: 'bottom'
                    },


                    {
                        start: {x: br1.right.x + br1.right.w, y: grMiddles[1].y - shiftY},
                        end: {x: br2.left.x, y: grMiddles[1].y - shiftY},
                        text: this.textLabel( this.prWidthCm ),
                        textPosition: 'top'
                    },
                    {
                        start: {x: br2.right.x + br2.right.w, y: grMiddles[1].y - shiftY},
                        end: {x: br3.left.x, y: grMiddles[1].y - shiftY},
                        text: this.textLabel( this.prWidthCm ),
                        textPosition: 'top'
                    },
                    {
                        start: {x: br2.left.x + shiftX, y: br2.bottom.y + br2.bottom.h},
                        end: {x: br2.left.x + shiftX, y: this.topStartPx + this.widthInPixels(this.baseHeight)},
                        text: this.textLabel( this.baseHeight - this.gryadkiBase[1].lengthCm - this.gryadkiBase[3].widthCm),
                        textPosition: 'right'
                    },
                ];
            },
            supportPx() {
                let br4 = this.bortsPx[3];

                let baseSupports = [
                    {start: {x: br4.left.x + br4.left.w, y: br4.bottomLeft.y + br4.bottomLeft.h}, end: {x: br4.bottomLeft.x, y: br4.bottomLeft.y + br4.bottomLeft.h}},
                    {start: {x: br4.bottomLeft.x + br4.bottomLeft.w, y: br4.bottomLeft.y + br4.bottomLeft.h}, end: {x: br4.bottomRight.x, y: br4.bottomLeft.y + br4.bottomLeft.h}},
                    {start: {x: br4.bottomRight.x + br4.bottomRight.w, y: br4.bottomRight.y + br4.bottomRight.h}, end: {x: br4.right.x, y: br4.bottomRight.y + br4.bottomRight.h}},
                    {start: {x: br4.bottomLeft.x, y: br4.bottomLeft.y}, end: {x: br4.bottomLeft.x, y: br4.top.y + br4.top.h}},
                    {start: {x: br4.bottomRight.x + br4.bottomRight.w, y: br4.bottomRight.y}, end: {x: br4.bottomRight.x + br4.bottomRight.w, y: br4.top.y + br4.top.h}},
                ];

                let extraSupports = [];
                for (const grIndex in this.supports) {
                    let supportCount = this.supports[grIndex];
                    let supportGapCm = this.gryadkiBase[grIndex].lengthCm / (supportCount + 1);
                    let supportGapPx = this.widthInPixels(supportGapCm);
                    let grBorts = this.bortsPx[grIndex];
                    let grTopPx = grBorts.left.y;

                    for (let supportIndex = 0; supportIndex < supportCount; supportIndex++ ) {
                        extraSupports.push({
                            start: {x: grBorts.left.x + grBorts.left.w, y: grTopPx + supportGapPx * (supportIndex + 1)},
                            end: {x: grBorts.right.x, y: grTopPx + supportGapPx * (supportIndex + 1)}
                        });
                    }

                }

                return baseSupports.concat(extraSupports);
            },
            supportD() {
                return this.supportPx.map( this.pointToPath );
            },

            lowestY() {
                let borts = this.bortsPx;
                return Math.max(
                    borts[0].bottom.y+borts[0].bottom.h,
                    borts[1].bottom.y+borts[1].bottom.h,
                    borts[2].bottom.y+borts[2].bottom.h
                );
            },
        }
    }
</script>

<style scoped>
    svg {
        user-select: none;
        width: 100%;
        max-width: 700px;
        height: auto;
        max-height: 90vh;
        margin: 0;
    }

    .movable {
        cursor: move;
    }

    #teplica {
        opacity: 1;
        fill: #000000;
        fill-opacity: 0.3;
        stroke: #000000;
        stroke-linecap: square;
        stroke-linejoin: miter;
        stroke-dasharray: none;
        stroke-dashoffset: 0;
        stroke-opacity: 0.4;
    }

    #teplica-inner {
        opacity: 1;
        fill: #ffffff;
        fill-opacity: 1;
        stroke: #000000;
        stroke-linecap: square;
        stroke-linejoin: miter;
        stroke-dasharray: none;
        stroke-dashoffset: 0;
        stroke-opacity: 0.4;
    }

    [id*="bort"] {
        opacity: 1;
        fill: white;
        fill-opacity: 1;
        stroke: #000000;
        stroke-width: 0.26499999;
        stroke-linecap: butt;
        stroke-linejoin: miter;
        stroke-miterlimit: 4;
        stroke-dasharray: none;
        stroke-dashoffset: 0;
        stroke-opacity: 1;
        paint-order: normal;
    }

    .handler:hover, .handler.active {
        fill: rgba(0, 255, 0, 0.3);
    }

    [id*="title"] {
        font-style:normal;
        font-weight:normal;
        font-size:4.93888903px;
        line-height:125%;
        font-family:Sans;
        letter-spacing:0px;
        word-spacing:0px;
        fill:#000000;
        fill-opacity:1;
        stroke:none;
        stroke-width:0.26458332px;
        stroke-linecap:butt;
        stroke-linejoin:miter;
        stroke-opacity:1;
    }

    [id*="text"] {
        font-style:normal;
        font-weight:normal;
        font-size:10.58333302px;
        line-height:125%;
        font-family:Sans;
        letter-spacing:0px;
        word-spacing:0px;
        fill:#000000;
        fill-opacity:1;
        stroke:none;
        stroke-width:0.26458332px;
        stroke-linecap:butt;
        stroke-linejoin:miter;
        stroke-opacity:1;
    }

    [id*="support"] {
        fill: none;
        fill-rule: evenodd;
        stroke: #000000;
        stroke-width: 0.26458332;
        stroke-linecap: butt;
        stroke-linejoin: miter;
        stroke-miterlimit: 4;
        stroke-dasharray: 0.52916663, 0.52916663;
        stroke-dashoffset: 0;
        stroke-opacity: 1;
    }

</style>