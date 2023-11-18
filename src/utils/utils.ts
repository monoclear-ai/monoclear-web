export class JSONChecker{
    static isJSON(str: string): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}

export class NumberFormatter{
    static format(number: number, digits=1): string {
        if (number === null || number === undefined) {
            return "";
        }
        return (number * 100.0).toFixed(digits);
    }
}

// Keeps the order of items.
export class Deduplicator{
    static deduplicate(array: Array<any>): Array<any> {
        if (array === null || array === undefined) {
            return [];
        }
        const map = new Map();
        array.forEach(o => map.set(o, o))
        return [...map.values()];
    }
}

// TODO : Default Dict

enum Color {
  blue = "#4318FF",
  green = "#6AD2FF",
  red = "#FF0000",
  yellow = "#FFFF00",
  orange = "#FFA500",
  purple = "#800080",
  pink = "#FFC0CB",
  brown = "#A52A2A",
  black = "#000000",
  white = "#FFFFFF",
  gray = "#808080",
  cyan = "#00FFFF",
  magenta = "#FF00FF",
  silver = "#C0C0C0",
  gold = "#FFD700",
  lime = "#00FF00",
  olive = "#808000",
  maroon = "#800000",
  navy = "#000080",
  teal = "#008080",
  aqua = "#00FFFF",
  beige = "#F5F5DC",
}

export class EmailSubscriber{
    static subscribe(email: string, name: string="DEFAULT"): boolean {
        if (email === null || email === undefined) {
            return false;
        }
        const payload = {}
        fetch("https://www.website.com/backend/email/" + email + "/signup", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data)
        })
        .catch(err => {
            console.error(err.message)
        });
    }
}


export class DataWrapperForViz{
    private static mapIdxToColor(idx: number): string {
        const colorList = Object.values(Color);
        return colorList[idx];
    }

    static wrapDataForLine(data: Array<{tag: string, values: Array<number>}>): any {
        const result = [];
        for (let i = 0; i < data?.length ?? 0; i++) {
            const item = data[i];
            const obj = {
                "name": item.tag,
                "data": item.values,
                "color": this.mapIdxToColor(i)
            };
            result.push(obj);
        }
        return result;
    }

    static wrapDataForRadar(data: Array<{tag: string, values: Array<any>}>): any {

        console.log("*******orderedCategories******")
        console.log(data)

        interface Inter {
            [key: string]: any;
        }
        const inter: Inter = {};

        for (let i = 0; i < data?.length ?? 0; i++) {
            const item = data[i];
            console.log("*******data******")
            console.log(item)

            // Assume properly ordered tags
            const category = item.tag;

            const values = item.values;
            for (let j = 0; j < values?.length ?? 0; j++) {
                const value = values[j];
                const metric = value[1];
                const model = value[2];
        
                if (inter[model] === undefined) {
                    inter[model] = [];
                }
                inter[model].push(parseInt(metric));
            }
        }
        console.log(inter)

        const result = [];
        console.log("*******interArray******")
        for (let key in inter) {
            const item = inter[key];
            console.log("*******item******" + key)
            console.log(item)
            const obj = {
                name: key,
                data: item,
            };
            result.push(obj);
        }
        console.log("*******result******")
        console.log(result)

        return result;
    }

    static wrapDataForDetail(data: Array<{tag: string, values: Array<number>}>, custom_tags: Array<string>): any {
        const result = [];
        for (let i = 0; i < data?.length ?? 0; i++) {
            const item = data[i];
            const custom_tag = custom_tags ? custom_tags[i] : "N/A";
            if (item.tag != "overall") {
                continue
            }
            const content: any = item.values[0]
            console.log("*******content******")
            console.log(content)
            if (content !== null && content !== undefined) {
                const obj = {
                    "date": new Date(content[0]).toLocaleDateString('en-ZA', {year: 'numeric', month: '2-digit', day: '2-digit'}),
                    "tag": custom_tag,
                    "score": content[1],
                };
                result.push(obj);
            }
        }
        console.log("*******display******")
        console.log(JSON.stringify(result))
        return result;
    }
}


// export const lineChartDataTotalSpent = [
//     {
//       name: "Revenue",
//       data: [50, 64, 48, 66, 49, 68],
//       color: "#4318FF",
//     },
//     {
//       name: "Profit",
//       data: [30, 40, 24, 46, 20, 46],
//       color: "#6AD2FF",
//     },
//   ];
  
  
//   export const lineChartDataTimelyLineGraphs = [
//     {
//       name: "Revenue",
//       data: [50, 64, 48, 66, 49, 68],
//       color: "#4318FF",
//     },
//     {
//       name: "Profit",
//       data: [30, 40, 24, 46, 20, 46],
//       color: "#6AD2FF",
//     },
//   ];
  
  
//   export const lineChartDataRequests = [
//     {
//       name: "Revenue",
//       data: [50, 64, 48, 66, 49, 68],
//       color: "#4318FF",
//     },
//     {
//       name: "Profit",
//       data: [30, 40, 24, 46, 20, 46],
//       color: "#6AD2FF",
//     },
//   ];
  