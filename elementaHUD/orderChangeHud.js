/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config"
import gui, { TOOL_DISPLAY_INFORMATION, XP_DISPLAY_INFORMATION_TEXT, TOOL_DISPLAY_INFORMATION_HAS_BAR, TOOL_DISPLAY_INFORMATION_TEXT, PLAYER_INFORMATION, TOOL_INFORMATION, orderGUI, mainHUD, XP_DISPLAY_INFORMATION } from "../utils/constants"
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
    CenterConstraint,
    RainbowColorConstraint,
} from "../../Elementa";
import { getRandomArbitrary, resetOrderGUI } from "../utils/utils";

const Color = Java.type("java.awt.Color");
function getJavaColor(color) {
    return new Color(color.getRed() / 255, color.getGreen() / 255, color.getBlue() / 255, (color.getAlpha() / 255) ? color.getAlpha() / 255 : 0);
}

export function createOrderHUD(info_components) {
    const dragOffset = { x: 0, y: 0 };
    let guiIsSelected;
    let upSetup = false;
    let downSetup = false;
    let elementSelected = false;
    let selectedElement;

    const mainUIContainer = new UIRoundedRectangle(3)
        //.setX((Settings.locationOrderHUDX).pixels())
        //.setY((Settings.locationOrderHUDY).pixels())
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((220).pixels())
        .setHeight((150).pixels())
        .setColor(new ConstantColorConstraint(Settings.colorOrderBackground));

    let items = [];
    let values = [];

    for (let key in info_components) {
        if (info_components.hasOwnProperty(key)) {
            values.push(`${info_components[key]}`);
            items.push(`${key}`);
        }
    }

    let list
    let orderLL = 0;
    let newListT = JSON.parse(Settings.orderTools);
    let newListP = JSON.parse(Settings.orderXP);
    let textValues = [];
    if (items[0] in newListT) {
        list = newListT;
        textValues = TOOL_DISPLAY_INFORMATION_TEXT;
    } else if (items[0] in newListP) {
        orderLL = 1;
        list = newListP;
        textValues = XP_DISPLAY_INFORMATION_TEXT;
    }

    items = [];
    values = [];

    for (let key in list) {
        if (list.hasOwnProperty(key)) {
            values.push(`${list[key]}`);
            items.push(`${key}`);
        }
    }

    const upButton = new UIRoundedRectangle(3)
        .setX((mainUIContainer.getWidth()-10).pixels())
        .setWidth((10).pixels())
        .setHeight((10).pixels())
        .setColor(new ConstantColorConstraint(new Color(255 / 255, 107 / 255, 100 / 255, 0.5)))
        .setChildOf(mainUIContainer);

    upButton.onMouseClick((comp, event) => {
        print("clicked up")
        if (elementSelected) {
            moveUp(selectedElement);
        }
    })
    
    const downButton = new UIRoundedRectangle(3)
        .setX((mainUIContainer.getWidth()-10).pixels())
        .setY((mainUIContainer.getHeight()-10).pixels())
        .setWidth((10).pixels())
        .setHeight((10).pixels())
        .setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0.5)))
        .setChildOf(mainUIContainer);

    downButton.onMouseClick((comp, event) => {
        print("clicked down")
        if (elementSelected) {
            moveDown(selectedElement);
        }
    });

    items.forEach((item, idx) => {
        let value = values[idx];
        let selected = false;

        const elementContainer = new UIRoundedRectangle(3)
            .setX((3).pixels())
            //.setY(new AdditiveConstraint(new SiblingConstraint(), (3).pixels()))
            .setY(((idx*11) + 5).pixels())
            .setHeight((8).pixels())
            .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (10).pixels()))
            .setChildOf(mainUIContainer)
            .setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0)));

        const textElement = new UIWrappedText(`${textValues[item]}: ${info_components[item]}`)
            .setX(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
            .setY(new AdditiveConstraint(new SiblingConstraint(), (0).pixels()))
            .setColor(new ConstantColorConstraint(Settings.colorOrderValueText))
            .setChildOf(elementContainer);

        textElement.onMouseClick((comp, event) => {
            //print("clicked text")
            if (selectedElement == item && elementSelected) {
                elementSelected = false;
                selectedElement = null;
                elementContainer.setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0)));
            } else if (selectedElement !== item && !elementSelected) {
                selectedElement = item;
                elementSelected = true;
                elementContainer.setColor(new ConstantColorConstraint(new Color(255 / 255, 255 / 255, 0 / 255)));
            }
        })
        textElement.startTimer(50, 0, function setupLocation() {
            textElement.setText(`${textValues[item]}: ${info_components[item]}`);
        });
    });

    function moveUp(element) {
        let keys
        if (orderLL == 0) {
            keys = Object.keys(JSON.parse(Settings.orderTools));
        } else if (orderLL == 1) {
            keys = Object.keys(JSON.parse(Settings.orderXP));
        }
        const index = keys.indexOf(element);

        let newIndex = index - 1;
        if (newIndex < 0) {
            newIndex = 0;
        }

        keys.splice(index, 1);
        keys.splice(newIndex, 0, element);

        update(keys, element)
        regenerateChildren(mainUIContainer, newIndex, keys, info_components, orderLL, textValues);
    }

    function moveDown(element) {
        let keys
        if (orderLL == 0) {
            keys = Object.keys(JSON.parse(Settings.orderTools));
        } else if (orderLL == 1) {
            keys = Object.keys(JSON.parse(Settings.orderXP));
        }
        const index = keys.indexOf(element);

        let newIndex = index + 1;
        if (newIndex > keys.length-2) {
            newIndex = keys.length;
        }

        keys.splice(index, 1);
        keys.splice(newIndex, 0, element);
        update(keys, element)
        regenerateChildren(mainUIContainer, newIndex, keys, info_components, orderLL, textValues);
    }

    function update(keys, element) {
        if (element in TOOL_DISPLAY_INFORMATION) {    
            let to_change = JSON.parse(Settings.orderTools);
            const newObj = {};
            keys.forEach((key) => {
                newObj[key] = to_change[key];
            });
            Settings.orderTools = JSON.stringify(newObj);
        }
        if (element in XP_DISPLAY_INFORMATION) {
            let to_change = JSON.parse(Settings.orderXP);
            const newObj = {};
            keys.forEach((key) => {
                newObj[key] = to_change[key];
            });
            Settings.orderXP = JSON.stringify(newObj);
        }
    }
    return mainUIContainer;
}

function regenerateChildren(mainUIContainer, newIndex, keys, info_components, orderLL, textValues) {
    let elementSelected
    let selectedElement
    mainUIContainer.clearChildren();
    keys.forEach((item, idx) => {
        //let value = values[idx];
        let selected = false;

        const elementContainer = new UIRoundedRectangle(3)
            .setX((3).pixels())
            //.setY(new AdditiveConstraint(new SiblingConstraint(), (3).pixels()))
            .setY(((idx*11) + 5).pixels())
            .setHeight((8).pixels())
            .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (10).pixels()))
            .setChildOf(mainUIContainer)
            .setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0)));

        if (idx === newIndex) {
            selected = true;
            elementSelected = true;
            selectedElement = item;
            elementContainer.setColor(new ConstantColorConstraint(new Color(255 / 255, 255 / 255, 0 / 255)));
        }

        const textElement = new UIWrappedText(`${textValues[item]}: ${info_components[item]}`)
            .setX(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
            .setY(new AdditiveConstraint(new SiblingConstraint(), (0).pixels()))
            .setColor(new ConstantColorConstraint(Settings.colorOrderValueText))
            .setChildOf(elementContainer);

        textElement.onMouseClick((comp, event) => {
            //print("clicked text")
            if (selectedElement == item && elementSelected) {
                elementSelected = false;
                selectedElement = null;
                elementContainer.setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0)));
            } else if (selectedElement !== item && !elementSelected) {
                selectedElement = item;
                elementSelected = true;
                elementContainer.setColor(new ConstantColorConstraint(new Color(255 / 255, 255 / 255, 0 / 255)));
            }
        })
        textElement.startTimer(50, 0, function setupLocation() {
            textElement.setText(`${textValues[item]}: ${info_components[item]}`);
        });

        const upButton = new UIRoundedRectangle(3)
        .setX((mainUIContainer.getWidth()-10).pixels())
        .setWidth((10).pixels())
        .setHeight((10).pixels())
        .setColor(new ConstantColorConstraint(new Color(255 / 255, 107 / 255, 100 / 255, 0.5)))
        .setChildOf(mainUIContainer);

        upButton.onMouseClick((comp, event) => {
            //print("clicked up")
            if (elementSelected) {
                moveUp(selectedElement);
            }
        })
        
        const downButton = new UIRoundedRectangle(3)
            .setX((mainUIContainer.getWidth()-10).pixels())
            .setY((mainUIContainer.getHeight()-10).pixels())
            .setWidth((10).pixels())
            .setHeight((10).pixels())
            .setColor(new ConstantColorConstraint(new Color(207 / 255, 207 / 255, 196 / 255, 0.5)))
            .setChildOf(mainUIContainer);

        downButton.onMouseClick((comp, event) => {
            //print("clicked down")
            if (elementSelected) {
                moveDown(selectedElement);
            }
        });
    });

    function moveUp(element) {
        let keys
        if (orderLL == 0) {
            keys = Object.keys(JSON.parse(Settings.orderTools));
        } else if (orderLL == 1) {
            keys = Object.keys(JSON.parse(Settings.orderXP));
        }
        const index = keys.indexOf(element);

        let newIndex = index - 1;
        if (newIndex < 0) {
            newIndex = 0;
        }

        keys.splice(index, 1);
        keys.splice(newIndex, 0, element);

        //mainUIContainer.insertChildAfter(mainUIContainer.children[newIndex], mainUIContainer.children[index]);
        //mainUIContainer.insertChildBefore(mainUIContainer.children[index], mainUIContainer.children[newIndex + 1]);

        update(keys, element)
        regenerateChildren(mainUIContainer, newIndex, keys, info_components, orderLL, textValues);
    }

    function moveDown(element) {
        let keys
        if (orderLL == 0) {
            keys = Object.keys(JSON.parse(Settings.orderTools));
        } else if (orderLL == 1) {
            keys = Object.keys(JSON.parse(Settings.orderXP));
        }
        const index = keys.indexOf(element);

        let newIndex = index + 1;
        if (newIndex > keys.length-2) {
            newIndex = keys.length;
        }

        keys.splice(index, 1);
        keys.splice(newIndex, 0, element);
        update(keys, element)
        regenerateChildren(mainUIContainer, newIndex, keys, info_components, orderLL, textValues);
    }

    function update(keys, element) {
        //Settings.orderTools=JSON.stringify(TOOL_DISPLAY_INFORMATION)
        //Settings.orderXP=JSON.stringify(XP_DISPLAY_INFORMATION)
        if (element in TOOL_DISPLAY_INFORMATION) {    
            let to_change = JSON.parse(Settings.orderTools);
            const newObj = {};
            keys.forEach((key) => {
                newObj[key] = to_change[key];
            });
            Settings.orderTools = JSON.stringify(newObj);
        }
        if (element in XP_DISPLAY_INFORMATION) {
            let to_change = JSON.parse(Settings.orderXP);
            const newObj = {};
            keys.forEach((key) => {
                newObj[key] = to_change[key];
            });
            Settings.orderXP = JSON.stringify(newObj);
        }
    }
}