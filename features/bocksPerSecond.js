/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { BLOCK_BREAK_OBJECT, TOOL_DISPLAY_INFORMATION } from "../utils/constants";
import Settings from "../config";

export function calculateBlockBreaksPerSecond() {
    const KeyBindName = new KeyBind("Reset Blocks/s", Keyboard.KEY_NONE, "HoeUtilitiesV3")

    KeyBindName.registerKeyPress(() => {
        BLOCK_BREAK_OBJECT.itemsBroken = 0;
        BLOCK_BREAK_OBJECT.timeSinceLastBreak = 0;
        BLOCK_BREAK_OBJECT.startTime = 0;
        TOOL_DISPLAY_INFORMATION.showToolBlocksS = ` 0 `;
    })

    register('step', () => {
        if (BLOCK_BREAK_OBJECT.itemsBroken != 0) {
            let timeInSeconds = (Date.now() - BLOCK_BREAK_OBJECT.startTime) / 1000;
            TOOL_DISPLAY_INFORMATION.showToolBlocksS = ((BLOCK_BREAK_OBJECT.itemsBroken / timeInSeconds).toFixed(2)) ? `${(BLOCK_BREAK_OBJECT.itemsBroken / timeInSeconds).toFixed(2)}` : " 0 ";
        } if (Date.now() - BLOCK_BREAK_OBJECT.timeSinceLastBreak > 1000 * Number(Settings.toolBlocksSTimeText)) {
            BLOCK_BREAK_OBJECT.itemsBroken = 0;
            BLOCK_BREAK_OBJECT.timeSinceLastBreak = 0;
            BLOCK_BREAK_OBJECT.startTime = 0;
            TOOL_DISPLAY_INFORMATION.showToolBlocksS = ` 0 `;
        }
    }).setFps(20);


}