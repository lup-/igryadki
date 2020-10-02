<template>
    <g class="handler">
        <g v-if="showArrow">
            <g class="arrow" :transform="`matrix(0,0.01608919,-0.01608919,0,${arrowTopLeft.x},${arrowTopLeft.y})`" v-if="arrowVertical">
                <g transform="matrix(0.1,0,0,-0.1,0,511)">
                    <path d="M 1279.8,1299.7 100,143.6 l 1187.7,-1158.1 1185.7,-1160 205.5,205.5 c 112.6,112.6 203.5,209.5 201.6,217.4 -3.9,5.9 -359.7,353.8 -794.4,770.7 l -788.5,758.9 1871.5,5.9 c 1027.6,2 2711.4,2 3739,0 l 1871.4,-5.9 -818.1,-788.5 c -450.6,-432.8 -820.1,-792.5 -824.1,-800.4 -2,-5.9 88.9,-104.7 201.6,-217.4 l 205.5,-205.5 1177.8,1152.1 C 9370.4,-449.3 9900,74.4 9900,84.3 9900,94.2 9370.4,606 8722.2,1220.6 L 7544.3,2341.1 7338.8,2137.5 c -112.7,-112.6 -203.6,-211.5 -201.6,-217.4 4,-5.9 359.7,-353.7 794.5,-770.7 l 786.5,-758.9 -1847.7,-5.9 c -1015.8,-2 -2687.6,-2 -3711.3,0 l -1863.6,5.9 588.9,612.6 c 326.1,337.9 685.7,707.5 800.4,824.1 l 209.5,213.4 -207.5,207.5 c -114.6,114.6 -211.5,207.5 -217.4,205.5 -6,0.2 -541.5,-519.6 -1189.7,-1153.9 z" />
                </g>
            </g>
            <g class="arrow" :transform="`matrix(0.01608919,0,0,0.01608919,${arrowTopLeft.x},${arrowTopLeft.y})`" v-else>
                <g transform="matrix(0.1,0,0,-0.1,0,511)">
                    <path d="M 1279.8,1299.7 100,143.6 l 1187.7,-1158.1 1185.7,-1160 205.5,205.5 c 112.6,112.6 203.5,209.5 201.6,217.4 -3.9,5.9 -359.7,353.8 -794.4,770.7 l -788.5,758.9 1871.5,5.9 c 1027.6,2 2711.4,2 3739,0 l 1871.4,-5.9 -818.1,-788.5 c -450.6,-432.8 -820.1,-792.5 -824.1,-800.4 -2,-5.9 88.9,-104.7 201.6,-217.4 l 205.5,-205.5 1177.8,1152.1 C 9370.4,-449.3 9900,74.4 9900,84.3 9900,94.2 9370.4,606 8722.2,1220.6 L 7544.3,2341.1 7338.8,2137.5 c -112.7,-112.6 -203.6,-211.5 -201.6,-217.4 4,-5.9 359.7,-353.7 794.5,-770.7 l 786.5,-758.9 -1847.7,-5.9 c -1015.8,-2 -2687.6,-2 -3711.3,0 l -1863.6,5.9 588.9,612.6 c 326.1,337.9 685.7,707.5 800.4,824.1 l 209.5,213.4 -207.5,207.5 c -114.6,114.6 -211.5,207.5 -217.4,205.5 -6,0.2 -541.5,-519.6 -1189.7,-1153.9 z" />
                </g>
            </g>
        </g>
        <path v-for="(path, index) in pathD" :d="path" :key="index" />
    </g>
</template>

<script>
    export default {
        name: "Handler",
        props: ['centerX', 'centerY', 'vertical', 'showArrow'],
        data() {
            return {
                widthInDrawingCm: this.vertical ? 2.68346 : 6.17393,
                heightInDrawingCm: this.vertical ? 6.17393 : 2.68346,
                arrowWidthInDrawingCm: this.arrowVertical ? 7.542 : 15.767,
                arrowHeightInDrawingCm: this.arrowVertical ? 15.767 : 7.542,
                lineCount: 4,
            }
        },
        computed: {
            arrowVertical() {
                return !this.vertical;
            },
            arrowTopLeft() {
                return {
                    x: this.arrowVertical
                         ? this.centerX + this.arrowWidthInDrawingCm / 2
                         : this.centerX - this.arrowWidthInDrawingCm / 2,
                    y: this.centerY - this.arrowHeightInDrawingCm,
                }
            },
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

    .handler .arrow path {
        fill: #000;
        opacity: 1;
        animation-name: glow;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        animation-direction: alternate;
    }

    @keyframes glow {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
</style>