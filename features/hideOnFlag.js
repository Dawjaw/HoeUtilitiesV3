import Settings from '../config';
import { BLOCK_BREAK_OBJECT, TOOL_INFORMATION } from "../utils/constants";
import gui from "../utils/constants";

export function hideOnFlag() {
    let currentUserPreference_xpHudEnabled = Settings.xpHudEnabled;
    let currentUserPreference_toolHudEnabled = Settings.toolHudEnabled;
    const SettingsGUI = Java.type("gg.essential.vigilance.gui.SettingsGui");

    register('step', () => {
        if (!World.isLoaded()) return;
        if (!gui.isOpen() && Settings.windowIsSelected) Settings.windowIsSelected = false;
        if (Client.currentGui.get() instanceof SettingsGUI) {
            if (currentUserPreference_xpHudEnabled !== Settings.xpHudEnabled)
                currentUserPreference_xpHudEnabled = Settings.xpHudEnabled;
            if (currentUserPreference_toolHudEnabled !== Settings.toolHudEnabled)
                currentUserPreference_toolHudEnabled = Settings.toolHudEnabled;
            return
        }

        let hideXP = false;
        let hideTool = false;
        switch (true) {
            case Settings.hideWhenNotFarming && ((Date.now() - BLOCK_BREAK_OBJECT.timeSinceLastBreak) / 1000) > 120:
                hideXP = true;
                hideTool = true;
                break;
            case Settings.hideWhenNotHoldingTool && !TOOL_INFORMATION.isToolHeld:
                hideXP = true;
                hideTool = true;
                break;
            default:
                rollback();
                break;
        }

        if (hideXP && Settings.xpHudEnabled)
            Settings.xpHudEnabled = false;
        if (hideTool && Settings.toolHudEnabled)
            Settings.toolHudEnabled = false;
    }).setDelay(2);

    function rollback() {
        if (Settings.xpHudEnabled !== currentUserPreference_xpHudEnabled)
            Settings.xpHudEnabled = currentUserPreference_xpHudEnabled;
        if (Settings.toolHudEnabled !== currentUserPreference_toolHudEnabled)
            Settings.toolHudEnabled = currentUserPreference_toolHudEnabled;
    }

    register('gameUnload', () => {
        Settings.xpHudEnabled = currentUserPreference_xpHudEnabled;
        Settings.toolHudEnabled = currentUserPreference_toolHudEnabled;
    });

    register('worldUnload', () => {
        Settings.xpHudEnabled = currentUserPreference_xpHudEnabled;
        Settings.toolHudEnabled = currentUserPreference_toolHudEnabled;
    });
}