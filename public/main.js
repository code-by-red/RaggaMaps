// ReggaeMap - Main JavaScript
// This file handles navigation, modal, and API data fetching

// Global variables
let eventsData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeModal();
    fetchEventData();
});

/**
 * Initialize navigation buttons
 */
function initializeNavigation() {
    const btnHome = document.getElementById('btn-home');
    const btnEvents = document.getElementById('btn-events');
    const btnSoundsystems = document.getElementById('btn-soundsystems');
    const btnAddRole = document.getElementById('btn-add-role');
    const btnAbout = document.getElementById('btn-about');
    const btnContact = document.getElementById('btn-contact');
    
    // Hide all sections initially
    hideAllSections();
    
    // Home button - show map and events
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            hideAllSections();
            const eventsList = document.getElementById('events-list');
            if (eventsList && eventsData.length > 0) {
                eventsList.classList.remove('hidden');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Events button - show events list
    if (btnEvents) {
        btnEvents.addEventListener('click', () => {
            hideAllSections();
            const eventsList = document.getElementById('events-list');
            if (eventsList && eventsData.length > 0) {
                eventsList.classList.remove('hidden');
                eventsList.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Nenhum evento disponível no momento.');
            }
        });
    }
    
    // Sound Systems button - show sound systems section
    if (btnSoundsystems) {
        btnSoundsystems.addEventListener('click', () => {
            hideAllSections();
            const section = document.getElementById('soundsystems-section');
            if (section) {
                section.classList.remove('hidden');
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add Role button - open modal
    if (btnAddRole) {
        btnAddRole.addEventListener('click', () => {
            openModal();
        });
    }
    
    // About button - show about section
    if (btnAbout) {
        btnAbout.addEventListener('click', () => {
            hideAllSections();
            const section = document.getElementById('about-section');
            if (section) {
                section.classList.remove('hidden');
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Contact button - show contact section
    if (btnContact) {
        btnContact.addEventListener('click', () => {
            hideAllSections();
            const section = document.getElementById('contact-section');
            if (section) {
                section.classList.remove('hidden');
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Hide all sections
 */
function hideAllSections() {
    const sections = ['about-section', 'soundsystems-section', 'contact-section', 'events-list'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('hidden');
        }
    });
}

/**
 * Initialize modal functionality
 */
function initializeModal() {
    const modal = document.getElementById('add-role-modal');
    const closeModal = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const form = document.getElementById('add-role-form');
    
    // Close modal functions
    const closeModalFunc = () => {
        modal.classList.add('hidden');
        form.reset();
    };
    
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModalFunc);
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModalFunc();
        }
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(form);
        });
    }
}

/**
 * Open modal
 */
function openModal() {
    const modal = document.getElementById('add-role-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(form) {
    const street = document.getElementById('role-street').value;
    const number = document.getElementById('role-number').value;
    const neighborhood = document.getElementById('role-neighborhood').value;
    const city = document.getElementById('role-city').value;
    const date = document.getElementById('role-date').value;
    const startTime = document.getElementById('role-start-time').value;
    const endTime = document.getElementById('role-end-time').value;
    
    // Construct full address
    const fullAddress = `${street}, ${number} - ${neighborhood}, ${city}`;
    
    const formData = {
        nome: document.getElementById('role-name').value,
        endereco: fullAddress,
        data: date,
        horario_inicio: startTime,
        horario_fim: endTime || '',
        status: document.getElementById('role-status').value,
        description: document.getElementById('role-description').value,
        link: document.getElementById('role-link').value
    };
    
    console.log('Form data:', formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    try {
        // Send data to Google Apps Script
        const response = await fetch(window.CONFIG.APP_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Since no-cors mode doesn't give us response details, we assume success
        // and reload the events to show the new one
        await fetchEventData();
        
        alert('Role adicionada com sucesso!');
        
        // Close modal and reset form
        const modal = document.getElementById('add-role-modal');
        modal.classList.add('hidden');
        form.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Erro ao adicionar role. Tente novamente.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Fetch event data from Google Apps Script
 */
async function fetchEventData() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    try {
        // Check if APP_SCRIPT_URL is configured
        if (!window.CONFIG || !window.CONFIG.APP_SCRIPT_URL) {
            loadingElement.classList.add('hidden');
            errorElement.classList.remove('hidden');
            errorElement.querySelector('p').textContent = 'Configure a URL do Apps Script para carregar os eventos.';
            return;
        }
        
        // Fetch data from Google Apps Script
        const response = await fetch(window.CONFIG.APP_SCRIPT_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter out old events (past dates)
        const filteredData = filterOldEvents(data);
        
        // Process and display the data
        if (filteredData && filteredData.length > 0) {
            eventsData = filteredData;
            displayEventsList(filteredData);
            loadingElement.classList.add('hidden');
        } else {
            loadingElement.classList.add('hidden');
            errorElement.classList.remove('hidden');
            errorElement.querySelector('p').textContent = 'Nenhum evento encontrado. Adicione eventos na planilha.';
        }
        
    } catch (error) {
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
        errorElement.querySelector('p').textContent = 'Erro ao carregar eventos. Tente novamente mais tarde.';
    }
}

/**
 * Filter out events that have already passed
 */
function filterOldEvents(events) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    return events.filter(event => {
        if (!event.data) return true; // Keep events without date
        
        const eventDate = new Date(event.data);
        eventDate.setHours(0, 0, 0, 0);
        
        // Keep event if it's today or in the future
        return eventDate >= today;
    });
}

/**
 * Display events in the list view
 */
function displayEventsList(events) {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';
    
    events.forEach(event => {
        // Support both old format and new format
        const name = event.nome || event.name;
        const location = event.endereco || event.location;
        const date = event.data || event.date;
        const startTime = event.horario_inicio || event.startTime;
        const endTime = event.horario_fim || event.endTime;
        
        // Format time for display
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);
        const timeDisplay = formattedStartTime ? (formattedEndTime ? `${formattedStartTime} - ${formattedEndTime}` : formattedStartTime) : '';
        
        // Create Google Maps link
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <h3>${name}</h3>
            <p class="event-location">📍 ${location}</p>
            ${date ? `<p class="event-date">📅 ${formatDate(date)}</p>` : ''}
            ${timeDisplay ? `<p class="event-time">🕐 ${timeDisplay}</p>` : ''}
            <p><strong>Status:</strong> ${event.status || 'N/A'}</p>
            ${event.description ? `<p>${event.description}</p>` : ''}
            <a href="${googleMapsUrl}" target="_blank" class="event-link">🗺️ Ver endereço no Google Maps</a>
            ${event.link ? `<a href="${event.link}" class="event-link" target="_blank">🔗 Mais informações</a>` : ''}
        `;
        
        eventsList.appendChild(card);
    });
    
    // Show the events list
    eventsList.classList.remove('hidden');
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'Data não informada';
    
    // Handle ISO format with timezone (YYYY-MM-DDTHH:mm:ss.sssZ)
    if (typeof dateString === 'string' && dateString.includes('T')) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            // Adjust for timezone offset to get local date
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    }
    
    // Handle ISO format (YYYY-MM-DD) and convert to DD/MM/YYYY
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
    }
    
    // Handle Excel date format (numbers)
    if (typeof dateString === 'number') {
        const date = new Date(Math.round((dateString - 25569) * 86400 * 1000));
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // If already in different format, try to parse
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    } catch (error) {
        // Return original if parsing fails
    }
    
    return dateString;
}

/**
 * Format time for display
 */
function formatTime(timeString) {
    if (!timeString) return '';
    
    // If already in HH:MM format, return as is
    if (typeof timeString === 'string' && timeString.includes(':') && !timeString.includes('T')) {
        return timeString;
    }
    
    // Handle Excel time format as ISO date string (1899-12-31T01:06:28.000Z)
    if (typeof timeString === 'string' && timeString.includes('T')) {
        const date = new Date(timeString);
        if (!isNaN(date.getTime())) {
            // Check if it's an Excel time format (date around 1899-12-30 or 1899-12-31)
            const year = date.getFullYear();
            if (year === 1899) {
                // Extract just the time part
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            }
            // If it's a regular date with time, extract time
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    }
    
    // Handle Excel time format (numbers)
    if (typeof timeString === 'number') {
        const totalSeconds = Math.round(timeString * 86400);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    return timeString;
}

/**
 * Show error message
 */
function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.querySelector('p').textContent = message;
    errorElement.classList.remove('hidden');
}
