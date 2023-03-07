import { orderGUI } from "./constants";

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getSkyblockID(item) {
    if (item instanceof Item) {
        return item.getNBT().toObject()?.tag?.ExtraAttributes?.id;
    } else { return null; }
}

export function resetOrderGUI() {
    orderGUI.close();
    new Thread(() => {
        setTimeout(function() {
            orderGUI.open();
        }, 10);
    }).start();
    
}

export function getDaedalusAxeBonus(nbt) {
    const pattern = /§7Farming Fortune: §a\+([\d.]+)/; // §r
    const match = nbt?.tag?.display?.Lore?.join()?.match(pattern);
    if (match) {
        return parseFloat(match[1]);
    }
}

export function getItemRarity(item) {
    return item?.getLore()?.join().match(/(MYTHIC|COMMON|UNCOMMON|RARE|LEGENDARY|EPIC)/) ? item?.getLore()?.join().match(/(MYTHIC|COMMON|UNCOMMON|RARE|LEGENDARY|EPIC)/)[0] : null;
}