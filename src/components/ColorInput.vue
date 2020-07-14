<template>
    <div class="color-input d-flex">
        <b-dropdown variant="outline-primary"
                class="color-dropdown color-text mb-2"
                :text="selectedColor ? selectedColor.title : noColor.title"
        >
            <template v-slot:default="{hide}">
                <a class="dropdown-item" href="#" @click="selectColor(noColor, hide)">{{noColor.title}}</a>
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
                                @click="selectColor(colorData, hide)"
                        >
                            <span v-if="groupName === 'Рисунок'">&nbsp;</span>
                        </a>
                    </div>
                </li>
            </template>
        </b-dropdown>

        <div class="color-text ml-2">
            <div class="selected-color" :class="selectedColor ? selectedColor.class : ''"><span>&nbsp;</span></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ColorInput",
        props: ['value'],
        data() {
            let colors = [
                {code: '', title: 'Цинк, без покрытия', class: '', bgColor: '', textColor: '', groups: []},
                {code: 'ral1014', title: 'RAL 1014 Слоновая кость', class: 'ral1014', bgColor: '#ded09f', textColor: '', groups: ['Светлый', 'Желтый']},
                {code: 'ral1018', title: 'RAL 1018 Цинково-желтый', class: 'ral1018', bgColor: '#f3e03b', textColor: '', groups: ['Светлый', 'Желтый']},
                {code: 'ral2004', title: 'RAL 2004 Оранжевый', class: 'ral2004', bgColor: '#d35f23', textColor: 'white', groups: ['Оранжевый']},
                {code: 'ral3003', title: 'RAL 3003 Рубиново-красный', class: 'ral3003', bgColor: '#8d1d2c', textColor: 'white', groups: ['Темный', 'Красный']},
                {code: 'ral3005', title: 'RAL 3005 Винно-красный', class: 'ral3005', bgColor: '#5e2028', textColor: 'white', groups: ['Темный', 'Красный']},
                {code: 'ral3009', title: 'RAL 3009 Оксид красный', class: 'ral3009', bgColor: '#703731', textColor: 'white', groups: ['Темный', 'Красный']},
                {code: 'ral3011', title: 'RAL 3011 Коричнево-красный', class: 'ral3011', bgColor: '#7e292c', textColor: 'white', groups: ['Темный', 'Красный', 'Коричневый']},
                {code: 'ral5002', title: 'RAL 5002 Ультрамарин', class: 'ral5002', bgColor: '#2b2c7c', textColor: 'white', groups: ['Темный', 'Синий']},
                {code: 'ral5005', title: 'RAL 5005 Сигнальный синий', class: 'ral5005', bgColor: '#154889', textColor: 'white', groups: ['Темный', 'Синий']},
                {code: 'ral6002', title: 'RAL 6002 Лиственно-зеленый', class: 'ral6002', bgColor: '#276235', textColor: 'white', groups: ['Темный', 'Зеленый']},
                {code: 'ral6005', title: 'RAL 6005 Зелёный мох', class: 'ral6005', bgColor: '#0f4336', textColor: 'white', groups: ['Темный', 'Зеленый']},
                {code: 'ral7004', title: 'RAL 7004 Сигнальный серый', class: 'ral7004', bgColor: '#9ea0a1', textColor: '', groups: ['Светлый', 'Темный', 'Серый']},
                {code: 'ral9002', title: 'RAL 9002 Светло-серый', class: 'ral9002', bgColor: '#ddded4', textColor: '', groups: ['Светлый', 'Серый']},
                {code: 'ral9004', title: 'RAL 9004 Сигнальный черный', class: 'ral9004', bgColor: '#2e3032', textColor: 'white', groups: ['Темный', 'Серый']},
                {code: 'ral9003', title: 'RAL 9003 Сигнальный белый', class: 'ral9003', bgColor: '#f4f8f4', textColor: '', groups: ['Светлый', 'Серый']},
                {code: 'ral8004', title: 'RAL 8004 Терракот', class: 'ral8004', bgColor: '#8f4e35', textColor: 'white', groups: ['Темный', 'Коричневый']},
                {code: 'ral8017', title: 'RAL 8017 Шоколадно-коричневый', class: 'ral8017', bgColor: '#44322d', textColor: 'white', groups: ['Темный', 'Коричневый']},
                {code: 'bg-1', title: 'Темное дерево', class: 'colorbg bg-1', bgColor: '', textColor: '', groups: ['Рисунок']},
                {code: 'bg-2', title: 'Светлое дерево', class: 'colorbg bg-2', bgColor: '', textColor: '', groups: ['Рисунок']},
                {code: 'bg-3', title: 'Камень природный', class: 'colorbg bg-3', bgColor: '', textColor: '', groups: ['Рисунок']},
                {code: 'bg-4', title: 'Кирпич', class: 'colorbg bg-4', bgColor: '', textColor: '', groups: ['Рисунок']},
                {code: 'bg-5', title: 'Камень песчаник', class: 'colorbg bg-5', bgColor: '', textColor: '', groups: ['Рисунок']},
            ];
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
                let customCss = `
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

                .colorbg:before {content: '\\00a0';}

                .colorbg.bg-1 {background: url(https://igryadki.ru/admin2/assets/169274890) repeat;}
                .colorbg.bg-2 {background: url(https://igryadki.ru/admin2/assets/169275269) repeat;}
                .colorbg.bg-3 {background: url(https://igryadki.ru/admin2/assets/169275276) repeat;}
                .colorbg.bg-4 {background: url(https://igryadki.ru/admin2/assets/169275445) repeat;}
                .colorbg.bg-5 {background: url(https://igryadki.ru/admin2/assets/169275446) repeat;}
                `;

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
</style>