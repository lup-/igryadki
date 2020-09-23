<template>
    <g>
        <rect
                :width="w"
                :height="h"
                :x="x"
                :y="y"
                :style="styles['bort']"
        />

        <text class="hide-on-view" v-if="text"
                :x="textCoords.x"
                :y="textCoords.y"
                text-anchor="middle"
                dominant-baseline="middle"
                :transform="textCoords.transform"
                :style="styles['text']"
        >{{text}}</text>
    </g>
</template>

<script>
    export default {
        name: "Bort",
        props: ['w', 'h', 'x', 'y', 'text', 'bottom'],
        data() {
            return {
                textSize: 4,
            }
        },
        computed: {
            isVertical() {
                return this.w < this.h;
            },
            textCoords() {
                let x = this.x + this.w/2;
                let y = this.y + this.h/2;

                let transform = '';

                if (this.isVertical) {
                    let rotateAngleDeg = 360 - 90;
                    transform = `rotate(${rotateAngleDeg})`;
                }
                else {
                    if (this.h <= this.textSize) {
                        let shiftDown = this.y + this.textSize < this.bottom / 2;

                        transform = shiftDown
                            ? `translate(0, ${this.textSize})`
                            : `translate(0, -${this.textSize})`;
                    }
                }

                return {
                    x,
                    y,
                    transform,
                }
            },
            styles() {
                return {
                    'bort': {
                        'opacity': '1',
                        'fill': 'white',
                        'fill-opacity': '0',
                        'stroke': '#000000',
                        'stroke-width': '0.26499999',
                        'stroke-linecap': 'butt',
                        'stroke-linejoin': 'miter',
                        'stroke-miterlimit': '4',
                        'stroke-dasharray': 'none',
                        'stroke-dashoffset': '0',
                        'stroke-opacity': '1',
                        'paint-order': 'normal',
                    },
                    'text': {
                        'font-style': 'normal',
                        'font-weight': 'normal',
                        'font-size': this.textSize + 'px',
                        'line-height': '125%',
                        'font-family': 'Sans',
                        'letter-spacing': '0px',
                        'word-spacing': '0px',
                        'fill': '#000000',
                        'fill-opacity': '1',
                        'stroke': 'none',
                        'stroke-width': '0.26458332px',
                        'stroke-linecap': 'butt',
                        'stroke-linejoin': 'miter',
                        'stroke-opacity': '1',
                        'transform-origin': this.textCoords.x+'px '+this.textCoords.y+'px',
                    },
                }
            }

        }
    }
</script>

<style scoped>
    .hide-on-view {
        opacity: 0;
    }
</style>