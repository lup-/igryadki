<template>
    <g class="handler">
        <path v-for="(path, index) in pathD" :d="path" :key="index" />
    </g>
</template>

<script>
    export default {
        name: "Handler",
        props: ['centerX', 'centerY', 'vertical'],
        data() {
            return {
                widthInDrawingCm: this.vertical ? 2.68346 : 6.17393,
                heightInDrawingCm: this.vertical ? 6.17393 : 2.68346,
                lineCount: 4,
            }
        },
        computed: {
            topLeft() {
                return {
                    x: this.centerX - this.widthInDrawingCm / 2,
                    y: this.centerY - this.heightInDrawingCm / 2,
                }
            },
            pathD() {
                let lines = [];
                let heightDelta = this.heightInDrawingCm / (this.lineCount - 1);
                let widthDelta = this.widthInDrawingCm / (this.lineCount - 1);

                for (let lineIndex = 0; lineIndex < this.lineCount; lineIndex++) {
                    if (this.vertical) {
                        let dx = this.topLeft.x + lineIndex * widthDelta;
                        let dy = this.topLeft.y;
                        let height = this.heightInDrawingCm;

                        lines.push(`m ${dx},${dy} v ${height}`);
                    }
                    else {
                        let dx = this.topLeft.x;
                        let dy = this.topLeft.y + lineIndex * heightDelta;
                        let width = this.widthInDrawingCm;

                        lines.push(`m ${dx},${dy} h ${width}`);
                    }
                }

                return lines;
            },
        }
    }
</script>

<style scoped>
    .handler {
        pointer-events: none;
    }
    .handler path {
        fill: none;
        fill-rule: evenodd;
        stroke: #000000;
        stroke-width: 0.26458332px;
        stroke-linecap: butt;
        stroke-linejoin: miter;
        stroke-opacity: 1;
    }
</style>