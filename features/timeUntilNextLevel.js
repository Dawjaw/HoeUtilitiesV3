/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { PLAYER_INFORMATION, XP_DISPLAY_INFORMATION, BLOCK_BREAK_OBJECT, TOOL_DISPLAY_INFORMATION } from "../utils/constants";
import { numberWithCommas } from "../utils/utils";

function convertSecondsToMinutesAndSeconds(milliseconds) {
    let seconds = milliseconds;
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export function updateXpPerHour() {
    register('step', () => {
        if (PLAYER_INFORMATION.currentFarmingExpGain != 0) {
            XP_DISPLAY_INFORMATION.showXPMaxPerHour = `${numberWithCommas((PLAYER_INFORMATION.currentFarmingExpGain * 20 * 60 * 60).toFixed(0))}/h`;
            XP_DISPLAY_INFORMATION.showXPPerHour = `${numberWithCommas((PLAYER_INFORMATION.currentFarmingExpGain * TOOL_DISPLAY_INFORMATION.showToolBlocksS * 60 * 60).toFixed(0))}/h`;
        } if (Date.now() - BLOCK_BREAK_OBJECT.timeSinceLastBreak > 1000 * 120) {
            XP_DISPLAY_INFORMATION.showXPPerHour = `Start Farming!`;
        }
        if(!XP_DISPLAY_INFORMATION.showXPPerHour) {
            XP_DISPLAY_INFORMATION.showXPPerHour = `Start Farming!`;
        }
        if(!XP_DISPLAY_INFORMATION.showXPMaxPerHour) {
            XP_DISPLAY_INFORMATION.showXPMaxPerHour = `Start Farming!`;
        }
    }).setFps(10);
    
    register('step', () => {
        if(PLAYER_INFORMATION.farmingExpToNextLevel >= PLAYER_INFORMATION.currentFarmingExpGain) { 
            PLAYER_INFORMATION.farmingExpUntilNextLevel -= (PLAYER_INFORMATION.currentFarmingExpGain) ? PLAYER_INFORMATION.currentFarmingExpGain : 0;
        }

        XP_DISPLAY_INFORMATION.showXPCurrentXP = (PLAYER_INFORMATION.currentFarmingExp) ? numberWithCommas(PLAYER_INFORMATION.currentFarmingExp.toFixed(0)) : "Start Farming!";
            XP_DISPLAY_INFORMATION.showXPUntilNextLevel = (PLAYER_INFORMATION.farmingExpUntilNextLevel) ? numberWithCommas(PLAYER_INFORMATION.farmingExpUntilNextLevel.toFixed(0)) : "Start Farming!";
    }).setFps(10);

    register('step', () => {
        // calculate time until next level
        if(PLAYER_INFORMATION.farmingExpToNextLevel >= PLAYER_INFORMATION.currentFarmingExpGain) {
            PLAYER_INFORMATION.farmingExpToNextLevel -= (PLAYER_INFORMATION.currentFarmingExpGain) ? PLAYER_INFORMATION.currentFarmingExpGain : 0;
        }
        let timeInSeconds = (Date.now() - PLAYER_INFORMATION.startTime) / 1000;
        let timeUntilNextLevel = PLAYER_INFORMATION.farmingExpToNextLevel / (PLAYER_INFORMATION.currentFarmingExpGain / timeInSeconds);
        XP_DISPLAY_INFORMATION.showXPTimeUntilNextLevel = (timeUntilNextLevel) ? convertSecondsToMinutesAndSeconds(timeUntilNextLevel) : "Start Farming!";
    }).setFps(10);
}