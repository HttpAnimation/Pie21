document.addEventListener('keydown', (event) => {
    if (event.key === 'F' || event.key === 'f') {
        const sidebar = document.getElementById('sidebar');
        sidebar.style.display = (sidebar.style.display === 'none' || sidebar.style.display === '') ? 'block' : 'none';
    }
});