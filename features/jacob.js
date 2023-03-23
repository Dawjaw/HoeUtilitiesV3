import guiWrapper from "../utils/constants";
import Settings from "../config";
import axios from "../../axios";
import { CROP_TO_IMAGE } from "../utils/constants";
import {
    AdditiveConstraint,
    ChildBasedRangeConstraint,
    ChildBasedSizeConstraint,
    UIRoundedRectangle,
    ConstantColorConstraint,
    Animations,
    UIText,
    SiblingConstraint,
    RainbowColorConstraint,
    UIImage,
    animate
} from "../../Elementa"

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");

export class JacobFeature {
    static dragInfo = {
        relativeX: 0,
        relativeY: 0,
        selected: false,
    };

    static container = new UIRoundedRectangle(3)
        .setX((Settings.locationJacobHUDX).pixels())
        .setY((Settings.locationJacobHUDY).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (10).pixels()))
        .setHeight(new AdditiveConstraint(new ChildBasedRangeConstraint(), (5).pixels()))
        .setColor(new ConstantColorConstraint(Settings.colorJacobBackground))
        .onMouseClick((_, event) => {
            JacobFeature.dragInfo.selected = true;
            JacobFeature.dragInfo.relativeX = event.relativeX;
            JacobFeature.dragInfo.relativeY = event.relativeY;
        })
        .onMouseRelease(() => {
            if (!JacobFeature.dragInfo.selected) return;
            JacobFeature.dragInfo.selected = false;
        })
        .onMouseDrag((comp, mx, my) => {
            if (!JacobFeature.dragInfo.selected) return;

            comp.setX((comp.getLeft() + mx - JacobFeature.dragInfo.relativeX).pixels());
            comp.setY((comp.getTop() + my - JacobFeature.dragInfo.relativeY).pixels());

            Settings.locationJacobHUDX = comp.getLeft();
            Settings.locationJacobHUDY = comp.getTop();
            Settings.save();
        })
        .onMouseEnter((comp) => {
            if (!guiWrapper.gui.isOpen()) return;
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP, 0.3, new ConstantColorConstraint(new Color(17 / 255, 192 / 255, 49 / 255))
                );
            });
        })
        .onMouseLeave((comp) => {
            if (!guiWrapper.gui.isOpen()) return;
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP, 0.3, new ConstantColorConstraint(Settings.colorJacobBackground)
                );
            });
        });

    static timer = new UIText("")
        .setX(new AdditiveConstraint(new SiblingConstraint(), (5).pixels()))
        .setY((6).pixels())
        .setColor(new ConstantColorConstraint(Settings.colorJacobValueText))


    timeLeft = "";
    crops = ["Carrot", "Carrot", "Carrot"];
    cachedCrops = "";

    constructor(window) {
        this.window = window;

        this.register = register("tick", () => {
            // Add the component if it should be added and isn't already part of the window
            if (Settings.jacobHudEnabled && !window.children.includes(JacobFeature.container)) {
                window.addChild(JacobFeature.container);
            }
            // Remove the component if it shouldn't be seen and if it's still in the window
            else if (!Settings.jacobHudEnabled && window.children.includes(JacobFeature.container)) {
                window.removeChild(JacobFeature.container);
            }

            // Checks if the response succeeded with valid data, otherwise just set some defaults
            if (Symbol.iterator in JacobFeature.eventList) {
                for (event of JacobFeature.eventList) {
                    let currentTime = Date.now();
                    let eventTime = event["time"] * 1e3;

                    // It is possible to have an event in storage that has already past, this gets the most
                    // recent on that needs to come
                    if (currentTime < eventTime) {
                        const delta = eventTime - currentTime;

                        const minutes = Math.floor(delta / 6e4);
                        const seconds = Math.floor((delta % 6e4) / 1e3);

                        this.timeLeft = `${(minutes < 10 ? "0" : "") + minutes}:${(seconds < 10 ? "0" : "") + seconds}`;

                        // Now we have the closest event to the current time, we get the crops for that event
                        this.crops = event["crops"];

                        // Break the loop, we don't need to keep looking for other events
                        break;
                    }
                }
            } else {
                this.timeLeft = "§cNo Events Found";
                this.crops = ["Carrot", "Carrot", "Carrot"];
                // Someone likes carrots
            }
        });

        JacobFeature.container.startTimer(1000, 0, () => {
            // Only trigger when outside of the editing gui due to hovering effects and
            // updates when the background color changes
            if (!guiWrapper.gui.isOpen()) JacobFeature.container.setColor(new ConstantColorConstraint(Settings.colorJacobBackground))


            if (this.cachedCrops !== this.crops.toString()) {
                // Removes the old photos
                JacobFeature.container
                    .clearChildren()
                    .addChild(JacobFeature.timer);

                for (let index = 0; index <= 2; index++) {
                    let image = UIImage.Companion.ofFile(new File(`config/ChatTriggers/images/${CROP_TO_IMAGE[this.crops[index]]}.png`))
                        .setX(new SiblingConstraint())
                        .setY((2.5).pixels())
                        .setWidth((15).pixels())
                        .setHeight((15).pixels());

                    // Insert before to make images appear on the left of the timer
                    JacobFeature.container.insertChildBefore(image, JacobFeature.timer);
                };

                this.cachedCrops = this.crops.toString();
            }
        })

        JacobFeature.timer.startTimer(1000, 0, () => {
            JacobFeature.timer.setText(this.timeLeft);

            // This covers both the rainbow text setting being changed and
            // the changes to the constant color
            if (Settings.colorJacobRainbow) JacobFeature.timer.setColor(new RainbowColorConstraint())
            else JacobFeature.timer.setColor(new ConstantColorConstraint(Settings.colorJacobValueText));
        })
    }

    static eventList = {};
    static getEvents() {
        axios.get("https://dawjaw.net/jacobs", {
            headers: {
                "User-Agent": "Mozilla/5.0 (ChatTriggers)"
            },
        }).then(response => {
            JacobFeature.eventList = response.data;
        }).catch(error => {
            print(error)
            if (error.isAxiosError) {
                print(error.code + ": " + error.response.data);
            } else {
                print(error.message);
            }
        });
    }
}