// Remove donate button functionality
function removeDonateElements() {
    // Remove all elements with donate-related IDs or classes
    const donateElements = document.querySelectorAll('[id*="donate"], [class*="donate"], img[src*="donate"], a[href*="donate"]');
    donateElements.forEach(element => {
        element.remove();
    });

    // Also remove the donate button from the game interface
    const gameInterface = document.querySelectorAll('.interface-button, button, a');
    gameInterface.forEach(element => {
        if (element.textContent && element.textContent.toLowerCase().includes('donate')) {
            element.remove();
        }
    });
}

// Run immediately
removeDonateElements();

// Run when DOM content is loaded
document.addEventListener('DOMContentLoaded', removeDonateElements);

// Run periodically to catch dynamically added elements
setInterval(removeDonateElements, 1000);

// Run after clicking any buttons (to catch new UI elements)
document.addEventListener('click', function() {
    setTimeout(removeDonateElements, 100);
});
