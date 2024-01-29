const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');

sidebar.style.display = 'block';

function toggleSidebar() {
    sidebar.style.display = (sidebar.style.display === 'none' || sidebar.style.display === '') ? 'block' : 'none';
    
    if (sidebar.style.display === 'none') {
        content.style.marginLeft = '0';
    } else {
        content.style.marginLeft = '250px'; // Adjust this value based on your sidebar width
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'F' || event.key === 'f') {
        toggleSidebar();
    }
});
