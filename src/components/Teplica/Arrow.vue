<template>
    <g>
        <defs :id="'arrowDefs'+id">
            <marker :id="'arrowStart'+id" orient="auto" refY="0" refX="0" style="overflow:visible">
                <path class="arrow-marker" :d="markerPath" :transform="markerStartTransform" />
            </marker>
            <marker :id="'arrowEnd'+id" orient="auto" refY="0" refX="0" style="overflow:visible">
                <path class="arrow-marker" :d="markerPath" :transform="markerEndTransform"/>
            </marker>
        </defs>
        <path :id="'arrow'+id" class="arrow" :d="path" :style="`marker-start: url(#arrowStart${id}); marker-end: url(#arrowEnd${id});`" />
        <text class="arrow-text" v-if="text"
                :x="textCoords.x"
                :y="textCoords.y"
                :text-anchor="vertical ? 'middle' : (textPosition === 'left' ? 'end' : 'start')"
                :dominant-baseline="vertical ? (textPosition === 'bottom' ? 'hanging' : 'baseline') : 'middle'"
        >{{text}}</text>
    </g>
</template>

<script>
    export default {
        name: "Arrow",
        props: ['start', 'end', 'text', 'textPosition'],
        data() {
            return {
                id: null,
                size: 2,
                textShift: 2,
            }
        },
        mounted () {
            this.id = this._uid;
        },
        computed: {
            arrowStart() {
                return this.start;
            },
            arrowEnd() {
                return this.end;
            },
            vertical() {
                return this.start.y === this.end.y;
            },
            markerHeight() {
                return this.size * 2;
            },
            markerWidth() {
                return this.size * 2.5;
            },
            textCoords() {
                let xShift = this.vertical
                    ? 0
                    : (this.textPosition === 'left' ? -this.textShift : this.textShift);

                let yShift = this.vertical
                    ? (this.textPosition === 'bottom' ? this.textShift : -this.textShift)
                    : 0;

                return {
                    x: (this.arrowStart.x + this.arrowEnd.x)/2 + xShift,
                    y: (this.arrowStart.y + this.arrowEnd.y)/2 + yShift,
                }
            },
            markerShift() {
                return this.markerWidth + this.markerHeight/2;
            },
            markerStartTransform() {
                return `translate(${this.markerShift}, 0)`;
            },
            markerEndTransform() {
                return `translate(-${this.markerShift}, 0) rotate(180)`;
            },
            markerPath() {
                let h = this.markerHeight/2;
                let w = this.markerWidth;
                return `M 0,0 ${h},-${h} -${w},0 ${h},${h} Z`;
            },
            path() {
                return `M ${this.arrowStart.x} ${this.arrowStart.y} L ${this.arrowEnd.x} ${this.arrowEnd.y}`;
            }
        }
    }
</script>

<style scoped>
    .arrow {
        fill:none;
        fill-rule:evenodd;
        stroke:#da3a3a;
        stroke-width:0.465;
        stroke-linecap:butt;
        stroke-linejoin:miter;
        stroke-miterlimit:4;
        stroke-dasharray:none;
        stroke-opacity:1;
    }

    .arrow-marker {
        fill: #da3a3a;
        fill-opacity: 1;
        fill-rule: evenodd;
        stroke: #da3a3a;
        stroke-width: 1pt;
        stroke-opacity: 1;
    }

    .arrow-text {
        font-size: 5pt;
    }
</style>