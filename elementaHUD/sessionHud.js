/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config"
import { TOOL_DISPLAY_INFORMATION } from "../utils/constants"
import {
    AdditiveConstraint,
    ConstantColorConstraint,
    UIRoundedRectangle,
    ChildBasedRangeConstraint,
} from "../../Elementa";

const Color = Java.type("java.awt.Color");
export function getJavaColor(color) {
    return new Color(color.getRed() / 255, color.getGreen() / 255, color.getBlue() / 255, (color.getAlpha() / 255) ? color.getAlpha() / 255 : 0);
}

export function createSessionHUD() {
    //const dragOffset = { x: 0, y: 0 };
    //let guiIsSelected;

    //const mainUIContainer = 
    new UIRoundedRectangle(3)
        .setX((Settings.locationSessionHUDX).pixels())
        .setY((Settings.locationSessionHUDY).pixels())
        .setWidth((200).pixels())
        .setHeight(new AdditiveConstraint(new ChildBasedRangeConstraint(), (10).pixels()))
        .setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0.3)));

    let items = [];
    let values = [];

    for (let key in TOOL_DISPLAY_INFORMATION) {
        if (TOOL_DISPLAY_INFORMATION.hasOwnProperty(key)) {
            values.push(`${TOOL_DISPLAY_INFORMATION[key]}`);
            items.push(`${key}`);
        }
    }

    //let hiddenList = [];
}