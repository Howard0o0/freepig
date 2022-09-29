var token = ""
const baseURL = "https://182.92.109.123:8080/api/v1"

//防抖  
function debounce(fn, wait = 500, isImmediate = false) {
    let timerId = null;
    let flag = true;
    if (isImmediate) {
        return function () {
            clearTimeout(timerId);
            if (flag) {
                fn.apply(this, arguments);
                flag = false
            }
            timerId = setTimeout(() => {
                flag = true
            }, wait)
        }
    }
    return function () {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, arguments)
        }, wait)
    }
}

export default {
    token,
    baseURL,
    debounce
}