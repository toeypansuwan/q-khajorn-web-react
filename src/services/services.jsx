import axios from "axios";
import moment from 'moment';
import th from 'moment/dist/locale/th';

const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
const fallbackImage = "data:image/png;base64,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";

const nameDaysFormat = (nameday) => {
    switch (nameday) {
        case "Sunday":
            return "อาทิตย์";
        case "Monday":
            return "จันทร์";
        case "Tuesday":
            return "อังคาร";
        case "Wednesday":
            return "พุธ";
        case "Thursday":
            return "พฤหัสบดี";
        case "Friday":
            return "ศุกร์"
        case "Saturday":
            return "เสาร์";
        default:
            return null;
    }
}

const timeTo_hmm = (time) => {
    return moment(time, 'HH:mm:ss').format('H.mm');
}

const compareDaysOfWeek = (days) => {
    return days?.sort((a, b) => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return dayNames.indexOf(a) - dayNames.indexOf(b);
    })
}

const compareAndCommaDaysOfWeek = (days) => {
    return compareDaysOfWeek(days?.map((day) => day.dayname))?.map((day, i) => {
        const dayFormat = nameDaysFormat(day);
        if (i < days?.length - 1) {
            return `${dayFormat},`
        }
        return `${(dayFormat)}`
    })
}

const binarySearch = (array, target, prop) => {
    let start = 0;
    let end = array.length - 1;
    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        if (target < array[mid][prop]) {
            end = mid - 1;
        }
        else if (target > array[mid][prop]) {
            start = mid + 1;
        }
        else {
            return mid;
        }
    }
    return -1;
}

const getLengthDayOfMonth = (date = null) => {
    let currentDay;
    if (date) {
        currentDay = moment(date);
    } else {
        currentDay = moment().startOf('day');
    }
    const endDayOfMonth = moment().endOf('month').add(1, 'month');
    // console.log(endDayOfMonth.diff(currentDay, 'days'))
    // console.log("statt", currentDay.format("DD-MM-YYYY"), "end", endDayOfMonth.format("DD-MM-YYYY"))
    // .add(2, 'month')
    return endDayOfMonth.diff(currentDay, 'days');
}
const getMarkerDate = async ({ date, id_zone }) => {
    try {
        if (!id_zone) {
            return;
        }
        const days = await getDays(id_zone);
        let data = [];
        for (let index = 0; index < getLengthDayOfMonth(date); index++) {
            const day = new Date(moment(date).add(index, 'days').format('YYYY-MM-DD'))
            const isDay = day.toLocaleDateString('en', { weekday: 'long' });
            if (days.includes(isDay)) {
                const { mapArea } = await getSection({ d: day, id: id_zone });
                data.push(...mapArea.map(i => ({ id: i.id, status: i.status, day: moment(i.day).format("YYYY-MM-DD"), color: i.preFillColor })))
            }
        }
        return data;
    } catch (err) {
        console.error(err)
    }
}
const getDays = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL_API}market/${id}/open-days`)
        const days = res.data.map(i => i.dayname)
        return days;
    } catch (err) {
        console.error(err)
    }
}
const getSection = ({ d, id }) => {
    const date = moment(d).format("YYYY-MM-DD")
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL_API}market/${id}/section`, { date }).then(res => {
            const mapArea = res.data.map((section) => {
                const { id, color, name, points, shape, price, image, status, order_id } = section;
                const polygon = points.map(p => {
                    const { axis_x, axis_y } = p;
                    return [axis_x, axis_y];
                })
                let mainColor = color;
                mainColor = mainColor.replace(/[^,\d]/g, ""); // remove non-digit and non-comma characters
                let rgba = mainColor.split(","); // split the string into an array
                rgba[3] = "1"; // set the alpha value to 1
                const activeColor = "rgba(" + rgba.join(",") + ")"; // join the array back into a string with the new alpha value
                return {
                    id,
                    title: name,
                    price,
                    shape: shape,
                    fillColor: activeColor,
                    strokeColor: "black",
                    preFillColor: color,
                    coords: polygon.flat(1),
                    polygon,
                    image,
                    status,
                    order_id,
                    day: d,
                }
            })
            resolve({ mapArea });
        }).catch(err => {
            console.error(err.response)
            reject(err);
        })
    })
}
const getOrderId = async (id) => {
    try {
        const data = await (await axios.get(`${BASE_URL_API}order/${id}`)).data
        return data;
    } catch (err) {
        console.error(err);
    }
}
const cancelOrder = async (id) => {
    try {
        const data = await (await axios.get(`${BASE_URL_API}order/cancel/${id}`)).data
        return data;
    } catch (err) {
        console.error(err);
    }
}

const x = [
    {
        "id": "469f9800-c45a-483f-b13e-bd24f3fb79f4",
        "title": "Hardwood",
        "shape": "poly",
        "name": "1",
        "fillColor": "#eab54d4d",
        "strokeColor": "black",
        "coords": [
            520.0646766169153,
            393.0348258706467,
            85.23880597014923,
            378.6069651741293,
            637,
            479,
            13.099502487562177,
            478.10945273631836,
            11.606965174129343,
            438.3084577114427
        ],
        "polygon": [
            [
                520.0646766169153,
                393.0348258706467
            ],
            [
                85.23880597014923,
                378.6069651741293
            ],
            [
                637,
                479
            ],
            [
                13.099502487562177,
                478.10945273631836
            ],
            [
                11.606965174129343,
                438.3084577114427
            ]
        ]
    },
    {
        "id": "1db62daa-22a4-4b02-b5c0-fffdcf77c66c",
        "title": "Carpet",
        "shape": "poly",
        "name": "2",
        "fillColor": "#eab54d4d",
        "strokeColor": "black",
        "coords": [
            126.5323383084577,
            345.273631840796,
            465.3383084577114,
            349.25373134328356,
            520.0646766169153,
            393.0348258706467,
            85.23880597014923,
            378.6069651741293
        ],
        "polygon": [
            [
                126.5323383084577,
                345.273631840796
            ],
            [
                465.3383084577114,
                349.25373134328356
            ],
            [
                520.0646766169153,
                393.0348258706467
            ],
            [
                85.23880597014923,
                378.6069651741293
            ]
        ]
    },
    {
        "id": "667d73b1-4583-4080-ab6b-5759f25440bb",
        "title": "Materials",
        "shape": "poly",
        "name": "3",
        "fillColor": "#eab54d4d",
        "strokeColor": "black",
        "coords": [],
        "polygon": []
    },
    {
        "id": "a87203cb-3916-48ea-856f-2bacab8b7eda",
        "title": "Floor",
        "shape": "poly",
        "name": "4",
        "fillColor": "#eab54d4d",
        "strokeColor": "black",
        "coords": [
            130.0149253731343,
            341.2935323383084,
            462.8507462686566,
            347.7611940298507,
            637,
            479,
            13.099502487562177,
            478.10945273631836,
            11.606965174129343,
            438.3084577114427
        ],
        "polygon": [
            [
                130.0149253731343,
                341.2935323383084
            ],
            [
                462.8507462686566,
                347.7611940298507
            ],
            [
                637,
                479
            ],
            [
                13.099502487562177,
                478.10945273631836
            ],
            [
                11.606965174129343,
                438.3084577114427
            ]
        ]
    },
    {
        "id": "37ed1569-1e68-4816-9033-1a88c53b39df",
        "title": "Electrical Fixture",
        "shape": "poly",
        "name": "5",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            521.0597014925372,
            335.820895522388,
            528.0248756218905,
            338.30845771144277,
            527.0298507462686,
            354.228855721393,
            518.0746268656716,
            349.25373134328356
        ],
        "polygon": [
            [
                521.0597014925372,
                335.820895522388
            ],
            [
                528.0248756218905,
                338.30845771144277
            ],
            [
                527.0298507462686,
                354.228855721393
            ],
            [
                518.0746268656716,
                349.25373134328356
            ]
        ]
    },
    {
        "id": "ce471cbe-4103-45cc-899c-2be6497dc79a",
        "title": "Electrical Fixture",
        "shape": "poly",
        "name": "6",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            531.5074626865671,
            342.2885572139303,
            538.4726368159203,
            342.78606965174123,
            538.4726368159203,
            357.7114427860696,
            530.5124378109452,
            355.72139303482584
        ],
        "polygon": [
            [
                531.5074626865671,
                342.2885572139303
            ],
            [
                538.4726368159203,
                342.78606965174123
            ],
            [
                538.4726368159203,
                357.7114427860696
            ],
            [
                530.5124378109452,
                355.72139303482584
            ]
        ]
    },
    {
        "id": "5fde0edd-4e1c-4130-9ee5-4ec6dfd34f46",
        "title": "Electrical Fixture",
        "shape": "poly",
        "name": "7",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            589.2189054726367,
            136.31840796019898,
            605.6368159203979,
            133.83084577114425,
            604.1442786069651,
            153.73134328358208,
            590.7114427860696,
            153.23383084577114
        ],
        "polygon": [
            [
                589.2189054726367,
                136.31840796019898
            ],
            [
                605.6368159203979,
                133.83084577114425
            ],
            [
                604.1442786069651,
                153.73134328358208
            ],
            [
                590.7114427860696,
                153.23383084577114
            ]
        ]
    },
    {
        "id": "976082e0-0653-4e5d-8094-cc351e482e72",
        "title": "Electrical Fixture",
        "shape": "poly",
        "name": "8",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            606.6318407960198,
            130.8457711442786,
            619.5671641791045,
            129.8507462686567,
            621.0597014925372,
            152.73631840796017,
            606.1343283582089,
            155.72139303482587
        ],
        "polygon": [
            [
                606.6318407960198,
                130.8457711442786
            ],
            [
                619.5671641791045,
                129.8507462686567
            ],
            [
                621.0597014925372,
                152.73631840796017
            ],
            [
                606.1343283582089,
                155.72139303482587
            ]
        ]
    },
    {
        "id": "cc3c2799-ce62-4236-b4f6-6f4b50e7b666",
        "title": "GWB",
        "shape": "poly",
        "name": "9",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            521.5621890547263,
            103.98009950248755,
            508.6268656716418,
            381.09452736318406,
            638.9701492537313,
            28.358208955223876,
            637.9751243781094,
            477.6119402985074
        ],
        "polygon": [
            [
                521.5621890547263,
                103.98009950248755
            ],
            [
                508.6268656716418,
                381.09452736318406
            ],
            [
                638.9701492537313,
                28.358208955223876
            ],
            [
                637.9751243781094,
                477.6119402985074
            ]
        ]
    },
    {
        "id": "6c682813-8162-42eb-b3a7-c7296a009b5a",
        "title": "Brick",
        "shape": "poly",
        "name": "10",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            465.8358208955224,
            137.81094527363183,
            520.5621890547263,
            103.98009950248755,
            507.6268656716418,
            381.09452736318406,
            464.3432835820895,
            350.7462686567164
        ],
        "polygon": [
            [
                465.8358208955224,
                137.81094527363183
            ],
            [
                520.5621890547263,
                103.98009950248755
            ],
            [
                507.6268656716418,
                381.09452736318406
            ],
            [
                464.3432835820895,
                350.7462686567164
            ]
        ]
    },
    {
        "id": "1c9cabf2-4306-46cd-9423-63c7156cf4d4",
        "title": "Materials",
        "shape": "poly",
        "name": "11",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [],
        "polygon": []
    },
    {
        "id": "53c311f7-4e1c-4636-ac7e-b9cdec0d7ab7",
        "title": "Right Wall",
        "shape": "poly",
        "name": "12",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            465.8358208955224,
            138.8059701492537,
            638.9701492537313,
            28.358208955223876,
            637.9751243781094,
            477.6119402985074,
            463.8457711442785,
            349.25373134328356
        ],
        "polygon": [
            [
                465.8358208955224,
                138.8059701492537
            ],
            [
                638.9701492537313,
                28.358208955223876
            ],
            [
                637.9751243781094,
                477.6119402985074
            ],
            [
                463.8457711442785,
                349.25373134328356
            ]
        ]
    },
    {
        "id": "21a3befd-c97b-476d-8e0c-7c98399988bf",
        "title": "Window",
        "shape": "poly",
        "name": "13",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            211.10945273631836,
            161.6915422885572,
            387.7263681592039,
            164.67661691542287,
            383.7462686567164,
            292.5373134328358,
            207.62686567164178,
            288.5572139303482
        ],
        "polygon": [
            [
                211.10945273631836,
                161.6915422885572
            ],
            [
                387.7263681592039,
                164.67661691542287
            ],
            [
                383.7462686567164,
                292.5373134328358
            ],
            [
                207.62686567164178,
                288.5572139303482
            ]
        ]
    },
    {
        "id": "2f36ad1d-b934-4fb0-9486-7f429ef46a1b",
        "title": "Front Wall",
        "shape": "poly",
        "name": "14",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            131.50746268656715,
            131.34328358208953,
            465.3383084577114,
            138.30845771144277,
            462.35323383084574,
            347.7611940298507,
            129.51741293532336,
            341.79104477611935
        ],
        "polygon": [
            [
                131.50746268656715,
                131.34328358208953
            ],
            [
                465.3383084577114,
                138.30845771144277
            ],
            [
                462.35323383084574,
                347.7611940298507
            ],
            [
                129.51741293532336,
                341.79104477611935
            ]
        ]
    },
    {
        "id": "f3653fb6-c1c5-4fe7-aec1-699d9da7bba1",
        "title": "Microwave",
        "shape": "poly",
        "name": "15",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            120.06467661691539,
            193.5323383084577,
            145.93532338308455,
            197.51243781094524,
            146.4328358208955,
            234.82587064676613,
            118.07462686567163,
            233.33333333333331
        ],
        "polygon": [
            [
                120.06467661691539,
                193.5323383084577
            ],
            [
                145.93532338308455,
                197.51243781094524
            ],
            [
                146.4328358208955,
                234.82587064676613
            ],
            [
                118.07462686567163,
                233.33333333333331
            ]
        ]
    },
    {
        "id": "eca521ca-11c6-4312-830b-3492829649df",
        "title": "Stove",
        "shape": "poly",
        "name": "16",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            85.73631840796017,
            254.22885572139302,
            85.73631840796017,
            279.10447761194024,
            139.46766169154228,
            282.08955223880594,
            162.85074626865668,
            276.1194029850746,
            118.07462686567163,
            274.6268656716418,
            117.57711442786066,
            264.67661691542287,
            115.08955223880594,
            249.7512437810945
        ],
        "polygon": [
            [
                85.73631840796017,
                254.22885572139302
            ],
            [
                85.73631840796017,
                279.10447761194024
            ],
            [
                139.46766169154228,
                282.08955223880594
            ],
            [
                162.85074626865668,
                276.1194029850746
            ],
            [
                118.07462686567163,
                274.6268656716418
            ],
            [
                117.57711442786066,
                264.67661691542287
            ],
            [
                115.08955223880594,
                249.7512437810945
            ]
        ]
    },
    {
        "id": "e8da6027-7563-4a50-9b7b-9ffc1bb1b613",
        "title": "Oven",
        "shape": "poly",
        "name": "17",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            145.4378109452736,
            288.0597014925373,
            164.34328358208953,
            282.08955223880594,
            166.33333333333331,
            353.731343283582,
            142.45273631840794,
            371.6417910447761
        ],
        "polygon": [
            [
                145.4378109452736,
                288.0597014925373
            ],
            [
                164.34328358208953,
                282.08955223880594
            ],
            [
                166.33333333333331,
                353.731343283582
            ],
            [
                142.45273631840794,
                371.6417910447761
            ]
        ]
    },
    {
        "id": "5248f935-10c8-4b16-8cff-21b66d2cb56f",
        "title": "Countertop",
        "shape": "poly",
        "name": "18",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            70.31343283582089,
            287.56218905472633,
            82.25373134328356,
            281.09452736318406,
            140.46268656716416,
            283.0845771144278,
            77.77611940298505,
            303.4825870646766
        ],
        "polygon": [
            [
                70.31343283582089,
                287.56218905472633
            ],
            [
                82.25373134328356,
                281.09452736318406
            ],
            [
                140.46268656716416,
                283.0845771144278
            ],
            [
                77.77611940298505,
                303.4825870646766
            ]
        ]
    },
    {
        "id": "5b40c828-ecb3-4633-b181-78e2832823b1",
        "title": "Double Cabinet",
        "shape": "poly",
        "name": "19",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            108.62189054726366,
            298.5074626865671,
            139.46766169154228,
            289.5522388059701,
            138.47263681592037,
            364.1791044776119,
            106.13432835820893,
            390.54726368159197
        ],
        "polygon": [
            [
                108.62189054726366,
                298.5074626865671
            ],
            [
                139.46766169154228,
                289.5522388059701
            ],
            [
                138.47263681592037,
                364.1791044776119
            ],
            [
                106.13432835820893,
                390.54726368159197
            ]
        ]
    },
    {
        "id": "7810e113-49d2-4284-9e49-318af8378663",
        "title": "Dishwasher",
        "shape": "poly",
        "name": "20",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            81.25870646766168,
            308.45771144278604,
            108.12437810945272,
            300.4975124378109,
            106.13432835820893,
            393.53233830845767,
            80.26368159203977,
            410.4477611940298
        ],
        "polygon": [
            [
                81.25870646766168,
                308.45771144278604
            ],
            [
                108.12437810945272,
                300.4975124378109
            ],
            [
                106.13432835820893,
                393.53233830845767
            ],
            [
                80.26368159203977,
                410.4477611940298
            ]
        ]
    },
    {
        "id": "5998531a-25b3-4288-adbe-53c4470a369b",
        "title": "Refrigerator",
        "shape": "poly",
        "name": "21",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            18.572139303482572,
            169.65174129353233,
            82.25373134328356,
            182.5870646766169,
            80.76119402985074,
            424.8756218905472,
            14.09452736318407,
            475.6218905472636
        ],
        "polygon": [
            [
                18.572139303482572,
                169.65174129353233
            ],
            [
                82.25373134328356,
                182.5870646766169
            ],
            [
                80.76119402985074,
                424.8756218905472
            ],
            [
                14.09452736318407,
                475.6218905472636
            ]
        ]
    },
    {
        "id": "9db9f57d-c15e-4d3a-abb7-faa7e69657c8",
        "title": "Single Cabinet",
        "shape": "poly",
        "name": "22",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            140.46268656716416,
            142.28855721393032,
            149.91542288557213,
            148.75621890547262,
            147.4278606965174,
            234.3283582089552,
            138.9701492537313,
            232.3383084577114
        ],
        "polygon": [
            [
                140.46268656716416,
                142.28855721393032
            ],
            [
                149.91542288557213,
                148.75621890547262
            ],
            [
                147.4278606965174,
                234.3283582089552
            ],
            [
                138.9701492537313,
                232.3383084577114
            ]
        ]
    },
    {
        "id": "d2c06088-49ce-404b-ab78-d865a336248d",
        "title": "Double Cabinet",
        "shape": "poly",
        "name": "23",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            111.10945273631839,
            128.35820895522386,
            139.46766169154228,
            142.7860696517413,
            139.96517412935322,
            196.01990049751242,
            112.10447761194027,
            191.04477611940297
        ],
        "polygon": [
            [
                111.10945273631839,
                128.35820895522386
            ],
            [
                139.46766169154228,
                142.7860696517413
            ],
            [
                139.96517412935322,
                196.01990049751242
            ],
            [
                112.10447761194027,
                191.04477611940297
            ]
        ]
    },
    {
        "id": "07feade7-e370-4384-bb96-c21f9eedb238",
        "title": "Double Cabinet",
        "shape": "poly",
        "name": "24",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            72.80099502487562,
            108.45771144278606,
            111.60696517412933,
            127.36318407960198,
            112.60199004975124,
            233.83084577114425,
            74.79104477611938,
            234.82587064676613
        ],
        "polygon": [
            [
                72.80099502487562,
                108.45771144278606
            ],
            [
                111.60696517412933,
                127.36318407960198
            ],
            [
                112.60199004975124,
                233.83084577114425
            ],
            [
                74.79104477611938,
                234.82587064676613
            ]
        ]
    },
    {
        "id": "db82b663-6c46-4a21-9ba6-fa6aa5bf84dc",
        "title": "Double Cabinet",
        "shape": "poly",
        "name": "25",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            19.567164179104466,
            56.21890547263681,
            71.80597014925371,
            87.56218905472636,
            71.80597014925371,
            173.63184079601987,
            18.572139303482572,
            159.20398009950247
        ],
        "polygon": [
            [
                19.567164179104466,
                56.21890547263681
            ],
            [
                71.80597014925371,
                87.56218905472636
            ],
            [
                71.80597014925371,
                173.63184079601987
            ],
            [
                18.572139303482572,
                159.20398009950247
            ]
        ]
    },
    {
        "id": "9258a68c-dc5d-4b08-bee1-720d8e8e3509",
        "title": "Left Wall",
        "shape": "poly",
        "name": "26",
        "fillColor": "#00ff194c",
        "strokeColor": "black",
        "coords": [
            20.064676616915406,
            57.71144278606965,
            131.50746268656715,
            131.34328358208953,
            130.0149253731343,
            341.79104477611935,
            12.104477611940283,
            436.8159203980099
        ],
        "polygon": [
            [
                20.064676616915406,
                57.71144278606965
            ],
            [
                131.50746268656715,
                131.34328358208953
            ],
            [
                130.0149253731343,
                341.79104477611935
            ],
            [
                12.104477611940283,
                436.8159203980099
            ]
        ]
    },
    {
        "id": "e30e9e21-0a03-4514-9473-887f23991361",
        "title": "Vent",
        "shape": "poly",
        "name": "27",
        "fillColor": "#ff000026",
        "strokeColor": "black",
        "coords": [
            249.91542288557213,
            0,
            299.66666666666663,
            0.49751243781094523,
            298.67164179104475,
            13.930348258706466,
            250.910447761194,
            13.930348258706466
        ],
        "polygon": [
            [
                249.91542288557213,
                0
            ],
            [
                299.66666666666663,
                0.49751243781094523
            ],
            [
                298.67164179104475,
                13.930348258706466
            ],
            [
                250.910447761194,
                13.930348258706466
            ]
        ]
    },
    {
        "id": "f5a8d660-61df-4783-a631-8ea6758ee50d",
        "title": "Vent",
        "shape": "poly",
        "name": "28",
        "fillColor": "#ff000026",
        "strokeColor": "black",
        "coords": [
            285.2388059701492,
            117.41293532338307,
            309.1194029850746,
            116.91542288557213,
            309.1194029850746,
            128.8557213930348,
            286.731343283582,
            128.35820895522386
        ],
        "polygon": [
            [
                285.2388059701492,
                117.41293532338307
            ],
            [
                309.1194029850746,
                116.91542288557213
            ],
            [
                309.1194029850746,
                128.8557213930348
            ],
            [
                286.731343283582,
                128.35820895522386
            ]
        ]
    },
    {
        "id": "6721b73c-a4f7-486c-8d72-5d7e817db59a",
        "title": "Light",
        "shape": "poly",
        "name": "29",
        "fillColor": "#ff000026",
        "strokeColor": "black",
        "coords": [
            266.83084577114425,
            93.5323383084577,
            277.2786069651741,
            93.03482587064676,
            277.2786069651741,
            99.50248756218905,
            267.3283582089552,
            99.00497512437809
        ],
        "polygon": [
            [
                266.83084577114425,
                93.5323383084577
            ],
            [
                277.2786069651741,
                93.03482587064676
            ],
            [
                277.2786069651741,
                99.50248756218905
            ],
            [
                267.3283582089552,
                99.00497512437809
            ]
        ]
    },
    {
        "id": "6fe8c503-66f8-47be-bad8-5a39d170e538",
        "title": "Recessed Light",
        "shape": "poly",
        "name": "30",
        "fillColor": "#ff000026",
        "strokeColor": "black",
        "coords": [
            206.1343283582089,
            103.48258706467661,
            227.0298507462686,
            105.47263681592038,
            222.5522388059701,
            113.93034825870646,
            207.12935323383084,
            112.93532338308457
        ],
        "polygon": [
            [
                206.1343283582089,
                103.48258706467661
            ],
            [
                227.0298507462686,
                105.47263681592038
            ],
            [
                222.5522388059701,
                113.93034825870646
            ],
            [
                207.12935323383084,
                112.93532338308457
            ]
        ]
    },
    {
        "id": "b5ef36ad-484b-4605-a2ba-72b9f1e7114f",
        "title": "Recessed Light",
        "shape": "poly",
        "name": "31",
        "fillColor": "#ff000026",
        "strokeColor": "black",
        "coords": [
            164.84079601990047,
            55.721393034825866,
            187.72636815920396,
            54.72636815920397,
            185.73631840796017,
            66.16915422885572,
            167.82587064676613,
            66.66666666666666
        ],
        "polygon": [
            [
                164.84079601990047,
                55.721393034825866
            ],
            [
                187.72636815920396,
                54.72636815920397
            ],
            [
                185.73631840796017,
                66.16915422885572
            ],
            [
                167.82587064676613,
                66.66666666666666
            ]
        ]
    },
    {
        "id": "75449960-7fde-4907-a463-7bb5b146d70c",
        "title": "Ceiling",
        "shape": "poly",
        "name": "32",
        "fillColor": "#ff000026",
        "strokeColor": "black",
        "coords": [
            19.567164179104466,
            52.73631840796019,
            19.567164179104466,
            1.990049751243781,
            637.9751243781094,
            1.4925373134328357,
            638.9701492537313,
            28.358208955223876,
            464.8407960199004,
            138.8059701492537,
            131.50746268656715,
            130.34825870646765
        ],
        "polygon": [
            [
                19.567164179104466,
                52.73631840796019
            ],
            [
                19.567164179104466,
                1.990049751243781
            ],
            [
                637.9751243781094,
                1.4925373134328357
            ],
            [
                638.9701492537313,
                28.358208955223876
            ],
            [
                464.8407960199004,
                138.8059701492537
            ],
            [
                131.50746268656715,
                130.34825870646765
            ]
        ]
    }
]

export {
    nameDaysFormat,
    binarySearch,
    getLengthDayOfMonth,
    getMarkerDate,
    getDays,
    getSection,
    BASE_URL_API,
    getOrderId,
    fallbackImage,
    timeTo_hmm,
    compareDaysOfWeek,
    compareAndCommaDaysOfWeek,
    cancelOrder,
    x
}