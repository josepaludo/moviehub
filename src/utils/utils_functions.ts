import util from "util"


export function printPretty(obj: any, colors: boolean = true, print: boolean = true) {
    
    const data = util.inspect(obj, false, null, colors)

    if (print) {
        console.log(data)
    }

    return data

}