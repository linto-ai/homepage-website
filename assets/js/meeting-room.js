$(document).ready(function() {
    // LIGHTS
    const lightBtn = $('#toggle-light');
    const lightsOn = $('#LUMIERE-ON');
    const eteind = $('#ETEIND');
    const store = $('#VOLETS-ON');

    lightBtn.on('click', function() {

        // turn off light
        if (lightsOn.hasClass('visible')) {
            lightsOn.removeClass('visible').addClass('hidden');

        }
        // turn on light
        else {

            lightsOn.removeClass('hidden').addClass('visible');
        }
    })


    // STORE 
    storeBtn = $('#toggle-store')
    storeBtn.on('click', function() {
        if (store.hasClass('hidden')) {
            // close store
            store.removeClass('hidden').addClass('visible');
            eteind.removeClass('hidden').addClass('visible');
        }
        // open store
        else {
            store.removeClass('visible').addClass('hidden');
            eteind.removeClass('visible').addClass('hidden');

        }
    })
});