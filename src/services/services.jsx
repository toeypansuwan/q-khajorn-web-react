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
                const { id, color, name, points, shape, price, image, status } = section;
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
                    day: d
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
}