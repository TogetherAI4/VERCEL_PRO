$(document).ready(function () {
    let promptsData = [];
    let currentPage = 1;
    const itemsPerPage = 20;

    function fetchPrompts() {
        $.get('/prompts', function (data) {
            promptsData = data;
            displayPrompts();
        });
    }

    function displayPrompts() {
        $('#prompt-list').empty();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = promptsData.slice(start, end);

        paginatedData.forEach(prompt => {
            const promptTitle = prompt['title'] || '';
            $('#prompt-list').append(`
                <div class="prompt-item" data-id="${prompt['id']}">
                    <h3>${truncateText(promptTitle, 30)}${promptTitle.length > 30 ? '... <span class="show-more" data-id="' + prompt['id'] + '">mehr anzeigen</span>' : ''}</h3>
                </div>
            `);
        });

        // Delegierte Ereignisbindung für "mehr anzeigen"
        $('#prompt-list').on('click', '.show-more', function (event) {
            event.stopPropagation();
            const id = $(this).data('id');
            const selectedPrompt = promptsData.find(prompt => prompt['id'] === id);
            displayPromptDetails(selectedPrompt);
        });

        // Delegierte Ereignisbindung für "prompt-item"
        $('#prompt-list').on('click', '.prompt-item', function () {
            const id = $(this).data('id');
            const selectedPrompt = promptsData.find(prompt => prompt['id'] === id);
            displayPromptDetails(selectedPrompt);
        });
    }

    function truncateText(text, length) {
        if (text.length <= length) {
            return text;
        }
        return text.substring(0, length);
    }

    function displayPromptDetails(prompt) {
        if (!prompt) return;
        $('#details-content').html(`
            <h3>${prompt['title']}</h3>
            <p><strong>Prompt:</strong> ${prompt['prompt']}</p>
        `);
        $('#details-content').data('id', prompt['id']);
    }

    function copyPrompt() {
        const promptText = $('#details-content').find('p').text();
        navigator.clipboard.writeText(promptText).then(() => {
            alert('Prompt copied to clipboard');
        });
    }

    function editPrompt() {
        const promptID = $('#details-content').data('id');
        const prompt = promptsData.find(prompt => prompt['id'] === promptID);
        const newPromptText = prompt['prompt'];
        const newPromptTitle = prompt['title'];
        $('#details-content').html(`
            <input type="text" id="edit-title" value="${newPromptTitle}" />
            <textarea id="edit-prompt" rows="10">${newPromptText}</textarea>
        `);
        $('#save-button').show();
    }

    function savePrompt() {
        const promptID = $('#details-content').data('id');
        const prompt = promptsData.find(prompt => prompt['id'] === promptID);
        const newPromptTitle = $('#edit-title').val();
        const newPromptText = $('#edit-prompt').val();
        const promptIndex = promptsData.findIndex(prompt => prompt['id'] === promptID);

        if (promptIndex !== -1) {
            promptsData[promptIndex].title = newPromptTitle;
            promptsData[promptIndex].prompt = newPromptText;

            const updatedPrompt = {
                "Prompt ID": prompt['prompt_id'],
                "Titel": newPromptTitle,
                "Prompt": newPromptText
            };

            $.ajax({
                url: `/prompts/${promptID}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updatedPrompt),
                success: function () {
                    displayPromptDetails(updatedPrompt);
                    $('#save-button').hide();
                    displayPrompts();
                }
            });
        }
    }

    function deletePrompt() {
        const promptID = $('#details-content').data('id');
        const promptIndex = promptsData.findIndex(prompt => prompt['id'] === promptID);
        
        if (promptIndex !== -1) {
            $.ajax({
                url: `/prompts/${promptID}`,
                type: 'DELETE',
                success: function () {
                    promptsData.splice(promptIndex, 1);
                    $('#details-content').html('');
                    displayPrompts();
                }
            });
        }
    }

    function changePage(direction) {
        if (direction === 'next') {
            currentPage++;
        } else if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        }
        displayPrompts();
    }

    function searchPrompts() {
        $('#loading').show();
        const searchValue = $('#search').val().toLowerCase();
        setTimeout(function () {
            $('.prompt-item').each(function () {
                const promptText = $(this).text().toLowerCase();
                $(this).toggle(promptText.includes(searchValue));
            });
            $('#loading').hide();
        }, 500);
    }

    $('#search-button').click(function () {
        searchPrompts();
    });

    $('#copy-button').click(function () {
        copyPrompt();
    });

    $('#edit-button').click(function () {
        editPrompt();
    });

    $('#save-button').click(function () {
        savePrompt();
    });

    $('#delete-button').click(function () {
        deletePrompt();
    });

    $('#prev-page').click(function () {
        changePage('prev');
    });

    $('#next-page').click(function () {
        changePage('next');
    });

    $('#add-prompt-form').submit(function (event) {
        event.preventDefault();
        const newPromptTitle = $('#new-title').val();
        const newPromptText = $('#new-prompt').val();
        const newPromptID = (promptsData.length + 1).toString().padStart(4, '0');
        const newPrompt = {
            "Prompt ID": newPromptID,
            "title": newPromptTitle,
            "prompt": newPromptText
        };
        promptsData.push(newPrompt);
        $.ajax({
            url: '/prompts',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newPrompt),
            success: function () {
                displayPrompts();
                $('#new-title').val('');
                $('#new-prompt').val('');
                currentPage = Math.ceil(promptsData.length / itemsPerPage);
                displayPrompts();
            }
        });
    });

    // Chat-Funktionalität
    $('#chat-form').submit(function (event) {
        event.preventDefault();
        const message = $('#chat-input').val().toLowerCase();
        if (message.trim() !== '') {
            const matchedPrompts = promptsData.filter(prompt => 
                prompt['title'].toLowerCase().includes(message) || 
                prompt['prompt'].toLowerCase().includes(message)
            );
            $('#prompt-list').empty();
            matchedPrompts.forEach(prompt => {
                $('#prompt-list').append(`
                    <div class="prompt-item" data-id="${prompt['id']}">
                        <h3>${truncateText(prompt['title'], 30)}${prompt['title'].length > 30 ? '... <span class="show-more" data-id="' + prompt['id'] + '">mehr anzeigen</span>' : ''}</h3>
                    </div>
                `);
            });
            $('#chat-box').append(`<div class="chat-message"><span>You:</span> ${message}</div>`);
            $('#chat-input').val('');
        }
    });

    // Hinzufügen der neuen Toggle-Funktionalität
    $('#toggle-add-prompt').click(function() {
        $('#add-prompt').toggle();
    });

    fetchPrompts();
});
