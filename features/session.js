/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

//import {  } from "../utils/constants";
//import Settings from "../config";

export function setupSession() {
    let sessionInformation = {
        sessionActive: false,
        sessionStartTime: 0,
        sessionEndTime: 0,
        sessionCrops: {
            carrot: 0,
            potato: 0,
            wheat: 0,
            melon: 0,
            pumpkin: 0,
            netherwart: 0,
            cocoa: 0,
            cactus: 0,
            cane: 0,
            mushroom: 0,
        },
        sessionProfit: {
            carrot: 0,
            potato: 0,
            wheat: 0,
            melon: 0,
            pumpkin: 0,
            netherwart: 0,
            cocoa: 0,
            cactus: 0,
            cane: 0,
            mushroom: 0,
        },
        sessionExpGained: {
            carrot: 0,
            potato: 0,
            wheat: 0,
            melon: 0,
            pumpkin: 0,
            netherwart: 0,
            cocoa: 0,
            cactus: 0,
            cane: 0,
            mushroom: 0,
        },

    }

    register('command', () => {

    }).setName('startfarmingsession');

    register('command', () => {

    }).setName('stopfarmingsession');

    register('step', () => {
        if (sessionInformation.sessionActive) {

        }

    }).setDelay(1);
}