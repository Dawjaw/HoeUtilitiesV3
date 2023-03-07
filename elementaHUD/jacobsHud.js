/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config"
import { getRandomArbitrary } from "../utils/utils";
import gui, { JACOB_EVENTS, CROP_TO_IMAGE } from "../utils/constants"
import {
    AdditiveConstraint,
    animate,
    Animations,
    ConstantColorConstraint,
    SiblingConstraint,
    UIRoundedRectangle,
    UIImage,
    UIWrappedText,
    ChildBasedSizeConstraint,
    ChildBasedRangeConstraint,
    ElementaFonts,
    UIText
} from "../../Elementa";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");

function generateImagesAndText() {
    let currentStep = getRandomArbitrary(0, 500);
    const clamp = (num) => Math.min(Math.max(num, 0), 255);

    let images = [];

    let values = [0,1,2];

    values.forEach((value, idx) => {
        const image = UIImage.Companion.ofFile(new File(`config/ChatTriggers/images/${CROP_TO_IMAGE[JACOB_EVENTS.cropsInNextEvent[idx]]}.png`))
            .setX(new SiblingConstraint())
            .setY((2.5).pixels())
            .setWidth((15).pixels())
            .setHeight((15).pixels())

        images.push(image);
    });

    const textElement = new UIWrappedText(`${JACOB_EVENTS.timeUntilJacobEvent}`)
        .setX(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
        .setY((6).pixels())

    textElement.startTimer(50, 0, function updateText() {
        textElement.setText(`${JACOB_EVENTS.timeUntilJacobEvent}`);
        if (!Settings.colorJacobRainbow) {
            if(!textElement.getShadow()) textElement.setShadow(true);
            textElement.setColor(new ConstantColorConstraint(Settings.colorJacobValueText));
        } else {
            currentStep++
            let red = ((Math.sin((currentStep / 5)) + 0.75) * 170).toFixed(0);
            let green = ((Math.sin(currentStep / 5 + 2 * Math.PI / 3) + 0.75) * 170).toFixed(0);
            let blue = ((Math.sin(currentStep / 5 + 4 * Math.PI / 3) + 0.75) * 170).toFixed(0);
            textElement.setColor(new ConstantColorConstraint(new Color(clamp(Number(red)) / 255, clamp(Number(green)) / 255, clamp(Number(blue)) / 255)));
            textElement.setShadow(false);
        }
    });

    images.push(textElement);

    return images;
}

export function createJacobHud() {
    const dragOffset = { x: 0, y: 0 };
    let guiIsSelected = false;
    let currentImages = JACOB_EVENTS.cropsInNextEvent;

    const mainUIContainer = new UIRoundedRectangle(3)
        .setX((Settings.locationJacobHUDX).pixels())
        .setY((Settings.locationJacobHUDY).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (10).pixels()))
        .setHeight(new AdditiveConstraint(new ChildBasedRangeConstraint(), (5).pixels()))
        .setColor(new ConstantColorConstraint(Settings.colorJacobBackground));

    mainUIContainer.startTimer(1000, 0, function updateJacobHud() {
        mainUIContainer.setColor(new ConstantColorConstraint(Settings.colorJacobBackground));
        if (JSON.stringify(JACOB_EVENTS.cropsInNextEvent) !== JSON.stringify(currentImages)) {
            mainUIContainer.clearChildren();
            generateImagesAndText().forEach(image => { mainUIContainer.addChild(image) });
            currentImages = JACOB_EVENTS.cropsInNextEvent;
        }
    });

    let images = generateImagesAndText();
    images.forEach(image => { mainUIContainer.addChild(image) });

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
            Settings.locationJacobHUDX = newX;
            Settings.locationJacobHUDY = newY;
            Settings.save();
        })
        .onMouseLeave((comp) => {
            if (!gui.isOpen()) return;
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
    return mainUIContainer;
}