export const nameDaysFormat = (nameday) => {
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