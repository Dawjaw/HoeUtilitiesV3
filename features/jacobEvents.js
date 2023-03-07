/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { JACOB_EVENTS } from "../utils/constants";

function convertSecondsToMinutesAndSeconds(milliseconds) {
    var minutes = Math.floor(milliseconds / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    //let seconds = milliseconds;
    //let minutes = Math.floor(seconds / 60);
    //seconds = Math.floor(seconds % 60);
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function isIterable(value) {
    return Symbol.iterator in Object(value);
  }

export function jacobsGuiFeature() {
    register('step', () => {
        if (isIterable(JACOB_EVENTS.jacobEventList)) {
            for (jEvent of JACOB_EVENTS.jacobEventList) {
                //ChatLib.chat(`${new Date(jEvent['time'] * 1000)}`);
                let currentTime = Date.now();
                let eventTime = jEvent['time'] * 1000;
                if (currentTime < eventTime) {
                    let delta = eventTime - currentTime;
                    //ChatLib.chat(`${new Date(currentTime)}`);
                    //ChatLib.chat(`${new Date(eventTime)}`);
                    //ChatLib.chat(Math.floor(delta / 60000) + " minutes and " + ((delta % 60000) / 1000).toFixed(0) + " seconds until ");
                    JACOB_EVENTS.timeUntilJacobEvent = convertSecondsToMinutesAndSeconds(delta);
                    let eventString = [];
                    jEvent['crops'].forEach((crop) => {
                        eventString.push(crop);
                    });
                    JACOB_EVENTS.cropsInNextEvent = eventString;
                    break;
                }
            }
        } else {
            JACOB_EVENTS.timeUntilJacobEvent = "§4No Events Found!§r";
            JACOB_EVENTS.cropsInNextEvent = ["Carrot", "Carrot", "Carrot"];
        }
    }).setFps(10);
}