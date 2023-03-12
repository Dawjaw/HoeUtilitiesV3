import Settings from "../config";
import { JacobFeature } from "../features/jacob";

register("step", getApiData).setDelay(300);
register("gameLoad", getApiData);

function getApiData() {
    print("[HU3] Updating data...");

    // API key is not needed for this API
    JacobFeature.getEvents();

    // Hypixel API so key is needed for both
    if (Settings.apiKey === "") {
        ChatLib.chat("§ePlease set your api key by generating a new key with §b/api new §eor using §b/hu3 key yourkey §e!§r");
        print("[HU3] Api key not set, failed to get profile and bazaar stats");
        return;
    }
    getPlayerStats();
    getBazaarData();
}