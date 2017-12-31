function main(){
    // Array of all the sliders in content
    var allSliderDivs =
        [];
    var contentBox =
        $('#contentBox');

    function makeSliderDiv(fieldTitle, id, min, max, val, step){
        var sliderContainerDiv = $(document.createElement('div'));
        sliderContainerDiv.html(`
            <span class="field-title"> ${fieldTitle} </span>
            <span id="${(id + "Val")}"> ${val} </span>
            <input
                type="range" min="${min}" max="${max}"
                value="${val}" step="${step}"
                class="slider" id="${id}">` );
        contentBox.append(sliderContainerDiv);
        return sliderContainerDiv; }

    $.getJSON('./config.json', function(config){
        for (var key in config){
            allSliderDivs.push(
                makeSliderDiv(
                    config[key].fieldTitle,
                    config[key].id,
                    config[key].min,
                    config[key].max,
                    config[key].val,
                    config[key].step ));
            var boundObject = {
                boundKey: key,
                reset: config[key].reset,
                index: allSliderDivs.length - 1 };
            (function(eventInfoHelper){
                allSliderDivs[eventInfoHelper.index]
                    .find('#' + eventInfoHelper.boundKey)
                    .on('input', function () {
                        allSliderDivs[eventInfoHelper.index]
                            .find('#' + config[eventInfoHelper.boundKey].id + 'Val')
                            .text($(this)
                            .val() );
                        var event = {
                            type: "slider",
                            value: $(this).val(),
                            id: eventInfoHelper.boundKey,
                            reset: eventInfoHelper.reset };
                        EventBridge.emitWebEvent(JSON.stringify(event));
                    });
            })(boundObject);
        }
    });
}

$(document).ready(main);
