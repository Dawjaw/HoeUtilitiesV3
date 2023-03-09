/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config"
import gui, { XP_DISPLAY_INFORMATION, XP_DISPLAY_INFORMATION_TEXT } from "../utils/constants"
import {
    AdditiveConstraint,
    animate,
    Animations,
    ConstantColorConstraint,
    SiblingConstraint,
    UIRoundedRectangle,
    UIWrappedText,
    ChildBasedSizeConstraint,
    ChildBasedRangeConstraint,
    CenterConstraint,
} from "../../Elementa";
import { getRandomArbitrary } from "../utils/utils";

const Color = Java.type("java.awt.Color");
export function getJavaColor(color) {
    return new Color(color.getRed() / 255, color.getGreen() / 255, color.getBlue() / 255, (color.getAlpha() / 255) ? color.getAlpha() / 255 : 0);
}

export function createXpHud() {
    const dragOffset = { x: 0, y: 0 };
    let guiIsSelected;

    const mainUIContainer = new UIRoundedRectangle(3)
        .setX((Settings.locationXPHUDX).pixels())
        .setY((Settings.locationXPHUDY).pixels())
        .setWidth((200).pixels())
        .setHeight(new AdditiveConstraint(new ChildBasedRangeConstraint(), (10).pixels()))
        .setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0.3)));

    let items = [];
    let values = [];
    let info = JSON.parse(Settings.orderXP);

    for (let key in info) {
        if (info.hasOwnProperty(key)) {
            values.push(`${info[key]}`);
            items.push(`${key}`);
        }
    }

    let hiddenList = [];

    items.forEach((item, idx) => {
        let value = values[idx];

        const elementContainer = new UIRoundedRectangle(3)
            .setX((3).pixels())
            .setY(new AdditiveConstraint(new SiblingConstraint(), (3).pixels()))
            .setHeight((8).pixels())
            .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (10).pixels()))
            .setChildOf(mainUIContainer)
            .setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0)));

        const textElement = new UIWrappedText(`${XP_DISPLAY_INFORMATION_TEXT[item]}`)
            .setX(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
            .setY(new AdditiveConstraint(new SiblingConstraint(), (3).pixels()))
            .setColor(new ConstantColorConstraint(Settings.colorXPFeatureText))
            .setChildOf(elementContainer)

        const textElement2 = new UIWrappedText(`${value}`, centered = true)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setColor(new ConstantColorConstraint(Settings.colorXPValueText))
            .setChildOf(elementContainer);

        const centerElement = new UIRoundedRectangle(3)
            .setX((90).pixels())
            .setY((3).pixels())
            .setHeight((8).pixels())
            .setWidth((100).pixels())
            .setColor(new ConstantColorConstraint(new Color(255 / 255, 0 / 255, 0 / 255, 0)))
            .setChildOf(elementContainer);

        textElement2.setChildOf(centerElement);
        hiddenList.push([elementContainer, item, false]);

        let currentStep = getRandomArbitrary(0, 500);
        let currentStep2 = getRandomArbitrary(0, 500);
        const clamp = (num) => Math.min(Math.max(num, 0), 255);

        let lastTime2 = undefined;
        textElement2.startTimer(50, 0, function updateText() {
            if (!lastTime2) lastTime2 = Date.now();
            if (lastTime2 + 2000 < Date.now()) { lastTime2 += 50; return; };
            textElement2.setText(`${XP_DISPLAY_INFORMATION[item]}`);
            if (Settings.xprightAlign) {
                textElement2.setX((3).pixels(true));
            } else {
                textElement2.setX(new CenterConstraint());
            }
            if (!Settings.colorXPRainbow) {
                if (!textElement2.getShadow()) textElement2.setShadow(true);
                textElement2.setColor(new ConstantColorConstraint(Settings.colorXPValueText));
            } else {
                currentStep2++
                let red = ((Math.sin((currentStep2 / 6)) + 0.75) * 170).toFixed(0);
                let green = ((Math.sin(currentStep2 / 6 + 2 * Math.PI / 3) + 0.75) * 170).toFixed(0);
                let blue = ((Math.sin(currentStep2 / 6 + 4 * Math.PI / 3) + 0.75) * 170).toFixed(0);
                textElement2.setColor(new ConstantColorConstraint(new Color(clamp(Number(red)) / 255, clamp(Number(green)) / 255, clamp(Number(blue)) / 255)));
                textElement2.setShadow(false);
            }
            lastTime2 = Date.now();
        });

        let lastTime = undefined;
        textElement.startTimer(50, 0, function updateText() {
            if (!lastTime) lastTime = Date.now();
            if (lastTime + 2000 < Date.now()) { lastTime += 50; return; }
            if (!Settings.colorXPRainbow) {
                if (!textElement.getShadow()) textElement.setShadow(true);
                textElement.setColor(new ConstantColorConstraint(Settings.colorXPFeatureText));
            } else {
                currentStep++
                let red = ((Math.sin((currentStep / 5)) + 0.75) * 170).toFixed(0);
                let green = ((Math.sin(currentStep / 5 + 2 * Math.PI / 3) + 0.75) * 170).toFixed(0);
                let blue = ((Math.sin(currentStep / 5 + 4 * Math.PI / 3) + 0.75) * 170).toFixed(0);
                textElement.setColor(new ConstantColorConstraint(new Color(clamp(Number(red)) / 255, clamp(Number(green)) / 255, clamp(Number(blue)) / 255)));
                textElement.setShadow(false);
            }
            lastTime = Date.now();
        });
    });

    mainUIContainer
        .onMouseClick((comp, event) => {
            if (Settings.windowIsSelected) return;
            Settings.windowIsSelected = true;
            guiIsSelected = true;
            dragOffset.x = event.absoluteX;
            dragOffset.y = event.absoluteY;
            mainUIContainer.setColor(new ConstantColorConstraint(
                new Color(255 / 255, 255 / 255, 0 / 255)));
        })
        .onMouseRelease(() => {
            if (Settings.windowIsSelected && guiIsSelected) {
                guiIsSelected = false;
                Settings.windowIsSelected = false;
            }
        })
        .onMouseDrag((comp, mx, my) => {
            if (!guiIsSelected) return;
            mainUIContainer.setColor(new ConstantColorConstraint(
                new Color(255 / 255, 255 / 255, 0 / 255)));
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
            Settings.locationXPHUDX = newX;
            Settings.locationXPHUDY = newY;
            Settings.save();
        })
        .onMouseLeave((comp) => {
            if (!gui.isOpen()) return;
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP,
                    0.5,
                    new ConstantColorConstraint(
                        Settings.colorXPBackground
                    )
                );
            });
        })
        .onMouseEnter((comp) => {
            if (!gui.isOpen()) return;
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
    // hiddenList.push([elementContainer, item, false]);
    mainUIContainer.startTimer(100, 0, function hideAndUnhide() {
        if (!gui.isOpen()) mainUIContainer.setColor(new ConstantColorConstraint(Settings.colorXPBackground));
        hiddenList.forEach((list, idx) => {
            if (Settings[list[1]] === false) {
                if (!list[2]) {
                    list[0].hide();
                    hiddenList[idx] = [list[0], list[1], true];
                }
            } else {
                if (list[2]) {
                    list[0].unhide(true);
                    hiddenList[idx] = [list[0], list[1], false];
                }
            }
        });
    });
    return mainUIContainer;
}