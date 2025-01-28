function convertMarkdownTablesInAkRenderer(akRenderer) {
    // Iterate over all <p> tags inside the container
    akRenderer.querySelectorAll('p').forEach(pTag => {
      const content = pTag.innerHTML;
  
      // Check if the content resembles a Markdown table
      if (content.includes('|') && content.includes('-')) {
        const lines = content.split('<br>').map(line =>
          line.trim().replace(/^\|/, '').replace(/\|$/, '').trim()
        ).filter(line => line);
  
        // Check if it's a valid Markdown table (with separator line)
        const hasSeparator = lines[1] && lines[1].split('|').every(cell => cell.trim().match(/^-+$/));
        if (lines.length >= 3 && hasSeparator) {
          // Extract headers and rows
          const headers = lines[0].split('|').map(cell => cell.trim());
          const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()));
  
          // Build HTML table
          const table = document.createElement('table');
          const thead = document.createElement('thead');
          const tbody = document.createElement('tbody');
  
          // Add headers
          const headerRow = document.createElement('tr');
          headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
  
          // Add rows
          rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
              const td = document.createElement('td');
              td.textContent = cell;
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
  
          table.appendChild(thead);
          table.appendChild(tbody);
  
          // Replace the <p> tag with the new table
          pTag.replaceWith(table);
          console.log('Markdown table replaced with HTML table:', table);
        }
      }
    });
  }
  
  // Function to observe DOM changes
  function observeAkRenderer() {
    // Target the parent container where .ak-renderer-document might appear
    const targetNode = document.body; // You can narrow this down if needed
  
    // Configuration for the observer (watch for child node additions and subtree changes)
    const config = { childList: true, subtree: true };
  
    // Callback function to execute when mutations are observed
    const callback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // Check if any added nodes contain .ak-renderer-document
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.matches('.ak-renderer-document')) {
              convertMarkdownTablesInAkRenderer(node);
            }
            if (node.nodeType === 1 && node.querySelector('.ak-renderer-document')) {
              convertMarkdownTablesInAkRenderer(node.querySelector('.ak-renderer-document'));
            }
          });
        }
      }
    };
  
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
  
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  
    console.log('MutationObserver started. Watching for .ak-renderer-document...');
  }
  
  // Start observing the DOM
  observeAkRenderer();