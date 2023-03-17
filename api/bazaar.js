import axios from "../../axios";
import { BAZAAR_FARMING_NAMES, BAZAAR_NAME_TO_CROP_NAME, BAZAAR_INFORMATION } from "../utils/constants"


export function getBazaarData() {
    let price_sheet = [];
    axios.get("https://sky.lea.moe/api/bazaar", {
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
    }).then(response => {
        response.data.forEach(value => {
            price_sheet.push({ key: value.id.toString(), value: value.sellPrice });
        });
        let return_price = {
            'cocoa': 0,
            'wart': 0,
            'carrot': 0,
            'pumpkin': 0,
            'cane': 0,
            'wheat': 0,
            'potato': 0,
            'melon': 0,
            'mushroom': 0,
            'cactus': 0
        }
        BAZAAR_FARMING_NAMES.forEach(key => {
            let val = price_sheet.find(o => o.key === key).value;
            let name = price_sheet.find(o => o.key === key).key;
            let new_value = BAZAAR_NAME_TO_CROP_NAME[name]
            return_price[new_value] = val
        });
        return_price['mushroom'] = (price_sheet.find(o => o.key === "ENCHANTED_RED_MUSHROOM").value + price_sheet.find(o => o.key === "ENCHANTED_BROWN_MUSHROOM").value) / 2;
        for (let key in return_price) {
            if (return_price.hasOwnProperty(key)) {
                BAZAAR_INFORMATION[key] = return_price[key];
            }
        }
    }).catch(error => {
        if (error.isAxiosError) {
            print(error.code + ": " + error.response.data);
        } else {
            print(error.message);
        }
    });
}