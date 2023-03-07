/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { TOOL_DISPLAY_INFORMATION } from "../utils/constants";

const DIRECTION = ["S", "SW", "W", "NW", "N", "NE", "E", "SE"];

export function updateYawAndPitch() {
    register('step', () => {
        let yaw = Player.getYaw();
        if (yaw < 0) {
            yaw = 180 + (180-Math.abs(yaw));
        }
        let facing = Math.floor((yaw * 8 / 360) + 0.5) & 7;
        let facing2 = (Player.getPitch() > 0) ? "down" : "up";
        TOOL_DISPLAY_INFORMATION.showToolYaw = `${Player.getYaw().toFixed(2)}° ${DIRECTION[facing]}`;
        TOOL_DISPLAY_INFORMATION.showToolPitch = `${Player.getPitch().toFixed(2)}° ${facing2}`;
    }).setFps(20);
}