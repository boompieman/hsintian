const convert_dateObject_to_dateString = (dateObject) => {
    const year_string = `${dateObject.getFullYear()}`;

    const month_string = (
        dateObject.getMonth() + 1 >= 10?
        `${dateObject.getMonth() + 1}`: '0' + `${dateObject.getMonth() + 1}`
    )

    const date_string = (
        dateObject.getDate() >= 10?
        `${dateObject.getDate()}`: '0' + `${dateObject.getDate()}`
    )

    const datetime_string = year_string + month_string + date_string;

    return datetime_string;
}

export default convert_dateObject_to_dateString;