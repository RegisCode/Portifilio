// Efeito de digitação na primeira seção
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["hard", "fun", "a journey", "LIFE"];
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
    const contactTexts = ['"Hello world"'];
    const typedtext = document.querySelector(".typedtext");
    let removing = false;
    let idx = char = 0;

    setInterval(() => {
        if (char < contactTexts[idx].length) typedtext.innerHTML += contactTexts[idx][char];
        if (char == contactTexts[idx].length + 15) removing = true;
        if (removing) typedtext.innerHTML = typedtext.innerHTML.substring(0, typedtext.innerHTML.length - 1);
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
    const searchWeather = document.getElementById("searchWeather");
    if (searchWeather) {
        searchWeather.addEventListener("click", function(e) {
            e.preventDefault();
            let cep = document.getElementById("cepInput").value;
            requisicaoCep(cep);
        });
    }
    
    // Permitir busca com Enter
    const cepInput = document.getElementById("cepInput");
    if (cepInput) {
        cepInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                let cep = this.value;
                requisicaoCep(cep);
            }
        });
    }
    
});