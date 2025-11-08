/**
 * Perfume Finder - Frontend Logic
 * Maneja el quiz, chat, y comunicación con Vercel API
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const API_CONFIG = {
  // Vercel API Base URL
  baseUrl: 'https://perfumes-puq.vercel.app/api',
  endpoints: {
    startConversation: '/perfume-finder/start',
    sendMessage: '/perfume-finder/message',
    getRecommendations: '/perfume-finder/recommendations'
  }
};

// ============================================
// ESTADO GLOBAL
// ============================================

let currentConversationId = null;
let isProcessing = false;

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtiene el customer access token de Shopify
 * @returns {string|null} Token o null si no está logueado
 */
function getCustomerToken() {
  // Shopify Customer Account API token se puede obtener de varias formas:
  // 1. Desde una cookie si usas Shopify's Customer Account API
  // 2. Desde localStorage si implementaste login custom
  // 3. Desde un meta tag inyectado por Liquid

  // Opción 1: Desde meta tag (más seguro)
  const tokenMeta = document.querySelector('meta[name="customer-token"]');
  if (tokenMeta) {
    return tokenMeta.content;
  }

  // Opción 2: Verificar si el usuario está logueado mediante Shopify
  // (Necesitarás inyectar esto desde Liquid en theme.liquid o en la página)
  return window.customerAccessToken || null;
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean}
 */
function isAuthenticated() {
  return getCustomerToken() !== null;
}

/**
 * Muestra mensaje de error de autenticación
 */
function showAuthError() {
  const authError = document.getElementById('auth-error');
  if (authError) {
    authError.style.display = 'block';
  }
}

/**
 * Hace una petición a la API de Vercel
 * @param {string} endpoint
 * @param {object} data
 * @returns {Promise<object>}
 */
async function apiRequest(endpoint, data = {}) {
  const token = getCustomerToken();

  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Error de conexión con el servidor'
    }));

    // Manejar diferentes códigos de error
    if (response.status === 429) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    throw new Error(error.message || 'API Error');
  }

  return response.json();
}

/**
 * Agrega un mensaje al chat
 * @param {string} content
 * @param {string} type - 'user', 'ai', 'error'
 */
function addChatMessage(content, type = 'ai') {
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `perfume-chat__message perfume-chat__message--${type}`;
  messageDiv.textContent = content;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Muestra productos recomendados
 * @param {Array} products
 */
function displayRecommendations(products) {
  const recommendationsSection = document.getElementById('chat-recommendations');
  const recommendationsList = document.getElementById('recommendations-list');

  if (!recommendationsSection || !recommendationsList) return;

  recommendationsList.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'perfume-chat__product-card';

    // Construir el HTML del precio
    let priceHtml = `<span class="perfume-chat__product-price">${product.price}</span>`;
    if (product.compareAtPrice) {
      priceHtml += `<span class="perfume-chat__product-price--compare">${product.compareAtPrice}</span>`;
    }

    card.innerHTML = `
      <div class="perfume-chat__product-image-wrapper">
        <img
          src="${product.image || 'https://via.placeholder.com/120'}"
          alt="${product.title}"
          class="perfume-chat__product-image"
          loading="lazy"
        >
      </div>
      <div class="perfume-chat__product-info">
        <h4 class="perfume-chat__product-title">${product.title}</h4>
        <p class="perfume-chat__product-reason">${product.reason || ''}</p>
        <div class="perfume-chat__product-footer">
          <div class="perfume-chat__product-price-wrapper">
            ${priceHtml}
          </div>
          <a
            href="${product.url}"
            class="perfume-chat__product-button button button--secondary"
          >
            Ver producto
          </a>
        </div>
      </div>
    `;
    recommendationsList.appendChild(card);
  });

  recommendationsSection.classList.add('perfume-chat__recommendations--visible');

  // Scroll suave a las recomendaciones
  setTimeout(() => {
    recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

/**
 * Muestra/oculta el loading
 * @param {boolean} show
 */
function toggleLoading(show) {
  const loading = document.getElementById('chat-loading');
  if (!loading) return;

  if (show) {
    loading.classList.add('perfume-chat__loading--active');
  } else {
    loading.classList.remove('perfume-chat__loading--active');
  }
}

/**
 * Habilita/deshabilita el input de chat
 * @param {boolean} enable
 */
function toggleChatInput(enable) {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  if (input) input.disabled = !enable;
  if (sendBtn) sendBtn.disabled = !enable;
}

/**
 * Muestra un error en formato amigable
 * @param {Error} error
 */
function handleError(error) {
  console.error('Perfume Finder Error:', error);

  if (error.message === 'NOT_AUTHENTICATED') {
    showAuthError();
    return;
  }

  if (error.message === 'RATE_LIMIT_EXCEEDED') {
    addChatMessage(
      'Has alcanzado el límite de conversaciones diarias. Por favor intenta mañana.',
      'error'
    );
    return;
  }

  addChatMessage(
    'Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.',
    'error'
  );
}

// ============================================
// MANEJADORES DE EVENTOS
// ============================================

/**
 * Maneja el envío del formulario inicial
 */
async function handleQuizSubmit(event) {
  event.preventDefault();

  // Verificar autenticación
  if (!isAuthenticated()) {
    showAuthError();
    return;
  }

  if (isProcessing) return;
  isProcessing = true;

  try {
    // Recopilar datos del formulario
    const formData = {
      gender: document.getElementById('gender').value,
      occasion: document.getElementById('occasion').value,
      family: document.getElementById('family').value,
      intensity: document.getElementById('intensity').value
    };

    // Validar que todos los campos estén completos
    if (!formData.gender || !formData.occasion || !formData.family || !formData.intensity) {
      alert('Por favor completa todos los campos');
      isProcessing = false;
      return;
    }

    // Iniciar conversación con la API
    toggleLoading(true);
    const response = await apiRequest(API_CONFIG.endpoints.startConversation, formData);

    currentConversationId = response.conversationId;

    // Ocultar quiz y mostrar chat
    const quizSection = document.getElementById('perfume-quiz');
    const chatSection = document.getElementById('perfume-chat');

    if (quizSection) quizSection.classList.add('perfume-quiz--hidden');
    if (chatSection) chatSection.classList.add('perfume-chat--active');

    // Mostrar mensaje inicial de la IA
    if (response.message) {
      addChatMessage(response.message, 'ai');
    }

    // Si ya hay recomendaciones, mostrarlas
    if (response.recommendations && response.recommendations.length > 0) {
      displayRecommendations(response.recommendations);
    }

    // Habilitar el chat
    toggleChatInput(true);
    toggleLoading(false);

    // Focus en el input de chat
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      setTimeout(() => chatInput.focus(), 300);
    }

  } catch (error) {
    handleError(error);
    toggleLoading(false);
  } finally {
    isProcessing = false;
  }
}

/**
 * Maneja el envío de mensajes en el chat
 */
async function handleChatSend() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  const message = input.value.trim();

  if (!message || isProcessing || !currentConversationId) return;

  isProcessing = true;
  toggleChatInput(false);

  try {
    // Mostrar mensaje del usuario
    addChatMessage(message, 'user');
    input.value = '';

    // Enviar a la API
    toggleLoading(true);
    const response = await apiRequest(API_CONFIG.endpoints.sendMessage, {
      conversationId: currentConversationId,
      message: message
    });

    // Mostrar respuesta de la IA
    if (response.message) {
      addChatMessage(response.message, 'ai');
    }

    // Actualizar recomendaciones si hay nuevas
    if (response.recommendations && response.recommendations.length > 0) {
      displayRecommendations(response.recommendations);
    }

    toggleLoading(false);
    toggleChatInput(true);

    // Focus en el input
    setTimeout(() => input.focus(), 100);

  } catch (error) {
    handleError(error);
    toggleLoading(false);
    toggleChatInput(true);
  } finally {
    isProcessing = false;
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Manejador del formulario quiz
  const quizForm = document.getElementById('perfume-quiz-form');
  if (quizForm) {
    quizForm.addEventListener('submit', handleQuizSubmit);
  }

  // Manejador del botón de envío en chat
  const sendBtn = document.getElementById('chat-send');
  if (sendBtn) {
    sendBtn.addEventListener('click', handleChatSend);
  }

  // Manejador de Enter en el input de chat
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatSend();
      }
    });
  }

  // Debug: Log de configuración
  if (window.location.search.includes('debug=true')) {
    console.log('Perfume Finder Config:', {
      apiBaseUrl: API_CONFIG.baseUrl,
      isAuthenticated: isAuthenticated(),
      customerToken: getCustomerToken() ? 'Present' : 'Missing'
    });
  }
});

// ============================================
// EXPORT PARA TESTING (si aplica)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCustomerToken,
    isAuthenticated,
    apiRequest,
    handleQuizSubmit,
    handleChatSend
  };
}
