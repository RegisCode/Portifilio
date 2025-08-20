// Efeito de digitação na primeira seção
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["", "", "", ""];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

// Efeito de digitação "Hello World"
function typingEffect() {
    const typedtext = document.querySelector(".typedtext");
    
    // Verifica se o elemento existe antes de manipular
    if (!typedtext) return;
    
    const contactTexts = ['"Hello world"'];
    let removing = false;
    let idx = 0;
    let char = 0;

    const typeInterval = setInterval(() => {
        if (char < contactTexts[idx].length) {
            typedtext.innerHTML += contactTexts[idx][char];
        }
        if (char === contactTexts[idx].length + 15) removing = true;
        if (removing) {
            typedtext.innerHTML = typedtext.innerHTML.substring(0, typedtext.innerHTML.length - 1);
        }
        char++;
        
        if (typedtext.innerHTML.length === 0) {
            if (idx === contactTexts.length - 1) idx = 0;
            else idx++;
            char = 0;
            removing = false;
        }
    }, 150);
}

// Configuração das partículas
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" }
        }
    }
});

// API de previsão do tempo
$(function(){
    $(".btn-cep").click(function(e){
        e.preventDefault();
        let cep = $(".cep-input").val();
        requisicaoCep(cep);
    });
});

function requisicaoCep(cep) {
    let url = 'https://viacep.com.br/ws/' + cep + '/json';
    $.get(url, function(data) {
        if(data.hasOwnProperty("erro")) {
            alert("CEP não encontrado!");
        } else {
            let cidade = data.localidade;
            let uf = data.uf;
            $(".localidade").fadeIn(600);
            $(".localidade-cidade").text(cidade);
            $(".localidade-uf").text(uf);
            requisicaoIdClimaTempo(cidade, uf);
        }
    }).fail(function(){
        alert("Erro na consulta do CEP!");
    });
}

function requisicaoIdClimaTempo(cidade, uf) {
    let url = "https://apiadvisor.climatempo.com.br/api/v1/locale/city?name="+cidade+"&state="+uf+"&token=c1cdba8979fd4fb41bf76d03b1d04eb9";
    $.get(url, function(data){
        let idCidade = data[0].id;
        previsaoDoTempo(idCidade);
        previsaoDaSemana(idCidade);
    }).fail(function(){
        alert("Erro ao buscar cidade!");
    });
}

function previsaoDoTempo(id) {
    let urlHoje = "https://apiadvisor.climatempo.com.br/api/v1/weather/locale/"+id+"/current?token=c1cdba8979fd4fb41bf76d03b1d04eb9";
    $.get(urlHoje, atualizarCardTempo);    
}

function atualizarCardTempo(data) {
    $(".card-hoje").text(capturarDataHoje().split("").slice(0,5).join(""))
    $(".tmp-temperatura-tmp").text(data.data.temperature + "º");
    $(".tmp-condicao").text(data.data.condition);
    $(".tmp-caract-umidade-valor").text(data.data.humidity+" %");
    $(".tmp-caract-sensacao-valor").text(data.data.sensation+" º");
    $(".tmp-caract-vento-valor").text(data.data.wind_velocity+" km/h");
    $(".card-tempo").fadeIn(200);
}

function previsaoDaSemana(id) {
    let url = "https://apiadvisor.climatempo.com.br/api/v1/forecast/locale/"+id+"/days/15?token=c1cdba8979fd4fb41bf76d03b1d04eb9";
    $.get(url, atualizarCardTempoSemana);
}

function atualizarCardTempoSemana(data) {
    let arrDatas = data.data;
    let arrDatasPrevisao = arrDatas.slice(1,6);
    let counter = 1;
    
    $(arrDatasPrevisao).each(function(data){
        let cardDia = ".semana-dia-"+counter;
        $(cardDia).fadeIn(200);

        let dia = arrDatasPrevisao[data].date_br.slice(0,5);
        $(cardDia + " .tmp-semana-dia-data").text(dia);

        let min = arrDatasPrevisao[data].temperature.min;
        $(cardDia + " .tmp-semana-tmp-min-val").text(min);

        let max = arrDatasPrevisao[data].temperature.max;
        $(cardDia + " .tmp-semana-tmp-max-val").text(max);

        counter++;
    });
}

function capturarDataHoje() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if(month < 10) month = "0"+month;
    return day + "/" + month + "/" + date.getFullYear();
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function() {

    // Iniciar efeitos
    if(textArray.length) setTimeout(type, newTextDelay + 250);
    typingEffect();
    
    // Botão Saiba Mais
    const saibaMaisButton = document.getElementById("saibaMaisButton");
    if (saibaMaisButton) {
        saibaMaisButton.addEventListener("click", function() {
            document.getElementById("About").scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Botão LinkedIn
    const btnLinkedin = document.getElementById("btn-linkedin");
    if (btnLinkedin) {
        btnLinkedin.addEventListener("click", function() {
            window.open("https://www.linkedin.com/in/gabriel-carvalho-77b191147/", "_blank");
        });
    }
    
    // Botão Enviar
    const enviarBtn = document.getElementById("enviarBtn");
    if (enviarBtn) {
        enviarBtn.addEventListener("click", function() {
            alert("Obrigado por entrar em contato!");
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("comments").value = "";
        });
    }
    
    // Menu mobile
    const navicon = document.getElementById("navicon");
    if (navicon) {
        navicon.addEventListener("click", function() {
            document.querySelector("nav").classList.toggle("active");
        });
    }

    // Mudar de btn-cep para searchWeather
    if (searchWeatherBtn && weatherSearch) {
        searchWeatherBtn.addEventListener("click", function() {
            const city = weatherSearch.value.trim();
            if (city) {
                fetchWeatherData(city);
            } else {
                alert("Por favor, digite o nome de uma cidade.");
            }
        });
        
        weatherSearch.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                const city = weatherSearch.value.trim();
                if (city) {
                    fetchWeatherData(city);
                } else {
                    alert("Por favor, digite o nome de uma cidade.");
                }
            }
        });
    } else {
        console.log("Elementos de busca do tempo não encontrados");
    }

    function fetchWeatherData(city) {

        console.log("Buscando dados para:", city);
        
        // Seletores ATUALIZADOS para o novo HTML
        const elements = {
            location: document.querySelector(".location-name"),
            date: document.querySelector(".current-date"),
            condition: document.querySelector(".condition-text"),
            temp: document.querySelector(".temp-value"),
            humidity: document.querySelectorAll(".detail-value")[0],
            wind: document.querySelectorAll(".detail-value")[1],
            rain: document.querySelectorAll(".detail-value")[2]
        };

        // Verifica se todos os elementos existem
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Elemento não encontrado: ${key}`);
                return;
            }
        }

        // Simulação de dados (substitua pela API real)
        const weatherData = {
            location: `${city}, SP`,
            date: new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            }),
            condition: "Nublado",
            temperature: "22",
            humidity: "75%",
            wind: "8 km/h",
            rain: "10%"
        };

        // Atualiza os elementos
        elements.location.textContent = weatherData.location;
        elements.date.textContent = weatherData.date;
        elements.condition.textContent = weatherData.condition;
        elements.temp.textContent = weatherData.temperature;
        elements.humidity.textContent = weatherData.humidity;
        elements.wind.textContent = weatherData.wind;
        elements.rain.textContent = weatherData.rain;
    }
    
});

// Efeito de digitação no título
document.addEventListener("DOMContentLoaded", function() {
    const typingElement = document.querySelector('.typing-effect');
    
    if (!typingElement) return;
    
    const texts = ["UX/UI Designer", "Front-end Developer", "Angular Specialist"];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isEnd = false;

    function type() {
        const currentText = texts[index];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isEnd = true;
            isDeleting = true;
            setTimeout(type, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            index++;
            if (index === texts.length) index = 0;
            setTimeout(type, 500);
        } else {
            const speed = isDeleting ? 50 : 100;
            setTimeout(type, speed);
        }
    }

    // Iniciar apenas se o elemento estiver visível
    setTimeout(type, 1000)
});

// Atualizar ano no footer
document.getElementById('year').textContent = new Date().getFullYear();

// Formulário de contato
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulação de envio (substituir por código real de envio)
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.querySelector('span').textContent;
    
    submitBtn.querySelector('span').textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
        this.reset();
        submitBtn.querySelector('span').textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Efeito de rolagem suave para o botão "Voltar ao topo"
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Toggle mobile menu
    navToggle.addEventListener("click", function() {
        this.classList.toggle("active");
        navMenu.classList.toggle("active");
        document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.style.overflow = "";
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function(event) {
        if (!event.target.closest('.main-nav') && navMenu.classList.contains('active')) {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // Add active class to current section
    function setActiveLink() {
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-link");
        
        let currentSection = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                currentSection = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").substring(1) === currentSection) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", setActiveLink);
    setActiveLink(); // Set active on load
});

// Efeito de digitação
document.addEventListener("DOMContentLoaded", function() {

    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");
    
    if (!typedTextSpan || !cursorSpan) return;
    
    const textArray = ["UX/UI", "Front-end", "Angular", "Ionic"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if(!cursorSpan.classList.contains("typing")) {
                cursorSpan.classList.add("typing");
            }
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if(!cursorSpan.classList.contains("typing")) {
                cursorSpan.classList.add("typing");
            }
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    // Iniciar apenas se a seção estiver visível
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(type, 1000);
        }
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        observer.observe(heroSection);
    }
});