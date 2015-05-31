      function openBookByTitle(title) {
        showCanvas(false);
        showStatus('Searching for ' + title + '...');
        beginSearch(title);
      }

      function beginSearch(query) {
        var script = document.createElement("script");
        script.src = 'https://www.googleapis.com/books/v1/volumes?q='
          + encodeURIComponent(query) + '&filter=partial'
          + '&callback=handleResults';
        script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(script);
      }

      function handleResults(root) {
        var entries = root.items || [];

        for (var i = 0; i < entries.length; ++i) {
          var entry = entries[i];
          var isEmbeddable = entry.accessInfo.embeddable;
          var identifier = entry.id;

          if (isEmbeddable) {
            loadBook(identifier);
            return;
          }
        }

        showStatus('Could not find a match');
      }

      function loadBook(identifier) {
        var callbackFn = function() { showBook(identifier); };
        google.load("books", "0", { "callback" : callbackFn });
      }

      function showBook(identifier) {
        var canvas = document.getElementById('viewerCanvas');
        viewer = new google.books.DefaultViewer(canvas);
        viewer.load(identifier);

        showCanvas(true);
        showStatus('');
      }

      function showCanvas(showing) {
        var canvasDiv = document.getElementById('viewerCanvas');
        canvasDiv.style.display =  (showing) ? 'block' : 'none';
      }

      function showStatus(string) {
        var statusDiv = document.getElementById('viewerStatus');
        var showing = !(string == null || string.length == 0);
        if (statusDiv.firstChild) {
          statusDiv.removeChild(statusDiv.firstChild);
        }
        statusDiv.appendChild(document.createTextNode((showing) ? string : ''));
        statusDiv.style.display =  (showing) ? 'block' : 'none';
      }