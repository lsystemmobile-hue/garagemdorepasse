/**
 * GARAGEM DOS REPASSES - ENGINE & INTERACTIVITY
 * High-Performance UX, Filters, Simulator & WhatsApp Conversion
 */

document.addEventListener("DOMContentLoaded", () => {
  // Constantes de Contato
  const WHATSAPP_PHONE = "5515996688987";
  const WHATSAPP_FORMATTED = "(15) 99668-8987";
  const refreshLucideIcons = () => {
    if (window.lucide) window.lucide.createIcons();
  };

  // O vídeo entra depois da primeira pintura; no mobile, o poster evita travamentos e economiza dados.
  const heroVideo = document.querySelector(".hero-bg-video");
  if (heroVideo) {
    const heroSource = heroVideo.querySelector("source[data-src]");
    const loadHeroVideo = () => {
      if (window.matchMedia("(max-width: 768px)").matches || !heroSource?.dataset.src) return;
      heroSource.src = heroSource.dataset.src;
      heroSource.removeAttribute("data-src");
      heroVideo.load();
      heroVideo.play().catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadHeroVideo, { timeout: 1800 });
    } else {
      window.setTimeout(loadHeroVideo, 1200);
    }
  }

  // Formatação Monetária Brasileira
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(value);
  };

  // Galeria horizontal: arraste no desktop ou deslize no celular para trocar as fotos.
  const setupGalleryCarousels = (root = document) => {
    root.querySelectorAll("[data-gallery-carousel]").forEach((carousel) => {
      if (carousel.dataset.carouselReady === "true") return;
      const track = carousel.querySelector(".vehicle-carousel-track");
      const slides = carousel.querySelectorAll(".vehicle-carousel-slide");
      const counter = carousel.querySelector(".vehicle-gallery-counter");
      const dots = carousel.querySelectorAll(".vehicle-gallery-dot");
      if (!track || slides.length < 2) return;

      carousel.dataset.carouselReady = "true";
      carousel.tabIndex = 0;
      let currentIndex = 0;
      let startX = 0;
      let deltaX = 0;
      let isDragging = false;

      const update = () => {
        track.classList.remove("is-dragging");
        track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
        if (counter) counter.textContent = `${currentIndex + 1} / ${slides.length}`;
        dots.forEach((dot, index) => {
          dot.classList.toggle("is-active", index === currentIndex);
          dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
        });
      };

      const moveTo = (index) => {
        currentIndex = Math.max(0, Math.min(index, slides.length - 1));
        update();
      };

      carousel.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        isDragging = true;
        startX = event.clientX;
        deltaX = 0;
        track.classList.add("is-dragging");
        carousel.setPointerCapture?.(event.pointerId);
      });

      carousel.addEventListener("pointermove", (event) => {
        if (!isDragging) return;
        deltaX = event.clientX - startX;
        track.style.transform = `translate3d(calc(-${currentIndex * 100}% + ${deltaX}px), 0, 0)`;
      });

      const finishDrag = (event) => {
        if (!isDragging) return;
        isDragging = false;
        carousel.releasePointerCapture?.(event.pointerId);
        if (Math.abs(deltaX) > 45) {
          moveTo(currentIndex + (deltaX < 0 ? 1 : -1));
        } else {
          update();
        }
        deltaX = 0;
      };

      carousel.addEventListener("pointerup", finishDrag);
      carousel.addEventListener("pointercancel", finishDrag);
      carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          moveTo(currentIndex + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          moveTo(currentIndex - 1);
        }
      });

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => moveTo(index));
      });
      update();
    });
  };

  /* --------------------------------------------------------------------------
     1. Renderização da Vitrine de Veículos
     -------------------------------------------------------------------------- */
  const vehiclesGrid = document.getElementById("vehiclesGrid");
  const filterPills = document.querySelectorAll(".filter-pill");
  const searchInput = document.getElementById("vehicleSearchInput");
  let activeCategory = "all";
  let searchQuery = "";

  const renderVehicles = () => {
    if (!vehiclesGrid) return;

    const filtered = VEHICLES_DATA.filter((car) => {
      const matchCategory = activeCategory === "all" || car.category === activeCategory;
      const matchSearch = car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.year.includes(searchQuery);
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      vehiclesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <p style="font-size: 1.2rem; color: #ffffff; margin-bottom: 12px;">Nenhum veículo encontrado com esses critérios.</p>
          <p style="color: var(--color-titanium-500); margin-bottom: 24px;">Novos repasses chegam semanalmente. Fale conosco no WhatsApp para consultar oportunidades que ainda não entraram no site.</p>
          <a href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Olá! Gostaria de consultar se há novos veículos de repasse disponíveis além dos listados no site.")}" target="_blank" class="btn-island btn-whatsapp">
            <span>Consultar Repasses no WhatsApp</span>
            <span class="btn-icon-wrapper">
            <i data-lucide="arrow-right" width="18" height="18" stroke-width="2.5" aria-hidden="true"></i>
            </span>
          </a>
        </div>
      `;
      return;
    }

    vehiclesGrid.innerHTML = filtered.map((car) => {
      const waMessage = encodeURIComponent(
        `Olá! Vi o ${car.title} (${car.year}) anunciado por ${formatCurrency(car.repassePrice)} no site da Garagem dos Repasses e tenho interesse. Gostaria de mais fotos e informações!`
      );

      return `
        <article class="bezel-shell ${car.statusType === 'gold' ? 'gold-glow' : ''} vehicle-card">
          <div class="bezel-core">
            <div class="vehicle-thumb-box vehicle-card-carousel" data-gallery-carousel>
              <div class="vehicle-carousel-track">
                ${(car.gallery || [car.image]).map((photo, index) => `
                  <div class="vehicle-carousel-slide">
                    <img src="${photo}" alt="${car.title} — foto ${index + 1}" class="vehicle-thumb" loading="lazy" decoding="async" draggable="false" />
                  </div>
                `).join('')}
              </div>
              <div class="vehicle-status-badge">
                <span class="tag-badge ${car.statusType}">${car.statusBadge}</span>
              </div>
              <span class="vehicle-category-badge">${car.category}</span>
              ${(car.gallery && car.gallery.length > 1) ? `
                <div class="vehicle-gallery-navigation" aria-hidden="true">
                  <span class="vehicle-gallery-counter">1 / ${car.gallery.length}</span>
                  <span class="vehicle-gallery-dots">
                    ${car.gallery.map((_, index) => `<span class="vehicle-gallery-dot ${index === 0 ? 'is-active' : ''}"></span>`).join('')}
                  </span>
                </div>
              ` : ''}
            </div>

            <div class="vehicle-card-body">
              <h3 class="vehicle-title">${car.title}</h3>
              
              <div class="specs-pills-row">
                <span class="spec-pill">
                  <i data-lucide="calendar-days" width="13" height="13" aria-hidden="true"></i>
                  ${car.year}
                </span>
                <span class="spec-pill">
                  <i data-lucide="gauge" width="13" height="13" aria-hidden="true"></i>
                  ${car.km}
                </span>
                <span class="spec-pill">
                  <i data-lucide="zap" width="13" height="13" aria-hidden="true"></i>
                  ${car.transmission}
                </span>
              </div>

              <div class="pricing-matrix">
                <span class="pricing-eyebrow">Preço de repasse</span>
                <div class="pricing-main-row">
                  <span class="repasse-price">${formatCurrency(car.repassePrice)}</span>
                </div>
                <div class="pricing-meta-row">
                  ${car.fipePrice ? `
                    <div class="fipe-comparison">
                      <span class="fipe-label">FIPE</span>
                      <span class="fipe-val">${formatCurrency(car.fipePrice)}</span>
                    </div>
                  ` : '<span class="pricing-note">Valor informado pela loja</span>'}
                  ${car.savings ? `
                    <div class="savings-pill">
                      <i data-lucide="trending-down" width="14" height="14" stroke-width="2.5" aria-hidden="true"></i>
                      Economiza ${formatCurrency(car.savings)}
                    </div>
                  ` : ''}
                </div>
              </div>

              <div class="vehicle-actions-row">
                <a href="https://wa.me/${WHATSAPP_PHONE}?text=${waMessage}" target="_blank" class="btn-island btn-primary" style="padding: 6px 8px 6px 16px; font-size: 0.88rem;">
                  <span>Quero este veículo</span>
                  <span class="btn-icon-wrapper" style="width: 32px; height: 32px;">
                    <i data-lucide="arrow-right" width="14" height="14" stroke-width="2.5" aria-hidden="true"></i>
                  </span>
                </a>
                <button type="button" class="btn-island btn-secondary open-modal-btn" data-car-id="${car.id}" style="padding: 6px 12px; font-size: 0.85rem;" title="Ver detalhes completos">
                  <span>Detalhes</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Adiciona event listeners nos botões de detalhes
    document.querySelectorAll(".open-modal-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const carId = e.currentTarget.getAttribute("data-car-id");
        openVehicleModal(carId);
      });
    });

    setupGalleryCarousels(vehiclesGrid);
    refreshLucideIcons();
  };

  // Filtragem por Pills
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.getAttribute("data-category");
      renderVehicles();
    });
  });

  // Busca em tempo real
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderVehicles();
    });
  }

  /* --------------------------------------------------------------------------
     2. Modal de Detalhes do Veículo
     -------------------------------------------------------------------------- */
  const modalBackdrop = document.getElementById("vehicleModalBackdrop");
  const modalContent = document.getElementById("vehicleModalContent");
  const modalClose = document.getElementById("vehicleModalClose");

  const openVehicleModal = (carId) => {
    const car = VEHICLES_DATA.find((c) => c.id === carId);
    if (!car || !modalContent) return;

    const gallery = Array.isArray(car.gallery) && car.gallery.length > 0 ? car.gallery : [car.image];

    const waMessage = encodeURIComponent(
      `Olá! Estive vendo os detalhes do *${car.title}* (${car.year}) por ${formatCurrency(car.repassePrice)} no site da Garagem dos Repasses e quero saber as condições de pagamento e agendar visita.`
    );

    modalContent.innerHTML = `
      <div style="background: var(--bg-card); border-radius: var(--radius-lg); overflow: hidden; border: 1px solid rgba(255,255,255,0.12);">
        <div class="vehicle-gallery vehicle-modal-carousel" data-gallery-carousel>
          <div class="vehicle-carousel-track">
            ${gallery.map((photo, index) => `
              <div class="vehicle-carousel-slide">
                <img src="${photo}" alt="${car.title} — foto ${index + 1}" loading="lazy" decoding="async" draggable="false" />
              </div>
            `).join('')}
          </div>
          ${gallery.length > 1 ? `<div class="vehicle-gallery-navigation" aria-hidden="true"><span class="vehicle-gallery-counter">1 / ${gallery.length}</span><span class="vehicle-gallery-dots">${gallery.map((_, index) => `<span class="vehicle-gallery-dot ${index === 0 ? 'is-active' : ''}"></span>`).join('')}</span></div>` : ''}
          <span style="position: absolute; top: 16px; left: 16px;" class="tag-badge ${car.statusType}">${car.statusBadge}</span>
        </div>

        <div style="padding: 28px;">
          <h2 style="font-size: 1.8rem; margin-bottom: 8px;">${car.title}</h2>
          <p style="font-size: 0.95rem; color: var(--color-titanium-400); margin-bottom: 20px; line-height: 1.6;">${car.description}</p>

          <div class="vehicle-detail-facts">
            <span><i data-lucide="palette" width="15" height="15" aria-hidden="true"></i>${car.color}</span>
            <span><i data-lucide="fuel" width="15" height="15" aria-hidden="true"></i>${car.fuel}</span>
            <span><i data-lucide="gauge" width="15" height="15" aria-hidden="true"></i>${car.km}</span>
          </div>

          <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-titanium-400); margin-bottom: 12px;">Destaques & Equipamentos:</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-bottom: 28px;">
            ${car.features.map(f => `
              <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #ffffff; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <i data-lucide="check" width="14" height="14" stroke="#25D366" stroke-width="3" aria-hidden="true"></i>
                <span>${f}</span>
              </div>
            `).join("")}
          </div>

          <div style="background: rgba(6,7,9,0.7); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              ${car.fipePrice ? `<span style="font-size: 0.8rem; color: var(--color-titanium-500); text-decoration: line-through; display: block;">FIPE: ${formatCurrency(car.fipePrice)}</span>` : '<span style="font-size: 0.8rem; color: var(--color-titanium-500); display: block;">Valor informado pela loja</span>'}
              <span style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: #ffffff;">${formatCurrency(car.repassePrice)}</span>
            </div>
            ${car.savings ? `<div class="savings-pill" style="font-size: 0.88rem; padding: 6px 14px;">Você economiza ${formatCurrency(car.savings)}</div>` : ''}
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap;">
            <button type="button" class="btn-island btn-secondary" onclick="document.getElementById('vehicleModalBackdrop').classList.remove('active')" style="padding: 10px 20px;">
              <span>Fechar</span>
            </button>
            <a href="https://wa.me/${WHATSAPP_PHONE}?text=${waMessage}" target="_blank" class="btn-island btn-whatsapp">
              <span>Negociar no WhatsApp</span>
              <span class="btn-icon-wrapper">
              <i data-lucide="arrow-right" width="18" height="18" stroke-width="2.5" aria-hidden="true"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    `;

    setupGalleryCarousels(modalContent);
    refreshLucideIcons();
    modalBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  if (modalClose && modalBackdrop) {
    modalClose.addEventListener("click", () => {
      modalBackdrop.classList.remove("active");
      document.body.style.overflow = "";
    });

    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Simulador Expresso de Avaliação ("Venda Seu Carro Rápido")
     -------------------------------------------------------------------------- */
  document.querySelectorAll("[data-custom-select]").forEach((customSelect) => {
    const nativeSelect = customSelect.parentElement.querySelector(".form-select-native");
    const trigger = customSelect.querySelector(".custom-select-trigger");
    const valueLabel = customSelect.querySelector(".custom-select-value");
    const options = Array.from(customSelect.querySelectorAll(".custom-select-option"));
    let activeIndex = Math.max(0, options.findIndex((option) => option.classList.contains("is-selected")));

    if (!nativeSelect || !trigger || !valueLabel || options.length === 0) return;

    options.forEach((option, index) => {
      option.tabIndex = -1;
      option.id = `${trigger.id}-option-${index}`;
    });

    const setActiveOption = (index) => {
      activeIndex = (index + options.length) % options.length;
      options.forEach((option, optionIndex) => {
        option.classList.toggle("is-active", optionIndex === activeIndex);
      });
      trigger.setAttribute("aria-activedescendant", options[activeIndex].id);
    };

    const setOpen = (isOpen) => {
      customSelect.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));

      if (isOpen) {
        const selectedIndex = options.findIndex((option) => option.classList.contains("is-selected"));
        setActiveOption(selectedIndex >= 0 ? selectedIndex : 0);
      } else {
        options.forEach((option) => option.classList.remove("is-active"));
        trigger.removeAttribute("aria-activedescendant");
      }
    };

    const selectOption = (index) => {
      const selectedOption = options[index];
      const selectedValue = selectedOption.dataset.value;

      nativeSelect.value = selectedValue;
      valueLabel.textContent = selectedOption.querySelector("span").textContent;
      options.forEach((option, optionIndex) => {
        const isSelected = optionIndex === index;
        option.classList.toggle("is-selected", isSelected);
        option.setAttribute("aria-selected", String(isSelected));
      });
      nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
      setOpen(false);
      trigger.focus();
    };

    trigger.addEventListener("click", () => {
      setOpen(!customSelect.classList.contains("is-open"));
    });

    trigger.addEventListener("keydown", (event) => {
      const isOpen = customSelect.classList.contains("is-open");

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!isOpen) setOpen(true);
        setActiveOption(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        if (!isOpen) setOpen(true);
        setActiveOption(event.key === "Home" ? 0 : options.length - 1);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (isOpen) {
          selectOption(activeIndex);
        } else {
          setOpen(true);
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === "Tab") {
        setOpen(false);
      }
    });

    options.forEach((option, index) => {
      option.addEventListener("mouseenter", () => setActiveOption(index));
      option.addEventListener("click", () => selectOption(index));
    });

    document.addEventListener("click", (event) => {
      if (!customSelect.contains(event.target)) setOpen(false);
    });
  });

  const simulatorForm = document.getElementById("simulatorForm");
  if (simulatorForm) {
    simulatorForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const brand = document.getElementById("simBrand").value;
      const model = document.getElementById("simModel").value;
      const year = document.getElementById("simYear").value;
      const km = document.getElementById("simKm").value;
      const transmission = document.getElementById("simTransmission").value;
      const notes = document.getElementById("simNotes").value;

      const proposalText = 
`*SOLICITAÇÃO DE AVALIAÇÃO - GARAGEM DOS REPASSES*

• *Veículo:* ${brand} ${model}
• *Ano:* ${year}
• *Câmbio:* ${transmission}
• *Quilometragem:* ${km} km
• *Observações:* ${notes || "Não informado"}

Gostaria de receber uma proposta de avaliação para repasse com pagamento à vista.`;

      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(proposalText)}`;
      window.open(waUrl, "_blank");
    });
  }

  /* --------------------------------------------------------------------------
     4. Renderização de Depoimentos do Google 5.0
     -------------------------------------------------------------------------- */
  const reviewsGrid = document.getElementById("reviewsGrid");
  if (reviewsGrid) {
    reviewsGrid.innerHTML = REVIEWS_DATA.map((rev) => `
      <div class="bezel-shell bezel-subtle">
        <div class="bezel-core review-card">
          <div>
            <div class="stars-row">
              ${Array(rev.rating).fill(`
                <i data-lucide="star" width="18" height="18" fill="currentColor" aria-hidden="true"></i>
              `).join("")}
            </div>
            <p class="review-text">"${rev.text}"</p>
          </div>

          <div class="reviewer-meta">
            <div class="reviewer-avatar">
              ${rev.author.charAt(0)}
            </div>
            <div>
              <div class="reviewer-name">${rev.author}</div>
              <div class="review-verified-tag">
                <i data-lucide="check" width="12" height="12" stroke-width="2.5" aria-hidden="true"></i>
                ${rev.date}
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join("");
    refreshLucideIcons();
  }

  /* --------------------------------------------------------------------------
     5. Header Scroll Dynamics & Mobile Drawer
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById("mainNavbar");
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  let navbarScrollFrame = 0;
  window.addEventListener("scroll", () => {
    if (navbarScrollFrame || !navbar) return;
    navbarScrollFrame = window.requestAnimationFrame(() => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
      navbarScrollFrame = 0;
    });
  }, { passive: true });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      mobileToggle.classList.toggle("active", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Copiar Endereço
     -------------------------------------------------------------------------- */
  const copyAddressBtn = document.getElementById("copyAddressBtn");
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener("click", () => {
      const address = "Av. Corradi Segundo, 710 - Cerquilho, SP, 18520-027";
      navigator.clipboard.writeText(address).then(() => {
        const originalText = copyAddressBtn.querySelector("span").textContent;
        copyAddressBtn.querySelector("span").textContent = "Endereço Copiado!";
        setTimeout(() => {
          copyAddressBtn.querySelector("span").textContent = originalText;
        }, 2500);
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. Visibilidade do Botão Flutuante do WhatsApp (Oculto no Hero)
     -------------------------------------------------------------------------- */
  const floatingWhatsapp = document.querySelector(".floating-whatsapp");
  const heroSection = document.getElementById("inicio");

  if (floatingWhatsapp && heroSection && "IntersectionObserver" in window) {
    const whatsappObserver = new IntersectionObserver(([entry]) => {
      floatingWhatsapp.classList.toggle("visible", !entry.isIntersecting);
    }, { threshold: 0, rootMargin: "-120px 0px 0px 0px" });
    whatsappObserver.observe(heroSection);
  } else if (floatingWhatsapp && heroSection) {
    const checkWhatsappVisibility = () => {
      floatingWhatsapp.classList.toggle("visible", heroSection.getBoundingClientRect().bottom <= 120);
    };
    window.addEventListener("scroll", checkWhatsappVisibility, { passive: true });
    checkWhatsappVisibility();
  }

  // Ordem de conversão: estoque → diferenciais → avaliações → avaliação de venda → localização.
  const simulatorSection = document.getElementById("vender-carro");
  const reviewsSection = document.getElementById("avaliacoes");
  const locationSection = document.getElementById("localizacao");
  if (simulatorSection && reviewsSection && locationSection) {
    reviewsSection.after(simulatorSection);
  }

  // Inicialização
  renderVehicles();
  refreshLucideIcons();
});
