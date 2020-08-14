// Algolia API credentials to setup InstantSearch.js
const ALGOLIA_SEARCH = {
    appId: '1CRH65N6Z3',
    apiKey: '2dc60f0b4499265c60919b71eaec42d2',
    indexName: 'AntipastoTrial'
}

const initInstantSearch = () => {
    const searchClient = algoliasearch(ALGOLIA_SEARCH.appId, ALGOLIA_SEARCH.apiKey);
    const search = instantsearch({
        indexName: ALGOLIA_SEARCH.indexName,
        searchClient,
        searchFunction(helper) {
            const container = document.querySelector('#hits');
            container.style.display = helper.state.query === '' ? 'none' : '';

            helper.search();
        }
    });

    search.addWidgets([
        {
            init(opts) {
                const helper = opts.helper;
                const input = document.querySelector('#search-input');
                input.addEventListener('input', ({ currentTarget }) => {
                    helper.setQuery(currentTarget.value) // update the parameters
                        .search(); // launch the query
                });
            },
            render({ state }) {
                // Handle rendering widgets based on query and results
                $('#hits').show();

                if (!state.query || state.query.length < 1) {
                    $('#hits').hide();
                }
            }
        },
        instantsearch.widgets.configure({
            attributesToSnippet: ['html:30'],
        }),
        instantsearch.widgets.hits({
            container: '#hits',
            cssClasses: {
                root: 'gh-modal-body',
                list: 'gh-search-results',
                emptyRoot: 'gh-modal-body gh-no-search-results',
                item: 'gh-search-item'
            },
            templates: {
                empy: 'No results found',
                item(hit) {
                    return `
                    <article class="gh-search-result-card post ${hit.tags && hit.tags.map(tag => tag.slug).join(' tag-')}">
                        <a class="gh-search-item-link" href="${hit.url}">
                            <div class="gh-card-content">
                                <h3 class="gh-search-item-title">${instantsearch.highlight({ attribute: 'title', hit: hit })}</h3>
                                <p>${instantsearch.snippet({ attribute: 'html', hit })}</p>
                            </div>
                        </a>
                    </article>
                `},
            },
        })
    ]);

    search.start();
}

$(document).ready(function () {
    // Bootup instantSearch
    initInstantSearch();

    $('#search').click((e) => {
        $('body').addClass('gh-search-open');
        $('#search-input').val('');
        $('#search-input').focus();
    });

    $('#search-close').click(() => {
        $('#search-input').val('');
        $('body').removeClass('gh-search-open');
    });

    $(document).on('keyup', function (e) {
        if (e.keyCode == 27 && $('body').hasClass('gh-search-open')) {
            $('#search-input').val('');
            $('body').removeClass('gh-search-open');
        }
    });
});
