import Settings from '../config';
import { BLOCK_BREAK_OBJECT, TOOL_INFORMATION } from "../utils/constants";

export let guiHidden = { value: false }

export function hideOnFlag() {
    let threshold = 0;

    register('step', () => {
        if (!World.isLoaded()) return;

        switch (true) {
            case Settings.hideWhenNotFarming && ((Date.now() - BLOCK_BREAK_OBJECT.timeSinceLastBreak) / 1000) > 120:
                guiHidden.value = true;
                break;
            case Settings.hideWhenNotHoldingTool && !TOOL_INFORMATION.isToolHeld:
                threshold++;
                break;
            default:
                guiHidden.value = false;
                threshold = 0;
                break;
        }
        if (threshold > 20) {
            guiHidden.value = true;
            threshold = 0;
        }
    }).setFps(20);
}