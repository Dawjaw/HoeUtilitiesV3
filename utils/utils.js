import { orderGUI } from "./constants";

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getSkyblockID(item) {
    if (item instanceof Item) {
        return item.getNBT().toObject()?.tag?.ExtraAttributes?.id;
    } else { return null; }
}

export function resetOrderGUI() {
    orderGUI.close();
    new Thread(() => {
        setTimeout(function() {
            orderGUI.open();
        }, 10);
    }).start();
    
}

export function getDaedalusAxeBonus(nbt) {
    const pattern = /§7Farming Fortune: §a\+([\d.]+)/; // §r
    const match = nbt?.tag?.display?.Lore?.join()?.match(pattern);
    if (match) {
        return parseFloat(match[1]);
    }
}

export function getItemRarity(item) {
    return item?.getLore()?.join()?.match(/(MYTHIC|COMMON|UNCOMMON|RARE|LEGENDARY|EPIC)/) ? item?.getLore()?.join().match(/(MYTHIC|COMMON|UNCOMMON|RARE|LEGENDARY|EPIC)/)[0] : null;
}

export function getItemRarityNBT(nbt) {
    return nbt?.tag?.display?.Lore?.join()?.match(/(MYTHIC|COMMON|UNCOMMON|RARE|LEGENDARY|EPIC)/) ? nbt?.tag?.display?.Lore?.join().match(/(MYTHIC|COMMON|UNCOMMON|RARE|LEGENDARY|EPIC)/)[0] : null;
}

export const triggerStats = {};

export const profileFunction = (func) => {
    const startTime = java.lang.System.nanoTime();
    const results = func();
    const endTime = java.lang.System.nanoTime();
    const timeTaken = (endTime - startTime) / 1e6;

    return {
        results: Array.isArray(results) ? results : [results],
        timeTaken: timeTaken
    };
};

export const updateTriggerStats = (name, timeTaken) => {
    if (!triggerStats[name]) {
        triggerStats[name] = {
            count: 0,
            totalTime: 0,
            minTime: Infinity,
            maxTime: -Infinity,
            avgTime: 0,
            durations: []
        };
    }

    const stats = triggerStats[name];
    stats.count++;
    stats.totalTime += timeTaken;
    stats.minTime = Math.min(stats.minTime, timeTaken);
    stats.maxTime = Math.max(stats.maxTime, timeTaken);
    stats.avgTime = stats.totalTime / stats.count;
    stats.durations.push(timeTaken);

    // Cap the durations array at 10,000 values
    if (stats.durations.length > 10000) {
        const removedValue = stats.durations.shift();
        stats.totalTime -= removedValue;
        stats.avgTime = stats.totalTime / stats.count;
    }
};

const calculatePercentiles = (durations) => {
    const sortedDurations = [...durations].sort((a, b) => a - b);
    const percentile90Index = Math.floor(sortedDurations.length * 0.9) - 1;
    const percentile99Index = Math.floor(sortedDurations.length * 0.99) - 1;
    return {
        percentile90: sortedDurations[percentile90Index],
        percentile99: sortedDurations[percentile99Index],
    };
};

export const printAllTriggerStatsJson = (triggerStats) => {
    const allTriggerStatsWithPercentiles = {};

    Object.keys(triggerStats).forEach((name) => {
        const stats = triggerStats[name];
        const percentiles = calculatePercentiles(stats.durations);
        const statsWithoutDurations = {
            count: stats.count,
            totalTime: stats.totalTime,
            minTime: stats.minTime,
            maxTime: stats.maxTime,
            avgTime: stats.avgTime,
            percentile90: percentiles.percentile90,
            percentile99: percentiles.percentile99
        };
        allTriggerStatsWithPercentiles[name] = statsWithoutDurations;
    });

    return allTriggerStatsWithPercentiles;
};

const createRegisterFunction = (eventType, extraConfig) => (name, callback, configValue) => {
    const stepTrigger = register(eventType, () => {
        const profiledResult = profileFunction(callback);
        updateTriggerStats(name, profiledResult.timeTaken);
    });

    if (configValue) {
        if (extraConfig === 'setFps') {
            stepTrigger.setFps(configValue);
        } else if (extraConfig === 'setDelay') {
            stepTrigger.setDelay(configValue);
        };
    }

    return stepTrigger;
};

export const registerStepTriggerFps = createRegisterFunction('step', 'setFps');
export const registerStepTriggerDelay = createRegisterFunction('step', 'setDelay');
export const registerTickTrigger = createRegisterFunction('tick');
export const registerRenderOverlayTrigger = (name, callback) => {
    return createRegisterFunction('renderOverlay')(name, callback).setPriority(Priority.HIGH);
};

export const registerPacketReceivedTrigger = (name, callback) => {
    return register('packetReceived', (packet) => {
        const profiledResult = profileFunction(() => callback(packet));
        updateTriggerStats(name, profiledResult.timeTaken);
    });
};