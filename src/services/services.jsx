import axios from "axios";
import moment from 'moment';
const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
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


const binarySearch = (array, target, prop) => {
    // Initialize the start and end indices of the search range
    let start = 0;
    let end = array.length - 1;

    // Iterate until the start and end indices meet
    while (start <= end) {
        // Calculate the midpoint of the search range
        const mid = Math.floor((start + end) / 2);

        // If the target is less than the value of the specified property at the midpoint, update the end index
        if (target < array[mid][prop]) {
            end = mid - 1;
        }
        // If the target is greater than the value of the specified property at the midpoint, update the start index
        else if (target > array[mid][prop]) {
            start = mid + 1;
        }
        // If the target is equal to the value of the specified property at the midpoint, return the midpoint index
        else {
            return mid;
        }
    }

    // If the target is not found, return -1
    return -1;
}

const getLengthDayOfMonth = (date = null) => {
    let currentDay;
    if (date) {
        currentDay = moment(date);
    } else {
        currentDay = moment().startOf('day');
    }
    const endDayOfMonth = moment().endOf('month');
    // console.log("statt", currentDay.format("DD-MM-YYYY"), "end", endDayOfMonth.format("DD-MM-YYYY"))
    // .add(2, 'month')
    return endDayOfMonth.diff(currentDay, 'days');
}
const getMarkerDate = async ({ date, id_zone }) => {
    try {
        const days = await getDays(id_zone);
        let data = [];
        for (let index = 0; index < getLengthDayOfMonth(date); index++) {
            const day = new Date(moment(date).add(index, 'days').format('YYYY-MM-DD'))
            const isDay = day.toLocaleDateString('en', { weekday: 'long' });
            if (days.includes(isDay)) {
                const { mapArea } = await getSection({ d: day, id_zone });
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
                return {
                    id,
                    title: name,
                    price,
                    shape: shape,
                    fillColor: color,
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

export {
    nameDaysFormat,
    binarySearch,
    getLengthDayOfMonth,
    getMarkerDate,
    getDays,
    getSection,
    BASE_URL_API,
}