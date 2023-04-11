import { getSkyblockID } from '../utils/utils.js';
import { BLOCK_BREAK_OBJECT } from "../utils/constants";
import Settings from "../config";
import { registerStepTriggerFps } from '../utils/utils.js';
import { registerPacketReceivedTrigger } from '../utils/utils.js';

const File = Java.type('java.io.File');

export function startBerryAlert() {
    const S2FPacketSetSlot = Java.type('net.minecraft.network.play.server.S2FPacketSetSlot');
    const dyeSound = new Sound({source: new File(Config.modulesFolder + "/HoeUtilitiesV3/assets/dyeSound.ogg").getName(), volume: 1, priority: true});

    registerPacketReceivedTrigger('StrawBerry sound packets', (packet) => {
        if (packet instanceof S2FPacketSetSlot) {
            if (packet?.func_149174_e() !== null) {
                if (getSkyblockID(new Item(packet?.func_149174_e())) === "DYE_WILD_STRAWBERRY" && ((Date.now() - BLOCK_BREAK_OBJECT.timeSinceLastBreak) / 1000) < 5) {
                    if (Settings.useCustomStrawberrySound) {
                        dyeSound.play();
                    } else {
                        new Thread(() => {
                            showTitle("§6§lWILD STRAWBERRY DYE§r", "", 10, 80, 10);
                            playSound("random.levelup", 1, 0.1);
                            playSound("random.levelup", 1, 0.2);
                            playSound("random.levelup", 1, 0.3);
                            playSound("random.levelup", 1, 0.4);
                            playSound("random.levelup", 1, 0.5);
                            playSound("random.levelup", 1, 0.6);
                            playSound("random.levelup", 1, 0.7);
                            playSound("random.levelup", 1, 0.8);
                            playSound("random.levelup", 1, 0.9)
                            playSound("random.levelup", 1, 1);
                        }).start();
                    }
                }
                //print(getSkyblockID(new Item(packet.func_149174_e())));
            }
        }
    });

    function showTitle(title, subtitle, fadeIn, stay, fadeOut) {
        Client.showTitle(title, subtitle, fadeIn, stay, fadeOut);
    }

    function playSound(sound, volume, pitch) {
        World.playSound(sound, volume, pitch);
    }

    registerStepTriggerFps('StrawBerry Sound Updater', () => {
        if (!World.isLoaded() || !Settings.useCustomStrawberrySound) return;
        dyeSound?.setPosition(Player.getX(), Player.getY(), Player.getZ());
        dyeSound?.setVolume(1);
    }, 60);
}