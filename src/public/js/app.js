document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.innerHTML = isDark 
      ? '<i class="fas fa-sun"></i> Light Mode' 
      : '<i class="fas fa-moon"></i> Dark Mode';
  });

  // Initialize type filter functionality
  function initializeTypeFilter() {
    const typeFilter = document.getElementById('typeFilter');
    const clearFilters = document.getElementById('clearFilters');

    function applyTypeFilter() {
      const typeValue = typeFilter.value;
      
      document.querySelectorAll('.object-card').forEach(card => {
        const cardType = card.dataset.type;
        card.style.display = (typeValue === '' || cardType === typeValue) ? 'block' : 'none';
      });
    }

    typeFilter.addEventListener('change', applyTypeFilter);
    
    clearFilters.addEventListener('click', () => {
      typeFilter.value = '';
      document.querySelectorAll('.object-card').forEach(card => {
        card.style.display = 'block';
      });
    });
  }

  // Initialize type filter
  initializeTypeFilter();

  // Object card click handler
  document.querySelectorAll('.object-card').forEach(card => {
    card.addEventListener('click', async function (event) {
      const sha = this.dataset.sha;
      const type = this.dataset.type;
  
      // Remove .selected from all cards
      document.querySelectorAll('.object-card').forEach(c => c.classList.remove('selected'));
  
      // Add .selected to the clicked card
      this.classList.add('selected');
  
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
  
      try {
        const response = await fetch(`/object/${sha}?type=${type}`);
        const objectDetails = await response.json();
        renderObjectDetails(objectDetails);
      } catch (error) {
        console.error('Error fetching object details:', error);
      }
    });
  });
  

  function renderObjectDetails(details) {
    const container = document.getElementById('object-details');
    container.innerHTML = `
      <div class="object-detail-view active">
        <div class="detail-section">
          <h2 class="detail-title">
            <i class="${getObjectIcon(details.type)}"></i>
            ${details.type.toUpperCase()} DETAILS
          </h2>
          <div class="detail-row">
            <span class="detail-label">SHA:</span>
            <span class="detail-value">${details.sha}</span>
          </div>
          ${details.path ? `
            <div class="detail-row">
              <span class="detail-label">Path:</span>
              <span class="detail-value">${details.path}</span>
            </div>
          ` : ''}
        </div>

        ${details.type === 'commit' ? renderCommitDetails(details) : ''}
        ${details.type === 'tree' ? renderTreeDetails(details) : ''}
        ${details.type === 'blob' ? renderBlobDetails(details) : ''}
      </div>
    `;
  }

  function renderCommitDetails(commit) {
    return `
      <div class="detail-section">
        <h3 class="detail-title">Commit Information</h3>
        <div class="detail-row">
          <span class="detail-label">Author:</span>
          <span class="detail-value">${commit.author || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">${commit.date || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Message:</span>
          <span class="detail-value">${commit.message || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Parents:</span>
          <span class="detail-value">
            ${commit.parents && commit.parents.length > 0 
              ? commit.parents.join(', ') 
              : 'None'}
          </span>
        </div>
      </div>
    `;
  }

  function renderTreeDetails(tree) {
    return `
      <div class="detail-section">
        <h3 class="detail-title">Tree Contents</h3>
        ${tree.items && tree.items.length > 0 ? `
          <div class="tree-items">
            ${tree.items.map(item => `
              <div class="tree-item">
                <i class="${getObjectIcon(item.type)}"></i>
                <span>${item.name}</span>
                <span class="item-sha">${item.sha.substring(0, 7)}</span>
              </div>
            `).join('')}
          </div>
        ` : '<p>No items in this tree</p>'}
      </div>
    `;
  }

  function renderBlobDetails(blob) {
    return `
      <div class="detail-section">
        <h3 class="detail-title">Blob Content</h3>
        <div class="detail-row">
          <span class="detail-label">Size:</span>
          <span class="detail-value">${blob.size || 0} bytes</span>
        </div>
        ${blob.content ? `
          <div class="detail-row">
            <span class="detail-label">Content:</span>
            <pre class="blob-content">${blob.content}</pre>
          </div>
        ` : '<p>No content available</p>'}
      </div>
    `;
  }

  function getObjectIcon(type) {
    const icons = {
      'commit': 'fas fa-code-commit',
      'tree': 'fas fa-folder-tree',
      'blob': 'fas fa-file-code'
    };
    return icons[type] || 'fas fa-question';
  }


  function handleCardClick() {
    const cards = document.querySelectorAll('.object-card');

 
  }
  document.addEventListener('DOMContentLoaded', handleCardClick);

});


