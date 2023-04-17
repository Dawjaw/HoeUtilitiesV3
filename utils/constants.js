/// <reference types="../../CTAutocomplete"/>
/// <reference lib="es2015"/>

import {
    Window,
    Inspector
} from "../../Elementa";
import { GuiCallbackWrapper } from "./guiWrapper";

export default guiWrapper = new GuiCallbackWrapper(new Gui());
export let orderGUI = new Gui();
export const mainHUD = new Window();
export const jacobHUD = new Window();
export function getInspector() {
    const inspector = new Inspector(mainHUD)
        .setX((30).pixels())
        .setY((30).pixels())
    return inspector;
}

/////// update information /////////

export const TOOL_INFORMATION = {
    toolType: "",
    isToolHeld: true,
    toolCropType: "",
    tierBonus: 0,
    cultivating: 0,
    harvesting: 0,
    sunder: 0,
    itemRate: 0,
    turbo: 0,
    rarity: 0,
    counter: 0,
    farmedCultivating: 0,
    farmingForDummies: 0,
    bountiful: false,
    armorBonus: 0,
    equipmentBonus: 0,
    talismanBonus: 0,
    dedication: 0,
    greenThumb: 0,
}

export const RARITIES = {
    COMMON: 5,
    UNCOMMON: 7,
    RARE: 9,
    EPIC: 13,
    LEGENDARY: 16,
    MYTHIC: 20,
}

export const BASIC_ITEM_RATES = {
    BASIC_GARDENING_HOE: 5,
    ADVANCED_GARDENING_HOE: 10,
    BASIC_GARDENING_AXE: 5,
    ADVANCED_GARDENING_AXE: 10,
}

export const TIER_BONUS = [10, 25, 50];

export const GREEN_THUMB = { // hoe
    COMMON: 1,
    UNCOMMON: 2,
    RARE: 3,
    EPIC: 4,
    LEGENDARY: 5,
    MYTHIC: 6
}

export const ROBUST = { // hoe
    COMMON: 2,
    UNCOMMON: 3,
    RARE: 4,
    EPIC: 6,
    LEGENDARY: 8,
    MYTHIC: 10
}

export const ROOTED = { // equipment
    COMMON: 4,
    UNCOMMON: 6,
    RARE: 8,
    EPIC: 10,
    LEGENDARY: 12,
    MYTHIC: 15
}

export const BLOOMING = { // equipment
    COMMON: 1,
    UNCOMMON: 2,
    RARE: 3,
    EPIC: 4,
    LEGENDARY: 5,
    MYTHIC: 6
}

export const EARTHLY = { // Axes
    COMMON: 1,
    UNCOMMON: 4,
    RARE: 6,
    EPIC: 8,
    LEGENDARY: 10,
    MYTHIC: 12
}

export const MOSSY = { // Armor
    COMMON: 5,
    UNCOMMON: 10,
    RARE: 15,
    EPIC: 20,
    LEGENDARY: 25,
    MYTHIC: 30
}

export const BUSTLNG = { // Armor
    COMMON: 1,
    UNCOMMON: 2,
    RARE: 4,
    EPIC: 6,
    LEGENDARY: 8,
    MYTHIC: 10
}

export const BOUNTIFUL = {
    COMMON: 1,
    UNCOMMON: 2,
    RARE: 3,
    EPIC: 5,
    LEGENDARY: 7,
    MYTHIC: 10,
}

export const DEDICATION = [0, 0.5, 0.75, 1, 2];
export const GREEN_THUMB_ENCHANT = [0, 0.05, 0.1, 0.15, 0.2, 0.25]

export const GARDEN_INFORMATION = {
    gardenLevel: 0,
    amountofUnlockedPlots: 0,
}

export const gardenMilestones = {
    'cocoa': 0,
    'wart': 0,
    'carrot': 0,
    'pumpkin': 0,
    'cane': 0,
    'wheat': 0,
    'potato': 0,
    'melon': 0,
    'mushroom': 0
};

export const ARMOR_PIECE_BONUS = {
    'melon': [0, 10, 20, 30],
    'cropie': [0, 15, 30, 45],
    'squash': [0, 20, 40, 60],
    'fermento': [0, 25, 50, 75],
}

export const ARMOR_BONUS = {
    'FARM_ARMOR_HELMET': {
        'type': 'farm_armor',
        'fortune': 10,
    },
    'FARM_ARMOR_CHESTPLATE': {
        'type': 'farm_armor',
        'fortune': 10,
    },
    'FARM_ARMOR_LEGGINGS': {
        'type': 'farm_armor',
        'fortune': 10,
    },
    'FARM_ARMOR_BOOTS': {
        'type': 'farm_armor',
        'fortune': 10,
    },
    ////////////////////////////
    'FARM_SUIT_HELMET': {
        'type': 'farm_suit',
        'fortune': 5,
    },
    'FARM_SUIT_CHESTPLATE': {
        'type': 'farm_suit',
        'fortune': 5,
    },
    'FARM_SUIT_LEGGINGS': {
        'type': 'farm_suit',
        'fortune': 5,
    },
    'FARM_SUIT_BOOTS': {
        'type': 'farm_suit',
        'fortune': 5,
    },
    /////////////////////////////
    'RABBIT_HELMET': {
        'type': 'rabbit',
        'fortune': 15,
    },
    'RABBIT_CHESTPLATE': {
        'type': 'rabbit',
        'fortune': 15,
    },
    'RABBIT_LEGGINGS': {
        'type': 'rabbit',
        'fortune': 15,
    },
    'RABBIT_BOOTS': {
        'type': 'rabbit',
        'fortune': 15,
    },
    /////////////////////////////
    'MELON_HELMET': {
        'type': 'melon',
        'fortune': 15,
    },
    'MELON_CHESTPLATE': {
        'type': 'melon',
        'fortune': 20,
    },
    'MELON_LEGGINGS': {
        'type': 'melon',
        'fortune': 20,
    },
    'MELON_BOOTS': {
        'type': 'melon',
        'fortune': 15,
    },
    /////////////////////////////
    'CROPIE_HELMET': {
        'type': 'cropie',
        'fortune': 20,
    },
    'CROPIE_CHESTPLATE': {
        'type': 'cropie',
        'fortune': 25,
    },
    'CROPIE_LEGGINGS': {
        'type': 'cropie',
        'fortune': 25,
    },
    'CROPIE_BOOTS': {
        'type': 'cropie',
        'fortune': 20,
    },
    /////////////////////////////
    'SQUASH_HELMET': {
        'type': 'squash',
        'fortune': 25,
    },
    'SQUASH_CHESTPLATE': {
        'type': 'squash',
        'fortune': 30,
    },
    'SQUASH_LEGGINGS': {
        'type': 'squash',
        'fortune': 30,
    },
    'SQUASH_BOOTS': {
        'type': 'squash',
        'fortune': 25,
    },
    /////////////////////////////
    'FERMENTO_HELMET': {
        'type': 'fermento',
        'fortune': 30,
    },
    'FERMENTO_CHESTPLATE': {
        'type': 'fermento',
        'fortune': 35,
    },
    'FERMENTO_LEGGINGS': {
        'type': 'fermento',
        'fortune': 35,
    },
    'FERMENTO_BOOTS': {
        'type': 'fermento',
        'fortune': 30,
    },
}

export const FULL_SET_BONUS = {
    'rabbit': 10
}

export const PET_INFORMATION = {
    type: "",
    level: 0,
    name: "",
    minosRelic: false,
    fortune: 0,
    itemBonus: 0,
}

export const TOOL_TO_TURBO_ENCHANT = {
    'cocoa': 'turbo_coco',
    'wart': 'turbo_warts',
    'carrot': 'turbo_carrot',
    'pumpkin': 'turbo_pumpkin',
    'cane': 'turbo_cane',
    'wheat': 'turbo_wheat',
    'mushroom': 'turbo_mushrooms',
    'cactus': 'turbo_cactus',
    'potato': 'turbo_potato',
    'melon': 'turbo_melon'
}

export const ROMAN_TO_ARABIC = {
    'I': 1,
    'II': 2,
    'III': 3,
    'IV': 4,
    'V': 5,
    'VI': 6,
    'VII': 7,
    'VIII': 8,
    'IX': 9,
    'X': 10,
    'XI': 11,
    'XII': 12,
    'XIII': 13,
    'XIV': 14,
    'XV': 15,
    'XVI': 16,
    'XVII': 17,
    'XVIII': 18,
    'XIX': 19,
    'XX': 20,
    'XXI': 21,
    'XXII': 22,
    'XXIII': 23,
    'XXIV': 24,
    'XXV': 25,
    'XXVI': 26,
    'XXVII': 27,
    'XXVIII': 28,
    'XXIX': 29,
    'XXX': 30,
    'XXXI': 31,
    'XXXII': 32,
    'XXXIII': 33,
    'XXXIV': 34,
    'XXXV': 35,
    'XXXVI': 36,
    'XXXVII': 37,
    'XXXVIII': 38,
    'XXXIX': 39,
    'XL': 40,
    'XLI': 41,
    'XLII': 42,
    'XLIII': 43,
    'XLIV': 44,
    'XLV': 45,
    'XLVI': 46,
    'XLVII': 47,
    'XLVIII': 48,
    'XLIX': 49,
    'L': 50,
    'LI': 51,
    'LII': 52,
    'LIII': 53,
    'LIV': 54,
    'LV': 55,
    'LVI': 56,
    'LVII': 57,
    'LVIII': 58,
    'LIX': 59,
    'LX': 60,
}

export const PET_LEVELS = [0, 660, 1390, 2190, 3070, 4030, 5080, 6230, 7490, 8870, 10380, 12030, 13830, 15790, 17920, 20230, 22730, 25430, 28350, 31510, 34930, 38630, 42630, 46980, 51730, 56930, 62630, 68930, 75930, 83730, 92430, 102130, 112930, 124930, 138230, 152930, 169130, 186930, 206430, 227730, 250930, 276130, 303530, 333330, 365730, 400930, 439130, 480530, 525330, 573730, 625930, 682130, 742530, 807330, 876730, 950930, 1030130, 1114830, 1205530, 1302730, 1406930, 1518630, 1638330, 1766530, 1903730, 2050430, 2207130, 2374830, 2554530, 2747230, 2953930, 3175630, 3413330, 3668030, 3940730, 4232430, 4544130, 4877830, 5235530, 5619230, 6030930, 6472630, 6949330, 7466030, 8027730, 8639430, 9306130, 10032830, 10824530, 11686230, 12622930, 13639630, 14741330, 15933030, 17219730, 18606430, 20103130, 21719830, 23466530, 25353230]

//////// Player Information ////////

export const PLAYER_INFORMATION = {
    strength: 0,
    anita: 0,
    cake: 0,
    farmingLevel: 0,
    farmingCap: 0,
    farmingExpToNextLevel: 0,
    farmingExpUntilNextLevel: 0,
    currentFarmingExpGain: 0,
    currentFarmingExp: 0,
    totalFarmingFortune: 0,
    gardenCropBonus: 0,
    gardenCommunityUpgrade: 0,
    uniqueVisitors: 0,
}

export const COLLECTIONS = {
    cane: 0,
    potato: 0,
    carrot: 0,
    wheat: 0,
    wart: 0,
    pumpkin: 0,
    melon: 0,
    cocoa: 0,
    mushroom: 0,
    cactus: 0,
}

export const BAZAAR_INFORMATION = {
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
};

export const BAZAAR_FARMING_NAMES = [
    "ENCHANTED_POTATO",
    "ENCHANTED_CARROT",
    "ENCHANTED_NETHER_STALK",
    "ENCHANTED_SUGAR_CANE",
    "ENCHANTED_MELON",
    "ENCHANTED_PUMPKIN",
    "ENCHANTED_COCOA",
    "ENCHANTED_HAY_BLOCK",
    "ENCHANTED_CACTUS_GREEN"
]

export const BAZAAR_NAME_TO_CROP_NAME = {
    'ENCHANTED_COCOA': 'cocoa',
    'ENCHANTED_NETHER_STALK': 'wart',
    'ENCHANTED_CARROT': 'carrot',
    'ENCHANTED_PUMPKIN': 'pumpkin',
    'ENCHANTED_SUGAR_CANE': 'cane',
    'ENCHANTED_HAY_BLOCK': 'wheat',
    'ENCHANTED_POTATO': 'potato',
    'ENCHANTED_MELON': 'melon',
    'ENCHANTED_CACTUS_GREEN': 'cactus'
}

export const EXP_REQUIRED_PER_LEVEL = [50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925/* 10 */, 14925, 22425, 32425, 47425, 67425, 97425, 147425, 222425, 322425, 522425/* 20 */, 822425, 1222425, 1722425, 2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425/* 30 */, 9322425, 10722425, 12222425, 13822425, 15522425, 17322425, 19222425, 21222425, 23322425, 25522425/* 40 */, 27822425, 30222425, 32722425, 35322425, 38072425, 40972425, 44072425, 47472425, 51172425, 55172425/* 50 */, 59472425, 64072425, 68972452, 74172425, 79672425, 85472425, 91572425, 97972425, 104672425, 111672425/* 60 */];

///////// Jacobs /////////

export const currentlyHeldTool = "";

export const CROP_TO_IMAGE = {
    "Carrot": "carrot",
    "Melon": "melon",
    "Wheat": "wheat",
    "Nether Wart": "wart",
    "Pumpkin": "pumpkin",
    "Sugar Cane": "cane",
    "Cactus": "cactus",
    "Potato": "potato",
    "Mushroom": "mushroom",
    "Cocoa Beans": "cocoa"
}

///////// Farming /////////

export const BLOCKS_TO_COLLECTION_TYPE = {
    'cocoa': 'cocoa',
    'nether_wart': 'wart',
    'carrots': 'carrot',
    'pumpkin': 'pumpkin',
    'reeds': 'cane',
    'wheat': 'wheat',
    'brown_mushroom': 'mushroom',
    'red_mushroom': 'mushroom',
    'cactus': 'cactus',
    'potatoes': 'potato',
    'melon_block': 'melon'
}

export const MAX_AGE_OF_BLOCKS = {
    'carrot': '7',
    'potato': '7',
    'wheat': '7',
    'cocoa': '2',
    'wart': '3',
}

export const DROPS_PER_BREAK = {
    'carrot': '3',
    'potato': '3',
    'wheat': '1',
    'cocoa': '3',
    'wart': '2.5',
    'pumpkin': '1',
    'cactus': '1',
    'melon': '5',
    'mushroom': '1',
    'cane': '2' // if you break 2 blocks at once
}

export const BLOCK_BREAK_OBJECT = {
    currentCrop: "",
    itemsBroken: 0,
    timeSinceLastBreak: 0,
    startTime: 0,
}

export const COMPACT_VALUES = {
    "potato": 160,
    "carrot": 160,
    "wart": 160,
    "cane": 51200,
    "melon": 160,
    "pumpkin": 160,
    "cocoa": 160,
    "wheat": 1296,
    "mushroom": 160,
    "cactus": 160
}

export const CROP_NPC_PRICING = {
    "potato": 160,
    "carrot": 160,
    "wart": 480,
    "cane": 25600,
    "melon": 160,
    "pumpkin": 640,
    "cocoa": 480,
    "wheat": 1296,
    "mushroom": 640,
    "cactus": 160
}

///////// Tool Display Information /////////

export const TOOL_DISPLAY_INFORMATION = {
    "showToolCounter": "",
    "showToolCultivating": "",
    "showToolFarmingFortune": "",
    "showToolBlocksS": "",
    "showToolYieldEfficiency": "",
    "showToolMaxYield": "",
    "showToolExpectedProfit": "",
    "showToolCollection": "",
    "showToolYaw": "",
    "showToolPitch": ""
}

export const TOOL_DISPLAY_INFORMATION_TEXT = {
    "showToolCounter": "Counter",
    "showToolCultivating": "Cultivating",
    "showToolFarmingFortune": "Farming Fortune",
    "showToolBlocksS": "Blocks/s",
    "showToolYieldEfficiency": "Yield Efficiency",
    "showToolMaxYield": "Max Yield",
    "showToolExpectedProfit": "Expected Profit",
    "showToolCollection": "Collection",
    "showToolYaw": "Yaw",
    "showToolPitch": "Pitch",
}

export const TOOL_DISPLAY_INFORMATION_HAS_BAR = {
    "showToolCounter": false,
    "showToolCultivating": false,
    "showToolFarmingFortune": false,
    "showToolBlocksS": true,
    "showToolYieldEfficiency": false,
    "showToolMaxYield": false,
    "showToolExpectedProfit": false,
    "showToolCollection": false,
    "showToolYaw": false,
    "showToolPitch": false
}

///////// XP Display Information /////////

export const XP_DISPLAY_INFORMATION = {
    "showXPCurrentXP": "",
    "showXPUntilNextLevel": "",
    "showXPTimeUntilNextLevel": "",
    "showXPPerHour": "",
    "showXPMaxPerHour": "",
}

export const XP_DISPLAY_INFORMATION_TEXT = {
    "showXPCurrentXP": "Current XP",
    "showXPUntilNextLevel": "XP to next Level",
    "showXPTimeUntilNextLevel": "Time to next Level",
    "showXPPerHour": "XP/h",
    "showXPMaxPerHour": "Max XP/h",
}

///////// Session Display Information /////////

export const SESSION_DISPLAY_INFORMATION = {
    "showCurrentSessionTime": "",
    "showCurrentSessionBlocksFarmed": "",
    "showCurrentSessionBlocksPerTimeFrame": "",
    "showCurrentSessionCollection": "",
    "showCurrentSessionProfit": "",
    "showCurrentSessionProfitPerTimeFrame": "",
    "showCurrentSessionXP": "",
    "showCurrentSessionXPPerTimeFrame": "",
}

export const SESSION_DISPLAY_INFORMATION_TEXT = {
    "showCurrentSessionTime": "Time elapsed",
    "showCurrentSessionBlocksFarmed": "Blocks Farmed",
    "showCurrentSessionBlocksPerTimeFrame": "Blocks/Time",
    "showCurrentSessionCollection": "Collection",
    "showCurrentSessionProfit": "Profit",
    "showCurrentSessionProfitPerTimeFrame": "Profit/Time",
    "showCurrentSessionXP": "XP",
    "showCurrentSessionXPPerTimeFrame": "XP/Time",
}