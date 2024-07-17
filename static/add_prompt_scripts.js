$(document).ready(function () {
    $('#add-prompt-form').submit(function (event) {
        event.preventDefault();
        const newPromptTitle = $('#new-title').val();
        const newPromptText = $('#new-prompt').val();

        // Generiere eine neue Prompt-ID basierend auf Datum und Uhrzeit, um Konflikte zu vermeiden
        const newPromptID = Date.now().toString();

        const newPrompt = {
            "Prompt ID": newPromptID,
            "Titel": newPromptTitle,
            "Prompt": newPromptText
        };

        $.ajax({
            url: '/prompts',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newPrompt),
            success: function () {
                $('#new-title').val('');
                $('#new-prompt').val('');
                alert('Prompt added successfully!');
            },
            error: function () {
                alert('Error adding prompt!');
            }
        });
    });
});
