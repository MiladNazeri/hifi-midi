function main(){
    // Array of all the sliders in content
    var allSliderDivs = [];

    var contentBox = $('#contentBox');

    function makeSliderDiv(fieldTitle, id, min, max, val, step){
        var sliderContainerDiv = $(document.createElement('div'));
        sliderContainerDiv.html(
            '<span class="field-title"></span>' + fieldTitle +
            '<span id="' + (id + "Val") + '">' + val + '</span>' +
            ' <input type="range" min="' + min + '" max="' + max +
            '" value="' + val + '" step="' + step +
            '" class="slider" id="' + id + '">');
        contentBox.append(sliderContainerDiv);
        return sliderContainerDiv;
    }

    $.getJSON('./planetDefault.json', function(planetConfigJSON){
        for (var key in planetConfigJSON){
            allSliderDivs.push(
                makeSliderDiv(
                    planetConfigJSON[key].fieldTitle,
                    planetConfigJSON[key].id,
                    planetConfigJSON[key].min,
                    planetConfigJSON[key].max,
                    planetConfigJSON[key].val,
                    planetConfigJSON[key].step
                )
            );

            var boundObject = { boundKey: key, reset: planetConfigJSON[key].reset, index: allSliderDivs.length - 1 };
            (function(eventInfoHelper){
                allSliderDivs[eventInfoHelper.index]
                    .find('#' + eventInfoHelper.boundKey)
                    .on('input', function () {
                        allSliderDivs[eventInfoHelper.index]
                            .find('#' + planetConfigJSON[eventInfoHelper.boundKey].id + 'Val')
                            .text($(this)
                            .val()
                            );
                        var event = {
                            type: "slider",
                            value: $(this).val(),
                            id: eventInfoHelper.boundKey,
                            reset: eventInfoHelper.reset
                        };
                        EventBridge.emitWebEvent(JSON.stringify(event));
                    });
            })(boundObject);
        }
    });
}

$(document).ready(main);
