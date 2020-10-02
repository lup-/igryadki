<template>
    <div class="color-input d-flex flex-wrap">
        <b-dropdown variant="outline-primary"
                class="color-dropdown color-text mb-2 mr-2"
                :text="selectedColor ? selectedColor.title : noColor.title"
        >
            <template v-slot:default="{hide}">
                <a class="dropdown-item" href="#" @click.stop.prevent="selectColor(noColor, hide)">{{noColor.title}}</a>
                <li class="dropdown-item submenu" v-for="groupName in groups" :key="groupName"
                        :class="{'active': isHovering(groupName)}"
                        @mouseover="hoverGroup(groupName, true)"
                        @mouseout="hoverGroup(groupName, false)"
                >
                    {{groupName}}
                    <div class="dropdown-menu">
                        <a v-for="colorData in getGroupColors(groupName)" :key="colorData.code"
                                :class="'dropdown-item '+colorData.class"
                                href="#"
                                @click.stop.prevent="selectColor(colorData, hide)"
                        >
                            <span v-if="groupName === 'Рисунок'">&nbsp;</span>
                        </a>
                    </div>
                </li>
            </template>
        </b-dropdown>

        <div class="color-text">
            <div class="selected-color" :class="selectedColor ? selectedColor.class : ''"><span>&nbsp;</span></div>
        </div>
    </div>
</template>

<script>
    import colors from "../colors";

    export default {
        name: "ColorInput",
        props: ['value'],
        data() {
            let selectedColor = false;

            if (this.value) {
                selectedColor = colors.find( (colorData) => colorData.code === this.value );
            }

            return {
                hovering: {},
                selectedColor,
                colors
            }
        },
        methods: {
            appendCustomCSS() {
                let css = document.createElement('style');
                css.setAttributeNode( document.createAttribute('scopped') );
                css.appendChild( document.createTextNode( this.css ) );
                this.$el.appendChild( css );
            },
            getGroupColors(groupName) {
                return this.colors.filter( colorData => colorData.groups.indexOf(groupName) !== -1 );
            },
            hoverGroup(groupName, state) {
                this.$set(this.hovering, groupName, state);
            },
            isHovering(groupName) {
                return this.hovering[groupName]
            },
            selectColor(colorData, hideMenu) {
                this.selectedColor = colorData;
                if (hideMenu) {
                    hideMenu();
                }
                this.$emit('input', colorData.code );
            }
        },
        computed: {
            css() {
                let customCss = ``;

                this.colors.map( (colorData) => {
                    if (colorData.bgColor) {
                        customCss += `.${colorData.class} {background-color: ${colorData.bgColor}!important;}`
                    }

                    if (colorData.title) {
                        customCss += `.color-text .${colorData.class}:before {content: '${colorData.title}';}`;
                    }

                    if (colorData.textColor) {
                        customCss += `.color-text .${colorData.class}:before {color: ${colorData.textColor}!important;}`;
                    }
                });

                return customCss;
            },
            groups() {
                return ['Светлый', 'Темный', 'Зеленый', 'Синий', 'Красный', 'Оранжевый', 'Желтый', 'Коричневый', 'Серый', 'Рисунок'];
            },
            noColor() {
                return this.colors[0];
            }
        },
        mounted() {
            this.appendCustomCSS();
        }
    }
</script>

<style scoped>
    .selected-color {
        display: inline-block;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        min-height: calc(2.25rem + 2px);
        min-width: 5rem;
        padding: .375rem .75rem;
    }

    .color-row .dropdown-toggle,
    .color-dropdown > .dropdown-menu,
    .selected-color {
        min-width: 10rem;
    }

    .dropdown-menu .dropdown-menu {
        top: auto;
        left: 100%;
        transform: translateY(-2rem);
    }

    .dropdown-item + .dropdown-menu {
        display: block;
        opacity: 0;
        transition: opacity .3s 1s;
    }

    .dropdown-item.submenu::after {
        content: '▸';
        margin-left: 0.5rem;
    }

    .dropdown-item:hover + .dropdown-menu,
    .dropdown-item.active .dropdown-menu {
        opacity: 1;
        transition: opacity .3s .1s;
        display: block;
    }

    .colorbg:before {content: '\00a0';}


    .colorbg.bg-1 {background: url(https://static-ru.insales.ru/files/1/4222/13750398/original/bg-5-sm.jpg) repeat;}
    .colorbg.bg-2 {background: url(https://static-ru.insales.ru/files/1/4225/13750401/original/bg-3-sm.jpg) repeat;}
    .colorbg.bg-3 {background: url(https://static-ru.insales.ru/files/1/4221/13750397/original/bg-1-sm.jpg) repeat;}
    .colorbg.bg-4 {background: url(https://static-ru.insales.ru/files/1/4223/13750399/original/bg-2-sm.jpg) repeat;}
    .colorbg.bg-5 {background: url(https://static-ru.insales.ru/files/1/4220/13750396/original/bg-4-sm.jpg) repeat;}
</style>