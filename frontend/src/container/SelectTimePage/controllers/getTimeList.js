function getTimeList(gid, datetime_string) {
    const params = {
        gid: gid,
        day: 60,
        start_date: datetime_string
    }

    let esc = encodeURIComponent;
    const queryString = Object.keys(params)
                        .map((ele) => esc(ele) + '=' + esc(params[ele])).join('&');
    
                        
    return fetch('https://hsintian.tk/api/freetime/get/?' + queryString, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
}

export default getTimeList