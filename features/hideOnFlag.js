import Settings from '../config';
import { BLOCK_BREAK_OBJECT, TOOL_INFORMATION } from "../utils/constants";

export let guiHidden = { value: false }

export function hideOnFlag() {
    register('step', () => {
        if (!World.isLoaded()) return;

        switch (true) {
            case Settings.hideWhenNotFarming && ((Date.now() - BLOCK_BREAK_OBJECT.timeSinceLastBreak) / 1000) > 120:
                guiHidden.value = true;
                break;
            case Settings.hideWhenNotHoldingTool && !TOOL_INFORMATION.isToolHeld:
                guiHidden.value = true;
                break;
            default:
                guiHidden.value = false;
                break;
        }
    }).setDelay(2);
}