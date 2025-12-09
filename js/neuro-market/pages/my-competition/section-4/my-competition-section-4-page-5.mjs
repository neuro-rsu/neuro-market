import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/checkbox-group-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import CompetitionDataSource from '../section-1/my-competition-datasource.mjs'

// import Chart from 'chart.js/auto';

import CompetitionTypeDataset from '../../my-competition-types/my-competition-types-dataset.mjs'
import CompetitionTypeDataSource from '../../my-competition-types/my-competition-types-datasource.mjs'

import CompetitionStageDataset from '../../my-competition-stages/my-competition-stages-dataset.mjs'
import CompetitionStageDataSource from '../../my-competition-stages/my-competition-stages-datasource.mjs'

import SportsDisciplineDataset from '../../my-sports-disciplines/section-1/my-sports-disciplines-dataset.mjs'
import SportsDisciplineDataSource from '../../my-sports-disciplines/section-1/my-sports-disciplines-datasource.mjs'

import CityDataset from '../../my-cities/my-cities-dataset.mjs'
import CityDataSource from '../../my-cities/my-cities-datasource.mjs'

import AgeGroupDataset from '../../my-age-groups/my-age-groups-dataset.mjs'
import AgeGroupDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'

import DataSet from './my-competition-dataset.mjs'

class MyCompetitionSection4Page5 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            competitionTypeDataSource: {type: Object, default: null},
            competitionStageDataSource: {type: Object, default: null},
            sportsDisciplineDataSource: {type: Object, default: null},
            sportsmenDataSource: { type: Object, default: null },
            cityDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            menNumber: {type: BigInt, default: 0},
            womenNumber: {type: BigInt, default: 0},
            regionNumber: {type: BigInt, default: 0},
            clubNumber: {type: BigInt, default: 0},
            parent: { type: Object, default: {} },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: safe center;
                    height: 100%;
                    width: 100%;
                    gap: 10px;
                }
                .container {
                    /* min-width: min(600px, 50vw); */
                    /* max-width: 100600px; */
                    /* max-width: 100%; */
                    width: 80%;
                    height: 100%;
                }
                .name-group {
                    display: flex;
                    gap: 10px;
                }
                canvas {
                    width: 100%;
                }
            `
        ]
    }

    render() {
        return html`
            <div class="container">
                <!-- <div class="table">
                    <simple-table @click=${this.tableClick} .hideHead=${true} .columns=${this.columns} .rows=${this.items}></simple-table>
                </div> -->
                <canvas id="chart"></canvas>
            </div>
        `;
    }

    copyToClipboard(e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(e.target.value)
        }
    }

    async createCompetitionId(e) {
        const target = e.target
        const year = this.item.startDate.split("-")[0]
        const id = await DataSet.createCompetitionId({
            countryCode: this.item?.city?.region?.country?.flag.toUpperCase(),
            regionCode: this.item?.city?.region?.code,
            year,
        })
        target.setValue(id);
    }

    showPage(page) {
        location.hash = page;
    }

    validateInput(e) {
        // if (e.target.value !== "") {
        //     let currentItem = e.target.currentObject ?? this.item
        //     if (!this.oldValues.has(e.target)) {
        //         if (Array.isArray(e.target.value)) {
        //             this.oldValues.set(e.target, e.target.oldValue)
        //         } else {
        //             this.oldValues.set(e.target, e.target.value)
        //         }
        //     }
        //     else {
        //         const oldValue = this.oldValues.get(e.target)
        //         if (Array.isArray(oldValue) && oldValue.length === e.target.value.length) {
        //             if (e.target.value.every(item1 => oldValue.some( item2 =>
        //                 item1.name ===  item2.name &&
        //                 item1.gender ===  item2.gender
        //             ))) {
        //                 this.oldValues.delete(e.target)
        //             }
        //         } else if (oldValue === e.target.value) {
        //             this.oldValues.delete(e.target)
        //         }
        //     }

        //     currentItem[e.target.id] = e.target.value

        //     if (e.target.id === 'name' || e.target.id === 'startDate' || e.target.id === 'endDate' || e.target.id === 'stage') {
        //         this.parentNode.parentNode.host.requestUpdate()
        //     }
        //     this.isModified = this.oldValues.size !== 0;
        // }
    }

    // colorize(opaque, hover, ctx) {
    //     const v = ctx.parsed;
    //     const c = v < -50 ? '#D60000'
    //       : v < 0 ? '#F46300'
    //       : v < 50 ? '#0358B6'
    //       : '#44DE28';

    //     const opacity = hover ? 1 - Math.abs(v / 150) - 0.2 : 1 - Math.abs(v / 150);

    //     return opaque ? c : Utils.transparentize(c, opacity);
    // }

    // hoverColorize(ctx) {
    //     return colorize(false, true, ctx);
    // }

//     generateData() {
//         return Utils.numbers({
//           count: DATA_COUNT,
//           min: -100,
//           max: 100
//         });
//       }

//     data = {
//         datasets: [{
//           data: this.generateData()
//         }]
//       };

//     config = {
//         type: 'pie',
//         data: data,
//         options: {
//           plugins: {
//             legend: false,
//             tooltip: false,
//           },
//           elements: {
//             arc: {
//               backgroundColor: colorize.bind(null, false, false),
//               hoverBackgroundColor: hoverColorize
//             }
//           }
//         }
//       };

//     DATA_COUNT = 5;
//     // Utils.srand(110);

//     actions = [
//     {
//         name: 'Randomize',
//         handler(chart) {
//         chart.data.datasets.forEach(dataset => {
//             dataset.data = generateData();
//         });
//         chart.update();
//         }
//     },
//     {
//         name: 'Toggle Doughnut View',
//         handler(chart) {
//         if (chart.options.cutout) {
//             chart.options.cutout = 0;
//         } else {
//             chart.options.cutout = '50%';
//         }
//         chart.update();
//         }
//     }
// ];

// createRadialGradient3(context, c1, c2, c3) {
//     const chartArea = context.chart.chartArea;
//     if (!chartArea) {
//       // This case happens on initial chart load
//       return;
//     }

//     const chartWidth = chartArea.right - chartArea.left;
//     const chartHeight = chartArea.bottom - chartArea.top;
//     if (width !== chartWidth || height !== chartHeight) {
//       cache.clear();
//     }
//     let gradient = cache.get(c1 + c2 + c3);
//     if (!gradient) {
//       // Create the gradient because this is either the first render
//       // or the size of the chart has changed
//       width = chartWidth;
//       height = chartHeight;
//       const centerX = (chartArea.left + chartArea.right) / 2;
//       const centerY = (chartArea.top + chartArea.bottom) / 2;
//       const r = Math.min(
//         (chartArea.right - chartArea.left) / 2,
//         (chartArea.bottom - chartArea.top) / 2
//       );
//       const ctx = context.chart.ctx;
//       gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
//       gradient.addColorStop(0, c1);
//       gradient.addColorStop(0.5, c2);
//       gradient.addColorStop(1, c3);
//       cache.set(c1 + c2 + c3, gradient);
//     }

//     return gradient;
//   }

    menCount() {
        return this.sportsmenDataSource?.items?.reduce( (a, item) => item.gender == 0 ? a + 1 : a, 0)
    }

    womenCount() {
        return this.sportsmenDataSource?.items?.reduce( (a, item) => item.gender == 1 ? a + 1 : a, 0)
    }

    regionCount() {
        const a = new Set(this.sportsmenDataSource?.items.map(item => item.region?.name))

        return a.size
    }

    clubCount() {
        const a = new Map(this.sportsmenDataSource?.items.map(item => [item.club?._id, item.club?.name]))
        return a.size
    }

    pdfMethod() {
        const docInfo = {
          info: {
            title: "Referees",
            author: "Polyathlon systems",
          },

          pageSize: "A4",
          pageOrientation: 'portrait',
          pageMargins: [80, 30, 70, 60],

          content: [
            {
                text: "Всероссийская федерация Полиатлонаыыыыыыыыыыыыыыыыыыыыыыыы",
                fontSize: 14,
                alignment: "center",
                margin: [10, 0, 0, 0],
            },
            {
                text: "Справка о проведённом общероссийской спортивной федерацией всероссийских и межрегиональных спортивных мероприятиях по полиатлону за (year) год",
                fontSize: 14,
                bold:true,
                alignment: "center",
                margin: [10, 20, 0, 0],
            },
            {
                text: `${this.parent?.name.name} - (year) по полиатлону в спортивной дисциплине ${this.parent?.sportsDiscipline1?.name}`,
                fontSize: 14,
                bold:true,
                alignment: "center",
                margin: [60, 20, 50, 0],
            },
            {
                text: `Сроки и место проведения: ${this.parent?.sportsDiscipline1?.name}, г.${this.parent?.city.name} ${this.parent?.region.name}`,
                fontSize: 11,
                alignment: "left",
                margin: [10, 20, 0, 0],
            },
            {
                text: "(gender)",
                fontSize: 11,
                alignment: "left",
                margin: [10, 0, 0, 0],
            },
            {
                text: `Вид программы: ${this.parent?.sportsDiscipline1?.name}`,
                fontSize: 11,
                alignment: "left",
                margin: [10, 0, 0, 0],
            },
            {
                text: `Приняли участие: общее количество спортсменов - ${this.menNumber + this.womenNumber} чел., в том числе:`,
                fontSize: 11,
                alignment: "left",
                margin: [10, 0, 0, 0],
            },
            {
                columns: [
                    {
                        text: "мужчин",
                        fontSize: 11,
                        alignment: "left",
                        margin: [85, 0, 0, 0],
                    },
                    {
                        text: `- ${this.menNumber} чел.;`,
                        alignment: "left",
                        fontSize: 11,
                    },
                ],
            },
            {
                columns: [
                    {
                        text: "женщин",
                        fontSize: 11,
                        alignment: "left",
                        margin: [85, 0, 0, 0],
                    },
                    {
                        text: `- ${this.womenNumber} чел.;`,
                        alignment: "left",
                        fontSize: 11,
                    },
                ],
            },
            {
                columns: [
                    {
                        text: "количество субъектов РФ",
                        fontSize: 11,
                        alignment: "left",
                        margin: [85, 0, 0, 0],
                    },
                    {
                        text: `- ${this.regionNumber};`,
                        alignment: "left",
                        fontSize: 11,
                    },
                ],
            },
            {
                columns: [
                    {
                        text: "количество клубов",
                        fontSize: 11,
                        alignment: "left",
                        margin: [85, 0, 0, 0],
                    },
                    {
                        text: `- ${this.clubNumber}.`,
                        alignment: "left",
                        fontSize: 11,
                    },
                ],
            },
            {
                text: "Награждены медалями Минспорта России за:",
                fontSize: 11,
                alignment: "left",
                margin: [10, 0, 0, 0],
            },
            {
                text: "1 место мужчины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "2 место мужчины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "3 место мужчины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "1 место женщины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "2 место женщины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "3 место женщины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "Сведения о командном зачёте среди субъектов РФ",
                fontSize: 11,
                alignment: "left",
                margin: [10, 10, 0, 5],
            },
            {
                table:{
                    widths: [ 20, 140, 50, 67, 67, 67 ],
                    body: [
                    [ {fontSize: 11, text: 'Место', alignment: "center"}, {fontSize: 11, text: 'Субъект РФ', alignment: "center"}, {fontSize: 11, text: 'Количество медалей', alignment: "center"}, {fontSize: 11, text: 'Сумма очков, набранная медалистами', alignment: "center"}, {fontSize: 11, text: 'Количество спортсменов в сборной команде', alignment: "center"}, {fontSize: 11, text: 'Количество спортсменов-медалистов', alignment: "center"} ],
                    [ {fontSize: 11, text: '1', alignment: "center"}, {fontSize: 11, text: 'Value', alignment: "left"}, {fontSize: 11, text: 'Value', alignment: "center"}, {fontSize: 11, text: 'Value', alignment: "center"}, {fontSize: 11, text: 'Value', alignment: "center"}, {fontSize: 11, text: 'Value', alignment: "center"} ],
                    ],
                    headerRows: 1,
                }
            },
            {
                columns: [
                    {
                        text: "(position.name)",
                        margin: [0, 20, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "(name)",
                        alignment: "left",
                        margin: [0, 20, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                columns: [

                    {
                        text: "(category.name)",
                        margin: [0, 0, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "`(г. ${mainReferee?.city?.name}, ${mainReferee?.city?.region?.name})`",
                        alignment: "left",
                        margin: [0, 0, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                columns: [
                    {
                        text: "(position.name)",
                        margin: [0, 20, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "(name)",
                        alignment: "left",
                        margin: [0, 20, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                columns: [

                    {
                        text: "(category.name)",
                        margin: [0, 0, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "`(г. ${mainReferee?.city?.name}, ${mainReferee?.city?.region?.name})`",
                        alignment: "left",
                        margin: [0, 0, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
          ],

          styles: {
            header0:{
            }
          }
        };

        pdfMake.createPdf(docInfo).open();
    }


    chartLabels() {
        return ['МСМК', 'МС', 'КМС', 'I', 'II', 'III', 'I юн', 'II юн', 'III юн', 'б/р']
    }

    chartMenDataset() {
        const categoryNames = ['МСМК', 'МС', 'КМС', 'I', 'II', 'III', 'I юн', 'II юн', 'III юн', 'б/р']
        const dataset = Array(categoryNames.length)
        categoryNames.forEach((category, index) => {
            dataset[index] = this.teamDataSource.items.men.get(category)
        });
        return dataset
    }

    drawChart(){
        this.chart = new Chart(this.$id('chart'), {
            type: 'bar',
            data: {
              labels: this.categoryDataSource.indexes,
              datasets: [{
                data: this.categoryDataSource.rows.map(value => value[1]),
                label: 'Мужчины',
                hidden: true,
                borderWidth: 1,
                backgroundColor: 'rgba(30, 144, 255, 0.9)',
              },
              {
                data: this.categoryDataSource.rows.map(value => value[2]),
                label: 'Женщины',
                hidden: true,
                borderWidth: 1,
                backgroundColor: 'rgba(255, 179, 217, 0.9)',
              },
              {
                data: this.categoryDataSource.rows.map(value => value[3]),
                label: 'Итого',
                borderWidth: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'rgb(255, 255, 255)',
                        },
                        position: 'bottom'
                    },
                    tooltip: true,
                    title: {
                        display: true,
                        text: 'Уровень подготовки спортсменов',
                        color: 'rgba(255, 255, 255, 0.9)',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: {
                            color: '#FFF',
                        },
                        ticks: {
                            color: '#FFF'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                    },
                    x: {
                        border: {
                            color: '#FFF',
                        },
                        ticks: {
                            color: '#FFF'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                    }
                }
            }
          });
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentCountryItem')) {
            this.currentPage = 0;
        }
        if (changedProps.has('teamDataSource') && this.teamDataSource) {
            this.drawChart();
        }
    }

    async firstUpdated() {
        super.firstUpdated()
        this.drawChart()

        //   this.chart = new Chart(this.$id('chart'), {
        //     type: 'pie',
        //     data: {
        //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        //       datasets: [{
        //         label: '# of Votes',
        //         data: [12, 19, 3, 5, 2, 3],
        //         borderWidth: 1
        //       }]
        //     },
        //     options: {
        //         plugins: {
        //           legend: false,
        //           tooltip: false,
        //         },
        //         // elements: {
        //         //   arc: {
        //         //     backgroundColor: colorize.bind(null, false, false),
        //         //     hoverBackgroundColor: hoverColorize
        //         //   }
        //         // }
        //       }
        //   });

        // this.competitionTypeDataSource = new CompetitionTypeDataSource(this, await CompetitionTypeDataset.getDataSet())
        // this.sportsDisciplineDataSource = new SportsDisciplineDataSource(this, await SportsDisciplineDataset.getDataSet())
        // this.competitionStageDataSource = new CompetitionStageDataSource(this, await CompetitionStageDataset.getDataSet())
        // this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
        // this.ageGroupDataSource = new AgeGroupDataSource(this, await AgeGroupDataset.getDataSet())
    }
}

customElements.define("my-competition-section-4-page-5", MyCompetitionSection4Page5);