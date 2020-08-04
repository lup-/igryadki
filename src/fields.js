export default {
    gryadka: [
        {
            code: 'type', title: 'Тип', type: 'radio',
            values: [
                {value: 'hard', title: 'Усиленная'},
                {value: 'simple', title: 'Простая'},
            ]
        },
        {
            code: 'color',
            title: 'Выбрать цвет',
            type: 'color',
            default: ''
        },
        {
            code: 'bort',
            title: 'Высота борта',
            type: 'radio',
            values: [
                {value: 14, title: '14 см'},
                {value: 19, title: '19 см'},
                {value: 24, title: '24 см'},
            ]
        },
        {
            code: 'width',
            title: 'Ширина',
            type: 'radio',
            values: [
                {value: 65, title: '65 см'},
                {value: 80, title: '80 см'},
                {value: 100, title: '100 см'},
                {value: 120, title: '120 см'},
            ]
        },
        {
            code: 'length',
            title: 'Длина',
            type: 'radio',
            values: [
                {value: 1, title: '1 м'},
                {value: 2, title: '2 м'},
                {value: 3, title: '3 м'},
                {value: 4, title: '4 м'},
                {value: 5, title: '5 м'},
                {value: 6, title: '6 м'},
                {value: 7, title: '7 м'},
                {value: 8, title: '8 м'},
                {value: 9, title: '9 м'},
                {value: 10, title: '10 м'},
            ]
        },
        {
            code: 'quantity',
            title: 'Количество',
            type: 'int',
            default: 1,
        },
    ],
    klumba: [
        {
            code: 'form',
            title: 'Форма',
            type: 'radio',
            values: [
                {value: 'square', title: 'Квадратная'},
                {value: 'poly', title: 'Многоугольная'},
            ]
        },
        {
            code: 'levels',
            title: 'Ярусы',
            type: 'radio',
            values: [
                {value: 1, title: '1 ярус'},
                {value: 2, title: '2 яруса'},
                {value: 3, title: '3 яруса'},
            ]
        },
        {
            code: 'color',
            title: 'Выбрать цвет',
            type: 'color',
            default: ''
        },
        {
            code: 'bort',
            title: 'Высота борта',
            type: 'radio',
            values: [
                {value: 14, title: '14 см'},
                {value: 19, title: '19 см'},
                {value: 24, title: '24 см'},
            ]
        },
        {
            code: 'diameter',
            title: 'Длина/диаметр',
            getTitle: function(selectedValues) {
                let title = 'Длина/диаметр';

                if (selectedValues.form === 'square') {
                    title = 'Длина';
                }

                if (selectedValues.form === 'poly') {
                    title = 'Диаметр';
                }

                if (selectedValues.levels > 0) {
                    let levels = (new Array(selectedValues.levels)).fill().map( (_, index) => index + 1 );
                    title += ' ' + levels.join('-') + ' ярус';
                }

                return title;
            },
            type: 'radio',
            filter: function (value) {
                let levels = this.values['levels'] || 1;
                return value.levels === levels;
            },
            values: [
                {value: 30, title: '30 см', levels: 1},
                {value: 40, title: '40 см', levels: 1},
                {value: 50, title: '50 см', levels: 1},
                {value: 60, title: '60 см', levels: 1},
                {value: 80, title: '80 см', levels: 1},
                {value: 100, title: '100 см', levels: 1},
                {value: 120, title: '120 см', levels: 1},
                {value: 140, title: '140 см', levels: 1},
                {value: 160, title: '160 см', levels: 1},
                {value: 180, title: '180 см', levels: 1},
                {value: 200, title: '200 см', levels: 1},

                {value: 80, title: '80-40 см', levels: 2},
                {value: 100, title: '100-60 см', levels: 2},
                {value: 120, title: '120-80 см', levels: 2},
                {value: 140, title: '140-100 см', levels: 2},
                {value: 160, title: '160-120 см', levels: 2},
                {value: 180, title: '180-140 см', levels: 2},
                {value: 200, title: '200-160 см', levels: 2},

                {value: 120, title: '120-80-40 см', levels: 3},
                {value: 140, title: '140-100-60 см', levels: 3},
                {value: 160, title: '160-120-80 см', levels: 3},
                {value: 180, title: '180-140-100 см', levels: 3},
                {value: 200, title: '200-160-120 см', levels: 3},
            ]
        },
        {
            code: 'quantity',
            title: 'Количество',
            type: 'int',
            default: 1,
        },
    ],
    teplica: [
        {
            code: 'form',
            title: 'Форма грядок',
            type: 'radio',
            values: [
                {value: 'П', title: false, image: 'https://static-eu.insales.ru/files/1/332/9912652/original/igryadki-v-teplicu-U.PNG'},
                {value: 'Ш', title: false, image: 'https://static-ru.insales.ru/files/1/335/9912655/original/igryadki-v-teplicu-I-I-I.PNG'},
                {value: 'II', title: false, image: 'https://static-ru.insales.ru/files/1/333/9912653/original/igryadki-v-teplicu-II.PNG'},
                {value: 'IiI', title: false, image: 'https://static-ru.insales.ru/files/1/334/9912654/original/igryadki-v-teplicu-IiI.PNG'},
            ]
        },
        {
            code: 'teplica',
            title: 'Размер теплицы',
            type: 'radio',
            values: [
                {value: '3x4', title: 'Теплица 3 x 4 м'},
                {value: '3x6', title: 'Теплица 3 x 6 м'},
                {value: '3x8', title: 'Теплица 3 x 8 м'},
                {value: '3x10', title: 'Теплица 3 x 10 м'},
            ]
        },
        {
            code: 'type', title: 'Тип', type: 'radio',
            values: [
                {value: 'hard', title: 'Усиленная'},
                {value: 'simple', title: 'Простая'},
            ]
        },
        {
            code: 'color',
            title: 'Выбрать цвет',
            type: 'color',
            default: ''
        },
        {
            code: 'bort',
            title: 'Высота борта',
            type: 'radio',
            values: [
                {value: 14, title: '14 см'},
                {value: 19, title: '19 см'},
                {value: 24, title: '24 см'},
            ]
        },
        {
            code: 'quantity',
            title: 'Количество',
            type: 'int',
            default: 1,
        },
    ],
}