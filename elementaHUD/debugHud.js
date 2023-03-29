/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config"
import guiWrapper, { PLAYER_INFORMATION, TOOL_INFORMATION, PET_INFORMATION, GARDEN_INFORMATION } from "../utils/constants"
import {
    AdditiveConstraint,
    animate,
    Animations,
    ConstantColorConstraint,
    SiblingConstraint,
    UIRoundedRectangle,
    UIImage,
    Window,
    UIWrappedText,
    ChildBasedSizeConstraint,
    ChildBasedMaxSizeConstraint,
    ChildBasedRangeConstraint,
    CenterConstraint
} from "../../Elementa";

const Color = Java.type("java.awt.Color");
export function getJavaColor(color){
    return new Color(color.getRed()/255, color.getGreen()/255, color.getBlue()/255, (color.getAlpha()/255) ? color.getAlpha()/255 : 0);
}

export function createDebugHud() {
    return [createDebugHudElement(PLAYER_INFORMATION, 200), createDebugHudElement(TOOL_INFORMATION, 350), createDebugHudElement(PET_INFORMATION, 500), createDebugHudElement(GARDEN_INFORMATION, 650)];
}


function createDebugHudElement(Information, offset) {
    const dragOffset = { x: 0, y: 0 };
    let guiIsSelected;
    let containerX = offset;
    let containerY = 50;

    const mainUIContainer = new UIRoundedRectangle(3)
        .setX((containerX).pixels())
        .setY((containerY).pixels())
        .setWidth(new ChildBasedMaxSizeConstraint())
        .setHeight(new AdditiveConstraint(new ChildBasedRangeConstraint(), (5).pixels()))
        .setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0.3)));

    let values = [];

    for (let key in Information) {
        if (Information.hasOwnProperty(key)) {
            values.push(`${key}: ${Information[key]}`);
        }
    }

    values.forEach((value, idx) => { 
        const textElement2 = new UIWrappedText(`${value}`, centered = true)
            .setX((3).pixels())
            .setY(new AdditiveConstraint(new SiblingConstraint(), (3).pixels()))
            .setColor(new ConstantColorConstraint(Settings.colorToolValueText))
            .setChildOf(mainUIContainer);
            
        textElement2.startTimer(50, 0, function updateText() {
            values=[];
            for (let key in Information) {
                if (Information.hasOwnProperty(key)) {
                    values.push(`${key}: ${Information[key]}`);
                }
            }
            textElement2.setText(values[idx]);
            textElement2.setColor(new ConstantColorConstraint(Settings.colorToolValueText));
        });
    });

    mainUIContainer
        .onMouseClick((comp, event) => {
            if(Settings.windowIsSelected) return;
            Settings.windowIsSelected = true;
            guiIsSelected = true;
            dragOffset.x = event.absoluteX;
            dragOffset.y = event.absoluteY;
        })
        .onMouseRelease(() => {
            if(Settings.windowIsSelected && guiIsSelected) {
                guiIsSelected = false;
                Settings.windowIsSelected = false;
            }
        })
        .onMouseDrag((comp, mx, my) => {
            if (!guiIsSelected) return;
            const absoluteX = mx + comp.getLeft();
            const absoluteY = my + comp.getTop();
            const dx = absoluteX - dragOffset.x;
            const dy = absoluteY - dragOffset.y;
            dragOffset.x = absoluteX;
            dragOffset.y = absoluteY;
            const newX = mainUIContainer.getLeft() + dx;
            const newY = mainUIContainer.getTop() + dy;
            mainUIContainer.setX(newX.pixels());
            mainUIContainer.setY(newY.pixels());
            containerY = newY;
            containerX = newX;
        })
        .onMouseLeave((comp) => {
            if (!guiWrapper.gui.isOpen()) return;
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP,
                    0.5,
                    new ConstantColorConstraint(
                        new Color(207 / 255, 207 / 255, 196 / 255, 0.3)
                    )
                );
            });
        })
        .onMouseEnter((comp) => {
            if (!guiWrapper.gui.isOpen()) return;
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP,
                    0.5,
                    new ConstantColorConstraint(
                        new Color(255 / 255, 255 / 255, 0 / 255)
                    ),
                    0
                );
            });
        })
    return mainUIContainer;
}