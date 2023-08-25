window.addEventListener("load", () => {
function typingEffect() {
  const contactTexts = shuffleArray(['"Hello world"']);
  const typedtext = document.querySelector(".typedtext");
  let removing = false;
  let idx = char = 0;

  setInterval(() => { // We define the interval of the typing speed

      // If we do not reach the limit, we insert characters in the html
      if (char < contactTexts[idx].length) typedtext.innerHTML += contactTexts[idx][char];

      // 15*150ms = time before starting to remove characters
      if (char == contactTexts[idx].length + 15) removing = true;

      // Removing characters, the last one always
      if (removing) typedtext.innerHTML = typedtext.innerHTML.substring(0, typedtext.innerHTML.length - 1);

      char++; // Next character

      // When there is nothing else to remove
      if (typedtext.innerHTML.length === 0) {

          // If we get to the end of the texts we start over
          if (idx === contactTexts.length - 1) idx = 0
          else idx++;

          char = 0; // Start the next text by the first character
          removing = false; // No more removing characters
      }

  }, 150); // Typing speed, 150 ms

}
  typingEffect();
  function shuffleArray(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
  }
});

//chamando linkdin
document.addEventListener('DOMContentLoaded', () => { //verificação para ver se o DOM foi carregado
  const btnLinkdin = document.getElementById('btn-linkedin'); //variavel recebendo o id do html
  btnLinkdin.addEventListener("click", () => { 
    window.location.href = "https://www.linkedin.com/in/gabriel-carvalho-77b191147/";
  });
});
//fim da chamada linkedin

// CHAMADA DE API DE PREVISÃO DO TEMPO
$(function(){
	$(".btn-cep").click(function(e){
		e.preventDefault();
		let cep = $(".cep-input").val();
		$(".cep-input").blur();
		requisicaoCep(cep);
		status = true;
	});
	$(".informacoes-btn").click(function(){
		$(".informacoes-painel").fadeToggle(200);
	});
});

function requisicaoCep(cep) {
	$(".waiting").fadeIn(200);
	let url = 'https://viacep.com.br/ws/' + cep + '/json';
	$.get(url,function(data) {
		if(data.hasOwnProperty("erro")) {
			erroConsulta(".alert-cep-nao-encontrado");
		} else {
			let cidade = data.localidade;
			let uf = data.uf;
			$(".localidade").fadeIn(600);
			$(".localidade-cidade").text(cidade);
			$(".localidade-uf").text(uf);
			requisicaoIdClimaTempo(cidade, uf);
		}
	}).fail(function(){
		erroConsulta(".alert-erro-consulta");
	});
}

function requisicaoIdClimaTempo(cidade, uf) {
	let url = "https://apiadvisor.climatempo.com.br/api/v1/locale/city?name="+cidade+"&state="+uf+"&token=c1cdba8979fd4fb41bf76d03b1d04eb9";
	$.get(url, function(data){
		let idCidade = data[0].id;
		previsaoDoTempo(idCidade);
		previsaoDaSemana(idCidade);
	}).fail(function(){
		erroConsulta(".alert-erro-consulta");
	});
}

function previsaoDoTempo(id) {
	let urlHoje = "https://apiadvisor.climatempo.com.br/api/v1/weather/locale/"+id+"/current?token=c1cdba8979fd4fb41bf76d03b1d04eb9";
	$.get(urlHoje,atualizarCardTempo);	
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
	let hoje = capturarDataHoje();
	let url = "https://apiadvisor.climatempo.com.br/api/v1/forecast/locale/"+id+"/days/15?token=c1cdba8979fd4fb41bf76d03b1d04eb9";
	$.get(url,atualizarCardTempoSemana);
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
	
	$(".waiting").fadeOut(200);
}

function capturarDataHoje() {
	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth() + 1;
	if(month < 10) {
		month = "0"+month;
	}
	let year = date.getFullYear();
	let fulldate = day + "/" + month + "/" + year;
	return fulldate;	
}

function erroConsulta(alerta) {
	$(".waiting").fadeOut(200);
	$(alerta).fadeIn(200);
	setTimeout(function(){
		$(alerta).fadeOut(200);
	},5000)
}

